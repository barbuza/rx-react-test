import { Store } from "redux";
import "rxjs/add/observable/combineLatest";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/observeOn";
import "rxjs/add/operator/switchMap";
import { Observable } from "rxjs/Observable";
import { animationFrame } from "rxjs/scheduler/animationFrame";
import { Subject } from "rxjs/Subject";

import { createSetUsersAction } from "./actions";
import { ObservableDb } from "./db";
import { IReduxState, store } from "./reducer";

// tslint:disable-next-line:no-var-requires
const debug = require("debug")("rx:users");

// tslint:disable-next-line:no-var-requires
const shallowEqual = require("shallowequal");

interface IUserData {
  name: string;
  age: number;
}

export interface IUser extends IUserData {
  id: number;
  online: boolean;
}

class ReduxSubject<T> extends Subject<T> {
  constructor(protected reduxStore: Store<IReduxState>, protected project: (state: IReduxState) => T) {
    super();
    reduxStore.subscribe(this.trigger);
  }

  public trigger = () => {
    this.next(this.project(this.reduxStore.getState()));
  };
}

class UserStore {
  protected db$!: ObservableDb;

  constructor() {
    import("./firebase").then(firebaseModule => {
      this.db$ = firebaseModule.db$;

      const config$ = new ReduxSubject(store, state => ({
        limit: state.limit,
        onlineOnly: state.onlineOnly,
      }));

      const subscription = config$
        .debounceTime(200)
        .distinctUntilChanged(shallowEqual)
        .switchMap(({ limit, onlineOnly }) =>
          firebaseModule.db$
            .ref(onlineOnly ? "online" : "users")
            .orderByKey()
            .limitToFirst(limit)
            .keyList(),
        )
        .switchMap(userIds => Observable.combineLatest(userIds.map(this.observableUser)))
        .observeOn(animationFrame)
        .subscribe(users => {
          store.dispatch(createSetUsersAction(users));
        });

      config$.trigger();

      if (module.hot) {
        module.hot.dispose(() => {
          debug("unsubscribe");
          subscription.unsubscribe();
        });
      }
    });
  }

  protected observableUser = (uid: string): Observable<IUser> => {
    const userData$ = this.db$
      .ref("user")
      .child(uid)
      .cast<IUserData>();
    const online$ = this.db$
      .ref("online")
      .child(uid)
      .boolean();

    return Observable.combineLatest(userData$, online$, (userData, online) => ({
      ...userData,
      online,
      id: parseInt(uid, 10),
    }));
  };
}

// tslint:disable-next-line:no-unused-expression
new UserStore();

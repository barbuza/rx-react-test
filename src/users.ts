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
import { store } from "./reducer";

// tslint:disable-next-line:no-var-requires
const debug = require("debug")("rx:users");

interface IUserData {
  name: string;
  age: number;
}

export interface IUser extends IUserData {
  id: number;
  online: boolean;
}

class UserStore {

  protected db$!: ObservableDb;

  constructor() {
    import("./firebase").then((firebaseModule) => {
      this.db$ = firebaseModule.db$;

      const userLimit$: Subject<number> = new Subject();
      store.subscribe(() => {
        userLimit$.next(store.getState().limit);
      });

      const onlineOnly$: Subject<boolean> = new Subject();
      store.subscribe(() => {
        onlineOnly$.next(store.getState().onlineOnly);
      });

      const subscription = Observable
        .combineLatest(userLimit$.distinctUntilChanged(), onlineOnly$.distinctUntilChanged())
        .debounceTime(200)
        .switchMap(([limit, onlineOnly]) =>
          firebaseModule.db$.ref(onlineOnly ? "online" : "users").orderByKey().limitToFirst(limit).keyList())
        .switchMap((userIds) => Observable.combineLatest(userIds.map(this.observableUser)))
        .observeOn(animationFrame)
        .subscribe((users) => {
          store.dispatch(createSetUsersAction(users));
        });

      if (module.hot) {
        module.hot.dispose(() => {
          debug("unsubscribe");
          subscription.unsubscribe();
        });
      }

      userLimit$.next(store.getState().limit);
      onlineOnly$.next(store.getState().onlineOnly);
    });
  }

  protected observableUser = (uid: string): Observable<IUser> => {
    const userData$ = this.db$.ref("user").child(uid).cast<IUserData>();
    const online$ = this.db$.ref("online").child(uid).boolean();

    return Observable.combineLatest(
      userData$, online$,
      (userData, online) => ({ ...userData, online, id: parseInt(uid, 10) }),
    );
  }

}

// tslint:disable-next-line:no-unused-expression
new UserStore();

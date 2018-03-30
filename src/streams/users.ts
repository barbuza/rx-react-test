import { Observable } from "rxjs/Observable";
import { combineLatest } from "rxjs/observable/combineLatest";
import { fromPromise } from "rxjs/observable/fromPromise";
import { of } from "rxjs/observable/of";
import { distinctUntilChanged } from "rxjs/operators/distinctUntilChanged";
import { exhaustMap } from "rxjs/operators/exhaustMap";
import { map } from "rxjs/operators/map";
import { switchMap } from "rxjs/operators/switchMap";
import { Subscription } from "rxjs/Subscription";
import { createSetUsersAction } from "../actions";
import { IStreamApi } from "../createReactor";
import { ObservableDb } from "../db";
import { IReduxState } from "../reducer";

export interface IUser {
  name: string;
  age: number;
  id: string;
  online: boolean;
}

interface IUserListOptions {
  online: boolean;
  limit: number;
}

function userListOptions(state: IReduxState): IUserListOptions {
  return {
    online: state.onlineOnly,
    limit: state.limit,
  };
}

function userListOptionsEqual(a: IUserListOptions, b: IUserListOptions): boolean {
  return a.online === b.online && a.limit === b.limit;
}

const observableUserList = (db$: ObservableDb) => (options: IUserListOptions): Observable<string[]> => {
  return db$
    .ref(options.online ? "online" : "users")
    .orderByKey()
    .limitToFirst(options.limit)
    .keyList();
};

const observableUser = (db$: ObservableDb) => (uid: string): Observable<IUser> => {
  const userData$ = db$
    .ref("user")
    .child(uid)
    .cast({ name: "unknown", age: 0 });

  const online$ = db$
    .ref("online")
    .child(uid)
    .boolean();

  return combineLatest(userData$, online$, ({ age, name }, online) => ({
    age,
    name,
    online,
    id: uid,
  }));
};

export function usersStream(api: IStreamApi<IReduxState>): Subscription {
  return fromPromise(import("../firebase"))
    .pipe(
      exhaustMap(({ db$ }) =>
        api.state$.pipe(
          map(userListOptions),
          distinctUntilChanged(userListOptionsEqual),
          switchMap(observableUserList(db$)),
          switchMap(userIds => (userIds.length ? combineLatest(userIds.map(observableUser(db$))) : of([]))),
          map(createSetUsersAction),
        ),
      ),
    )
    .subscribe(api.dispatch);
}

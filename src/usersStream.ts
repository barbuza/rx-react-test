import "rxjs/add/observable/combineLatest";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import { Observable } from "rxjs/Observable";

import { createSetUsersAction, ISetUsersAction } from "./actions";
import { ObservableDb } from "./db";
import { IReduxState } from "./reducer";

export interface IUser {
  name: string;
  age: number;
  id: number;
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
  const age$ = db$
    .ref("user")
    .child(uid)
    .child("age")
    .number(0);

  const name$ = db$
    .ref("user")
    .child(uid)
    .child("name")
    .string("unknown");

  const online$ = db$
    .ref("online")
    .child(uid)
    .boolean();

  return Observable.combineLatest(age$, name$, online$, (age, name, online) => ({
    age,
    name,
    online,
    id: parseInt(uid, 10),
  }));
};

export function usersStream(state$: Observable<IReduxState>): Observable<ISetUsersAction> {
  return Observable.fromPromise(import("./firebase"))
    .map(x => x.db$)
    .switchMap(db$ =>
      state$
        .map(userListOptions)
        .distinctUntilChanged(userListOptionsEqual)
        .switchMap(observableUserList(db$))
        .switchMap(userIds => Observable.combineLatest(userIds.map(observableUser(db$))))
        .map(createSetUsersAction),
    );
}

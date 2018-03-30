import { DataSnapshot, FirebaseDatabase } from "@firebase/database-types";
import { Omit } from "react-redux";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/exhaustMap";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { createUserAddedAction, isAddUserAction } from "../actions";
import { IStreamApi } from "../createReactor";
import { IReduxState } from "../reducer";
import { IUser } from "./users";

async function addUserPromise(db: FirebaseDatabase, user: Omit<Omit<IUser, "id">, "online">): Promise<IUser> {
  const ids: DataSnapshot = await db
    .ref("user")
    .orderByKey()
    .limitToLast(1)
    .once("value");

  let nextId = 1;
  ids.forEach(snapshot => {
    if (snapshot && snapshot.key) {
      nextId = parseInt(snapshot.key, 10) + 1;
    }
    return false;
  });

  await db
    .ref("user")
    .child(nextId.toString(10))
    .set(user);

  await db
    .ref("users")
    .child(nextId.toString())
    .set(true);

  if (Math.random() > 0.5) {
    await db
      .ref("online")
      .child(nextId.toString())
      .set(true);
  }

  return { ...user, id: nextId, online: false };
}

export function addUserStream(api: IStreamApi<IReduxState>): Subscription {
  return Observable.fromPromise(import("../firebase"))
    .map(x => x.db)
    .exhaustMap(db =>
      api.action$
        .filter(isAddUserAction)
        .exhaustMap(action => Observable.fromPromise(addUserPromise(db, action.user)))
        .map(createUserAddedAction),
    )
    .subscribe(api.dispatch);
}

import { FirebaseDatabase } from "@firebase/database-types";
import { Omit } from "react-redux";
import { fromPromise } from "rxjs/observable/fromPromise";
import { exhaustMap } from "rxjs/operators/exhaustMap";
import { filter } from "rxjs/operators/filter";
import { map } from "rxjs/operators/map";
import { Subscription } from "rxjs/Subscription";

import { createUserAddedAction, isAddUserAction } from "../actions";
import { IStreamApi } from "../createReactor";
import { IReduxState } from "../reducer";
import { IUser } from "./users";

async function addUserPromise(db: FirebaseDatabase, user: Omit<IUser, "id" | "online">): Promise<IUser> {
  const id = await db
    .ref("user")
    .push()
    .then(x => x.key!);

  await db
    .ref("user")
    .child(id)
    .set(user);

  const promises: Array<Promise<any>> = [];

  promises.push(
    db
      .ref("users")
      .child(id)
      .set(true),
  );

  if (Math.random() > 0.5) {
    promises.push(
      db
        .ref("online")
        .child(id)
        .set(true),
    );
  }

  await Promise.all(promises);

  return { ...user, id, online: false };
}

export function addUserStream(api: IStreamApi<IReduxState>): Subscription {
  return fromPromise(import("../firebase"))
    .pipe(
      exhaustMap(({ db }) =>
        api.action$.pipe(
          filter(isAddUserAction),
          exhaustMap(action => fromPromise(addUserPromise(db, action.user))),
          map(createUserAddedAction),
        ),
      ),
    )
    .subscribe(api.dispatch);
}

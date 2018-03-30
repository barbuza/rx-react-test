import { FirebaseDatabase } from "@firebase/database-types";
import { fromPromise } from "rxjs/observable/fromPromise";
import { exhaustMap } from "rxjs/operators/exhaustMap";
import { filter } from "rxjs/operators/filter";
import { map } from "rxjs/operators/map";
import { Subscription } from "rxjs/Subscription";

import { createUserRemovedAction, isRemoveUserAction } from "../actions";
import { IStreamApi } from "../createReactor";
import { IReduxState } from "../reducer";

async function removeUserPromise(db: FirebaseDatabase, id: string): Promise<string> {
  await Promise.all([
    db
      .ref("users")
      .child(id)
      .remove(),
    db
      .ref("online")
      .child(id)
      .remove(),
  ]);

  await db
    .ref("user")
    .child(id)
    .remove();

  return id;
}

export function removeUserStream(api: IStreamApi<IReduxState>): Subscription {
  return fromPromise(import("../firebase"))
    .pipe(
      exhaustMap(({ db }) =>
        api.action$.pipe(
          filter(isRemoveUserAction),
          exhaustMap(action => fromPromise(removeUserPromise(db, action.id))),
          map(createUserRemovedAction),
        ),
      ),
    )
    .subscribe(api.dispatch);
}

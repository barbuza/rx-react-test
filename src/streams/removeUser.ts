import { FirebaseDatabase } from "@firebase/database-types";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/exhaustMap";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
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
  return Observable.fromPromise(import("../firebase"))
    .exhaustMap(({ db }) =>
      api.action$
        .filter(isRemoveUserAction)
        .exhaustMap(action => Observable.fromPromise(removeUserPromise(db, action.id)))
        .map(createUserRemovedAction),
    )
    .subscribe(api.dispatch);
}

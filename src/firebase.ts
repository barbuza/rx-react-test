import firebase from "@firebase/app";
import "@firebase/database";

import { ObservableDb } from "./db";

// tslint:disable-next-line:no-var-requires
const debug = require("debug")("rx:firebase");

const firebaseApp = firebase.initializeApp(
  {
    databaseURL: "https://rxjs-test-8e5d5.firebaseio.com",
  },
  Math.random().toString(16),
);

export const db = firebaseApp.database!();

export const db$ = new ObservableDb(db);

if (module.hot) {
  module.hot.dispose(() => {
    debug("change firebase connection");
    db.goOffline();
  });
}

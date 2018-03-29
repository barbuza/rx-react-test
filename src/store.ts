import { createStore } from "redux";

import { logger } from "./logger";
import { reactor } from "./reactor";
import { IReduxState, reducer } from "./reducer";

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    reloadStoreState?: IReduxState;
  }
}

export const store = reactor(logger<IReduxState>(createStore))(reducer, window.reloadStoreState);

delete window.reloadStoreState;

if (module.hot) {
  module.hot.dispose(() => {
    store.dispose();
    window.reloadStoreState = store.getState();
  });
}

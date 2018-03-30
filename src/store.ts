import { createStore } from "redux";

import { disposeReactor } from "./disposeReactor";
import { logger } from "./logger";
import { reactor } from "./reactor";
import { IReduxState, reducer } from "./reducer";

const preloadedState = (module.hot && module.hot.data && module.hot.data.state) || undefined;

export const store = reactor(logger<IReduxState>(createStore))(reducer, preloadedState);

if (module.hot) {
  module.hot.dispose(data => {
    store[disposeReactor]();
    data.state = store.getState();
  });
}

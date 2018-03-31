import { compose, createStore, StoreEnhancer } from "redux";
import { batchedSubscribe } from "redux-batched-subscribe";

import { isReactorStore } from "./createReactor";
import { disposeReactor } from "./disposeReactor";
import { logger } from "./logger";
import { reactor } from "./reactor";
import { IReduxState, reducer } from "./reducer";

const preloadedState = (module.hot && module.hot.data && module.hot.data.state) || undefined;

const enhancer: StoreEnhancer<IReduxState> = compose(
  reactor,
  logger,
  batchedSubscribe(x => requestAnimationFrame(() => x())),
);

export const store = createStore(reducer, preloadedState, enhancer);

if (module.hot) {
  module.hot.dispose(data => {
    if (isReactorStore(store)) {
      store[disposeReactor]();
    }
    data.state = store.getState();
  });
}

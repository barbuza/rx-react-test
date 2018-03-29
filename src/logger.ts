// tslint:disable:no-console

import { Action, GenericStoreEnhancer, Reducer, StoreEnhancerStoreCreator } from "redux";
import { logDiff } from "./deepDiff";

export const logger: GenericStoreEnhancer = <S>(next: StoreEnhancerStoreCreator<S>): StoreEnhancerStoreCreator<S> => {
  return (reducer: Reducer<S>, preloadedState?: S) => {
    const enhancedReducer = (state: S, action: Action): S => {
      const { type, ...rest } = action;
      const nextState = reducer(state, action);
      if (typeof type === "string" && type.indexOf("@@") !== 0) {
        console.group(`%c%s`, "font-weight: bold", type);
        console.log("%cpayload %c%o", "font-weight: bold", "", rest);
        if (state) {
          console.groupCollapsed("diff");
          logDiff(state, nextState);
          console.groupEnd();
        }
        console.groupEnd();
      }
      return nextState;
    };
    return next(enhancedReducer, preloadedState);
  };
};

// tslint:disable:no-console

import { applyMiddleware, Dispatch, MiddlewareAPI } from "redux";

import { logDiff } from "./deepDiff";

const loggerMiddleware = <S>(store: MiddlewareAPI<S>) => (next: Dispatch<S>) => (action: any) => {
  const { type, ...rest } = action;
  const state = store.getState();
  const result = next(action);
  if (typeof type === "string" && type.indexOf("@@") !== 0) {
    const nextState = store.getState();
    console.group(`%c%s`, "font-weight: bold", type);
    console.log("%cpayload %c%o", "font-weight: bold", "", rest);
    if (state) {
      console.groupCollapsed("diff");
      logDiff(state, nextState);
      console.groupEnd();
    }
    console.groupEnd();
  }
  return result;
};

export const logger = applyMiddleware(loggerMiddleware);

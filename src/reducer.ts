import { createStore } from "redux";

import { isSetLimitAction, isSetUsersAction, isToggleOnlineAction } from "./actions";
import { logDiff } from "./deepDiff";
import { IUser } from "./users";

export interface IReduxState {
  loading: boolean;
  limit: number;
  onlineOnly: boolean;
  users: IUser[];
}

const defaultState: IReduxState = {
  limit: 4,
  loading: true,
  onlineOnly: false,
  users: [],
};

export const store = createStore<IReduxState>((state = defaultState, action) => {
  const { type, ...rest } = action;
  const args: any[] = [`%c${type}`, "font-weight: bold"];
  if (Object.keys(rest).length) {
    args.push(rest);
  }
  // tslint:disable-next-line:no-console
  console.info(...args);

  let nextState = state;

  if (isSetUsersAction(action)) {
    nextState = {
      ...state,
      loading: false,
      users: action.users,
    };
  } else if (isToggleOnlineAction(action)) {
    nextState = {
      ...state,
      loading: true,
      onlineOnly: !state.onlineOnly,
    };
  } else if (isSetLimitAction(action)) {
    nextState = {
      ...state,
      limit: action.limit,
      loading: true,
    };
  }

  logDiff(state, nextState);
  return nextState;
});

if (module.hot) {
  module.hot.dispose(() => {
    throw new Error("reducer doesnt support hmr");
  });
}

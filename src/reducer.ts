import { Action } from "redux";

import { isSetLimitAction, isSetUsersAction, isToggleOnlineAction } from "./actions";
import { IUser } from "./usersStream";

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

export function reducer(state: IReduxState = defaultState, action: Action) {
  if (isSetUsersAction(action)) {
    return {
      ...state,
      loading: false,
      users: action.users,
    };
  } else if (isToggleOnlineAction(action)) {
    return {
      ...state,
      loading: true,
      onlineOnly: !state.onlineOnly,
    };
  } else if (isSetLimitAction(action)) {
    return {
      ...state,
      limit: Math.max(1, Math.min(5, action.limit)),
      loading: true,
    };
  }
  return state;
}

if (module.hot) {
  module.hot.dispose(() => {
    throw new Error("no hmr here");
  });
}

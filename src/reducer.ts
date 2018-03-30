import { Action } from "redux";

import {
  isAddUserAction,
  isSetLimitAction,
  isSetUsersAction,
  isToggleOnlineAction,
  isUserAddedAction,
} from "./actions";
import { IUser } from "./streams/users";

export interface IReduxState {
  loading: boolean;
  limit: number;
  onlineOnly: boolean;
  users: IUser[];
  adding: boolean;
}

const defaultState: IReduxState = {
  limit: 20,
  loading: true,
  adding: false,
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
      limit: Math.max(1, Math.min(50, action.limit)),
      loading: true,
    };
  } else if (isAddUserAction(action)) {
    return {
      ...state,
      adding: true,
      loading: state.limit > state.users.length ? true : state.loading,
    };
  } else if (isUserAddedAction(action)) {
    return {
      ...state,
      adding: false,
    };
  }
  return state;
}

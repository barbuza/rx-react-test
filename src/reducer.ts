import { Action } from "redux";

import {
  isAddUserAction,
  isRemoveUserAction,
  isSetLimitAction,
  isSetUsersAction,
  isToggleOnlineAction,
  isUserAddedAction,
  isUserRemovedAction,
} from "./actions";
import { IUser } from "./streams/users";

export interface IReduxState {
  loading: boolean;
  limit: number;
  onlineOnly: boolean;
  users: IUser[];
  adding: number;
  removing: string[];
}

const defaultState: IReduxState = {
  limit: 20,
  loading: true,
  adding: 0,
  onlineOnly: false,
  users: [],
  removing: [],
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
      adding: state.adding + 1,
      loading: state.limit > state.users.length ? true : state.loading,
    };
  } else if (isUserAddedAction(action)) {
    return {
      ...state,
      adding: state.adding - 1,
    };
  } else if (isRemoveUserAction(action)) {
    return {
      ...state,
      removing: [...state.removing, action.id],
    };
  } else if (isUserRemovedAction(action)) {
    return {
      ...state,
      removing: state.removing.filter(x => x !== action.id),
    };
  }
  return state;
}

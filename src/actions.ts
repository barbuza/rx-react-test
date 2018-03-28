import { Action } from "redux";

import { IUser } from "./users";

export const SET_USERS = "SET_USERS";

export interface ISetUsersAction extends Action {
  type: typeof SET_USERS;
  users: IUser[];
}

export function isSetUsersAction(action: Action): action is ISetUsersAction {
  return action.type === SET_USERS;
}

export function createSetUsersAction(users: IUser[]): ISetUsersAction {
  return {
    type: SET_USERS,
    users,
  };
}

export const SET_LIMIT = "SET_LIMIT";

export interface ISetLimitAction extends Action {
  type: typeof SET_LIMIT;
  limit: number;
}

export function isSetLimitAction(action: Action): action is ISetLimitAction {
  return action.type === SET_LIMIT;
}

export function createSetLimitAction(limit: number): ISetLimitAction {
  return {
    limit,
    type: SET_LIMIT,
  };
}

export const TOGGLE_ONLINE = "TOGGLE_ONLINE";

export interface IToggleOnlineAction extends Action {
  type: typeof TOGGLE_ONLINE;
}

export function isToggleOnlineAction(action: Action): action is IToggleOnlineAction {
  return action.type === TOGGLE_ONLINE;
}

export function createToggleOnlineAction(): IToggleOnlineAction {
  return {
    type: TOGGLE_ONLINE,
  };
}

import { Omit } from "react-redux";
import { Action } from "redux";

import { IUser } from "./streams/users";

const SET_USERS = "SET_USERS";

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

const SET_LIMIT = "SET_LIMIT";

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

const TOGGLE_ONLINE = "TOGGLE_ONLINE";

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

const ADD_USER = "ADD_USER";

export interface IAddUserAction extends Action {
  type: typeof ADD_USER;
  user: Omit<IUser, "id" | "online">;
}

export function createAddUserAction(user: Omit<IUser, "id" | "online">): IAddUserAction {
  return {
    type: ADD_USER,
    user,
  };
}

export function isAddUserAction(action: Action): action is IAddUserAction {
  return action.type === ADD_USER;
}

const USER_ADDED = "USER_ADDED";

export interface IUserAddedAction extends Action {
  type: typeof USER_ADDED;
  user: IUser;
}

export function isUserAddedAction(action: Action): action is IUserAddedAction {
  return action.type === USER_ADDED;
}

export function createUserAddedAction(user: IUser): IUserAddedAction {
  return {
    type: USER_ADDED,
    user,
  };
}

const REMOVE_USER = "REMOVE_USER";

export interface IRemoveUserAction {
  type: typeof REMOVE_USER;
  id: string;
}

export function isRemoveUserAction(action: Action): action is IRemoveUserAction {
  return action.type === REMOVE_USER;
}

export function createRemoveUserAction(id: string): IRemoveUserAction {
  return {
    type: REMOVE_USER,
    id,
  };
}

const USER_REMOVED = "USER_REMOVED";

export interface IUserRemovedAction {
  type: typeof USER_REMOVED;
  id: string;
}

export function isUserRemovedAction(action: Action): action is IUserRemovedAction {
  return action.type === USER_REMOVED;
}

export function createUserRemovedAction(id: string): IUserRemovedAction {
  return {
    type: USER_REMOVED,
    id,
  };
}

import { createReactor } from "./createReactor";
import { IReduxState } from "./reducer";
import { addUserStream } from "./streams/addUser";
import { removeUserStream } from "./streams/removeUser";
import { usersStream } from "./streams/users";

export const reactor = createReactor<IReduxState>(usersStream, addUserStream, removeUserStream);

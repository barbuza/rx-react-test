import { createReactor } from "./createReactor";
import { addUserStream } from "./streams/addUser";
import { removeUserStream } from "./streams/removeUser";
import { usersStream } from "./streams/users";

export const reactor = createReactor(usersStream, addUserStream, removeUserStream);

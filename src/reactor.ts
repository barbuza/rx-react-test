import { createStateReactor } from "./createReactor";
import { usersStream } from "./usersStream";

export const reactor = createStateReactor(usersStream);

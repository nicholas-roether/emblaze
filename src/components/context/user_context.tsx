import { createContext, Resource } from "solid-js";
import { User } from "~/models";

const UserContext = createContext<Resource<User | undefined>>();

export default UserContext;

import { createHook, createStore } from "react-sweet-state";
import { UserRole } from "../../helpers/constants";
import { loadUserFromLocalStorage, logIn, logOut } from "./auth.action";

export type State = {
  userId?: string;
  fullName?: string;
  userName?: string;
  token?: string;
  role?: UserRole;
  expireTime?: number;
  avatar?: string;
};

const initialState: State = {
  userId: undefined,
  fullName: undefined,
  userName: undefined,
  token: undefined,
  role: undefined,
  expireTime: undefined,
  avatar: undefined,
};

const actions = { loadUserFromLocalStorage, logIn, logOut };

export const Store = createStore({
  initialState,
  actions,
  name: "auth",
});

export const useAuth = createHook(Store);

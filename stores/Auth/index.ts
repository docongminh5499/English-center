import { createHook, createStore } from "react-sweet-state";
import { UserRole } from "../../helpers/constants";
import { reload, endLoggingOut, loadUserFromLocalStorage, logIn, logOut, startLoggingOut } from "./auth.action";

export type State = {
  userId?: string;
  fullName?: string;
  userName?: string;
  token?: string;
  role?: UserRole;
  expireTime?: number;
  avatar?: string;
  loggingOut?: boolean;
};

const initialState: State = {
  userId: undefined,
  fullName: undefined,
  userName: undefined,
  token: undefined,
  role: undefined,
  expireTime: undefined,
  avatar: undefined,
  loggingOut: false,
};

const actions = {
  loadUserFromLocalStorage,
  logIn,
  logOut,
  startLoggingOut,
  endLoggingOut,
  reload
};

export const Store = createStore({
  initialState,
  actions,
  name: "auth",
});

export const useAuth = createHook(Store);

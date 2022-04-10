import { createHook, createStore } from "react-sweet-state";
import { UserRole } from "../../helpers/constants";
import { loadUserFromLocalStorage, logIn } from "./auth.action";

export type State = {
  username?: string;
  token?: string;
  role?: UserRole;
  expireTime?: number;
};

const initialState: State = {
  username: undefined,
  token: undefined,
  role: undefined,
  expireTime: undefined,
};

const actions = { loadUserFromLocalStorage, logIn };

const Store = createStore({
  initialState,
  actions,
  name: "auth",
});

export const useAuth = createHook(Store);

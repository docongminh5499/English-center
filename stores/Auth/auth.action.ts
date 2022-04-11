import { Action } from "react-sweet-state";
import { State } from ".";
import { LocalStorageKey, UserRole } from "../../helpers/constants";

export const loadUserFromLocalStorage =
  (): Action<State> =>
  async ({ setState }) => {
    if (typeof window === "undefined") return;
    const localStorageData = localStorage.getItem(LocalStorageKey.USER);
    if (localStorageData !== null) {
      setState(JSON.parse(localStorageData));
    } else {
      setState({ role: UserRole.GUEST });
    }
  };

export const logIn =
  (user: State): Action<State> =>
  async ({ setState }) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LocalStorageKey.USER, JSON.stringify(user));
    setState(user);
  };

export const logOut =
  (): Action<State> =>
  async ({ setState }) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(LocalStorageKey.USER);
    setState({
      username: undefined,
      token: undefined,
      role: UserRole.GUEST,
      expireTime: undefined,
    });
  };

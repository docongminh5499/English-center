import { Action } from "react-sweet-state";
import { State } from ".";
import API from "../../helpers/api";
import { LocalStorageKey, Url, UserRole } from "../../helpers/constants";

export const loadUserFromLocalStorage =
  (): Action<State> =>
    async ({ setState }) => {
      if (typeof window === "undefined") return;
      const localStorageData = localStorage.getItem(LocalStorageKey.USER);

      if (localStorageData !== null) {
        const tokenPayload = JSON.parse(localStorageData);
        try {
          const response = await API.post(Url.users.verify, tokenPayload);
          setState({ token: tokenPayload.token, ...response });
        } catch (error: any) {
          localStorage.removeItem(LocalStorageKey.USER);
          setState({ role: UserRole.GUEST });
        }
      } else {
        setState({ role: UserRole.GUEST });
      }
    };

export const logIn =
  (data: any): Action<State> =>
    async ({ dispatch }) => {
      if (typeof window === "undefined") return;
      const response = await API.post(Url.users.signIn, data);
      localStorage.setItem(LocalStorageKey.USER, JSON.stringify(response));
      dispatch(loadUserFromLocalStorage());
    };

export const logOut =
  (): Action<State> =>
    async ({ setState }) => {
      if (typeof window === "undefined") return;
      localStorage.removeItem(LocalStorageKey.USER);
      setState({
        fullName: undefined,
        userName: undefined,
        token: undefined,
        role: undefined,
        expireTime: undefined,
      });
    };

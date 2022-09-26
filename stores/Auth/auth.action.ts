import { Action, defaultRegistry } from "react-sweet-state";
import { State } from ".";
import API from "../../helpers/api";
import Cookies from 'js-cookie';
import { LocalStorageKey, CookieKey, Url, UserRole } from "../../helpers/constants";
import { Store as SocketStore } from "../Socket";

const SocketStoreInstance = defaultRegistry.getStore(SocketStore);

const setCookieHelper = (key: string, value: any) => {
  const valueString = JSON.stringify(value);
  Cookies.set(key, valueString, { expires: 1 });
}


export const loadUserFromLocalStorage =
  (): Action<State> =>
    async ({ setState }) => {
      if (typeof window === "undefined") return;
      const localStorageData = localStorage.getItem(LocalStorageKey.USER);

      if (localStorageData !== null) {
        const tokenPayload = JSON.parse(localStorageData);
        try {
          const response = await API.post(Url.users.verify, tokenPayload);
          setCookieHelper(CookieKey.USER, {
            token: tokenPayload.token,
            fullName: response.fullName,
            userName: response.userName,
            role: response.role,
            expireTime: response.exp,
            userId: response.userId,
            avatar: response.avatar,
          });
          setState({
            token: tokenPayload.token,
            fullName: response.fullName,
            userName: response.userName,
            role: response.role,
            expireTime: response.exp,
            userId: response.userId,
            avatar: response.avatar,
          });
          SocketStoreInstance.actions.emit("signin", { userId: response.userId });
        } catch (error: any) {
          localStorage.removeItem(LocalStorageKey.USER);
          setCookieHelper(CookieKey.USER, { role: UserRole.GUEST });
          setState({ role: UserRole.GUEST });
        }
      } else {
        setCookieHelper(CookieKey.USER, { role: UserRole.GUEST });
        setState({ role: UserRole.GUEST });
      }
    };

export const logIn =
  (data: any): Action<State> =>
    async ({ dispatch }) => {
      if (typeof window === "undefined") return;
      const response = await API.post(Url.users.signIn, data);
      localStorage.setItem(LocalStorageKey.USER, JSON.stringify(response));
      await dispatch(loadUserFromLocalStorage());
    };

export const logOut =
  (): Action<State> =>
    async ({ setState }) => {
      if (typeof window === "undefined") return;
      localStorage.removeItem(LocalStorageKey.USER);
      setCookieHelper(CookieKey.USER, {});
      setState({
        userId: undefined,
        fullName: undefined,
        userName: undefined,
        token: undefined,
        role: undefined,
        expireTime: undefined,
        avatar: undefined,
      });
      SocketStoreInstance.actions.emit("signout", undefined);
    };

import { Action, defaultRegistry } from "react-sweet-state";
import { State } from ".";
import API from "../../helpers/api";
import Cookies from 'js-cookie';
import { LocalStorageKey, CookieKey, Url, UserRole } from "../../helpers/constants";
import { Store as SocketStore } from "../Socket";

const SocketStoreInstance = defaultRegistry.getStore(SocketStore);

const setCookieHelper = (key: string, value: any, expireTime: Date | number) => {
  const valueString = JSON.stringify(value);
  Cookies.set(key, valueString, { expires: expireTime });
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
          }, new Date(response.exp * 1000));
          setState({
            token: tokenPayload.token,
            fullName: response.fullName,
            userName: response.userName,
            role: response.role,
            expireTime: response.exp,
            userId: response.userId,
            avatar: response.avatar,
          });
          SocketStoreInstance.actions.emit("signin", { userId: response.userId, token: tokenPayload.token });
        } catch (error: any) {
          localStorage.removeItem(LocalStorageKey.USER);
          setCookieHelper(CookieKey.USER, null, 0);
          setState({ role: UserRole.GUEST });
        }
      } else {
        setCookieHelper(CookieKey.USER, null, 0);
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
    async ({ getState, setState }) => {
      if (typeof window === "undefined") return;
      const token = getState().token;

      localStorage.removeItem(LocalStorageKey.USER);
      setCookieHelper(CookieKey.USER, null, 0);
      setState({
        userId: undefined,
        fullName: undefined,
        userName: undefined,
        token: undefined,
        role: UserRole.GUEST,
        expireTime: undefined,
        avatar: undefined,
      });
      SocketStoreInstance.actions.emit("signout", { token });
    };


export const startLoggingOut = (): Action<State> =>
  async ({ setState }) => {
    setState({ loggingOut: true });
  }


export const endLoggingOut = (): Action<State> =>
  async ({ setState }) => {
    setState({ loggingOut: false });
  }
import { Action } from "react-sweet-state";
import { io } from "socket.io-client";
import { State } from ".";
import { production, SocketBaseUrl } from "../../helpers/constants";
import configureSocket from "./configSocket";


export const socketInitialization =
  (): Action<State> =>
    async ({ getState, setState }) => {
      const socket = getState().socket;
      if (socket === undefined) {
        const createdSocket = io(SocketBaseUrl, { secure: production });
        configureSocket(createdSocket);
        setState({ socket: createdSocket });
      }
    };


export const emit =
  (event: string, data: any): Action<State> => async ({ getState }) => {
    const socket = getState().socket;
    if (data)
      socket?.emit(event, data);
    else socket?.emit(event);
  };

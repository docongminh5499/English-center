import { DefaultEventsMap } from "@socket.io/component-emitter";
import { createHook, createStore } from "react-sweet-state";
import { Socket } from "socket.io-client";
import { emit, socketInitialization } from "./socket.action";

export type State = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined
};

const initialState: State = {
  socket: undefined
};

const actions = { socketInitialization, emit };

export const Store = createStore({
  initialState,
  actions,
  name: "socket",
});

export const useSocket = createHook(Store);

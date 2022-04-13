import React from "react";
import { createHook, createStore } from "react-sweet-state";
import { initialModalComponent, closeModal, openModal } from "./modal.actions";

export type State = {
  open: boolean;
  component?: JSX.Element;
};

const initialState: State = {
  open: false,
  component: undefined,
};

const actions = { initialModalComponent, closeModal, openModal };

const Store = createStore({
  initialState,
  actions,
  name: "modal",
});

export const ModalStore = createHook(Store);

import React from "react";
import { Action } from "react-sweet-state";
import { State } from ".";

export const initialModalComponent =
  (
    Component: React.ComponentType<any>,
    props?: Object | undefined
  ): Action<State> =>
  async ({ setState }) => {
    setState({ component: React.createElement(Component, props || {}) });
  };

export const closeModal =
  (): Action<State> =>
  async ({ setState }) => {
    setState({ open: false });
  };

export const openModal =
  (): Action<State> =>
  async ({ setState }) => {
    setState({ open: true });
  };

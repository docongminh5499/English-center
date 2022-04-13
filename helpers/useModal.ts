import React, { useEffect } from "react";
import { ModalStore } from "../stores/Modal";

export function useModal(
  component: React.ComponentType<any>,
  props?: object | undefined
) {
  const [, modalAction] = ModalStore();
  useEffect(() => {
    modalAction.initialModalComponent(component, props);
  }, [component]);
  return [modalAction.openModal, modalAction.closeModal];
}

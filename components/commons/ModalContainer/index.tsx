import { ModalStore } from "../../../stores/Modal";
import styles from "./modal.module.css";

const ModalContainer = () => {
  const [modalState, modalAction] = ModalStore();
  return (
    <div
      className={`${styles.modalContainer} ${
        modalState.open ? styles.modalOpen : styles.modalNotOpen
      }`}
    >
      <div className={styles.overlay} onClick={modalAction.closeModal}></div>
      {modalState.component}
    </div>
  );
};

export default ModalContainer;

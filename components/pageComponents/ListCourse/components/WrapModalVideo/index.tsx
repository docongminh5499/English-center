import { useEffect } from "react";
import styles from "./style.module.css";

interface IProps {
  children?: React.ReactElement;
  isVisible: boolean;
  closeModal: (value: boolean) => void;
  className?: string;
}

const ModalWrapper: React.FC<IProps> = (props: IProps) => {
  const { isVisible, children, closeModal, className = "" } = props;

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isVisible) window.document.body.style.overflow = "hidden";
      else window.document.body.style.overflow = "unset";
    }
  }, [isVisible]);

  return (
    <>
      {isVisible && (
        <div
          onClick={() => closeModal(!isVisible)}
          className={styles.overlayModal}
        ></div>
      )}
      <div
        className={
          isVisible
            ? `${styles.modalVisible} ${styles[className]}`
            : styles.modal
        }
      >
        <div className={styles.modalWrapperInner}>{children}</div>
      </div>
    </>
  );
};

export default ModalWrapper;

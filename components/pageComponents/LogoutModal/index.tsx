import Button from "../../commons/Button";
import styles from "./logout.module.css";

interface IProps {
  onLogout: () => void;
  onCancelLogout: () => void;
}
const LogoutModal = ({ onLogout, onCancelLogout }: IProps) => {
  return (
    <div className={styles.logoutContainer}>
      <p className={styles.title}>Bạn muốn đăng xuất?</p>
      <p className={styles.message}>Bạn có chắc chắn muốn đăng xuất không?</p>
      <div className={styles.buttonWrapper}>
        <Button color="dark" onClick={onCancelLogout}>
          Hủy
        </Button>
        <Button color="red" onClick={onLogout}>
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default LogoutModal;

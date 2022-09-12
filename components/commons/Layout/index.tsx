import Link from "next/link";
import Image from "next/image";
import React, { useCallback } from "react";
import Button from "../Button";
import LogoutModal from "../../pageComponents/LogoutModal";
import { useAuth } from "../../../stores/Auth";
import { UserRole } from "../../../helpers/constants";
import { useModal } from "../../../helpers/useModal";
import styles from "./layout.module.css";
import Sidebar from "../Sidebar";
import { useRouter } from "next/router";

interface IProps {
  children?: React.ReactNode | React.ReactNode[];
  displaySidebar?: Boolean;
  userRole?: UserRole;
}

const Layout = ({ children, displaySidebar, userRole }: IProps) => {
  const [authState, authAction] = useAuth();
  const router = useRouter();

  const onCancelLogout = useCallback(() => {
    closeModal();
  }, []);

  const onLogout = useCallback(() => {
    authAction.logOut();
    closeModal();
  }, [authAction]);

  const [openModal, closeModal] = useModal(LogoutModal, {
    onLogout: onLogout,
    onCancelLogout: onCancelLogout,
  });

  return (
    <React.Fragment>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link href={"/"}>
            <a className={styles.logoContainer}>
              <Image
                src="/assets/icons/ic_logo.png"
                alt="Logo"
                width={36}
                height={36}
              />
              <p>English Center</p>
            </a>
          </Link>
          {authState.role == UserRole.GUEST && (
            <div className={styles.guestNavContainer}>
              <Button href="/login" theme="primary">
                Đăng nhập
              </Button>
              <Button theme="secondary">Đăng ký</Button>
            </div>
          )}

          {authState.role != UserRole.GUEST && (
            <div className={styles.navContainer}>
              <Link href={"#!"} passHref>
                <div>
                  <img src="/assets/icons/ic_notification.png" alt="icon" />
                  <p>Thông báo</p>
                </div>
              </Link>
              <Link href={"#!"} passHref>
                <div>
                  <img src="/assets/icons/ic_chat.png" alt="icon" />
                  <p>Trò chuyện</p>
                </div>
              </Link>
              <div>
                <img src="/assets/icons/ic_user.png" alt="icon" />
                <p>Xin chào, {authState.fullName}</p>
                <div className={styles.menuContainer}>
                  <p onClick={() => openModal()}>Đăng xuất</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.content}>
          {displaySidebar && (
            <Sidebar userRole={userRole} />
          )}
          {children}
        </div>
      </div>
      <div className={styles.footer}></div>
    </React.Fragment>
  );
};

export default Layout;

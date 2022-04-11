import Link from "next/link";
import Image from "next/image";
import React from "react";
import Button from "../Button";
import { useAuth } from "../../../stores/Auth";
import {
  AccountCircle,
  NotificationsNone,
  ChatBubbleOutline,
} from "@mui/icons-material";
import { UserRole } from "../../../helpers/constants";
import styles from "./layout.module.css";

interface IProps {
  children?: React.ReactNode | React.ReactNode[];
}

const Layout = ({ children }: IProps) => {
  const [authState, authAction] = useAuth();

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
              <a>English Center</a>
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
                  <ChatBubbleOutline />
                  <p>Trò chuyện</p>
                </div>
              </Link>
              <Link href={"#!"} passHref>
                <div>
                  <NotificationsNone />
                  <p>Thông báo</p>
                </div>
              </Link>
              <div>
                <AccountCircle />
                <p>Xin chào, {authState.username}</p>
                <div>
                  <p onClick={() => authAction.logOut()}>Đăng xuất</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.mainContent}>{children}</div>
      <div className={styles.footer}></div>
    </React.Fragment>
  );
};

export default Layout;

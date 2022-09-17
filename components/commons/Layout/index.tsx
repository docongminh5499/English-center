import Link from "next/link";
import React, { useCallback, useState } from "react";
import LogoutModal from "../../pageComponents/LogoutModal";
import Sidebar from "../Sidebar";
import Button from '../Button';
import { useAuth } from "../../../stores/Auth";
import { UserRole } from "../../../helpers/constants";
import { useModal } from "../../../helpers/useModal";
import { useRouter } from "next/router";
import { getRoleName } from "../../../helpers/getRoleName";
import { GuestMenu } from './guest.menu';
import styles from "./layout.module.css";
import { ActionIcon, Drawer, Group, MediaQuery } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons";


interface IProps {
  children?: React.ReactNode | React.ReactNode[];
  displaySidebar?: Boolean;
  userRole?: UserRole;
}

const Layout = ({ children, displaySidebar, userRole }: IProps) => {
  const [buttonActive, setButtonActive] = useState(undefined);
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

  const [openedDrawer, setOpenedDrawer] = useState(false);

  return (
    <React.Fragment>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Drawer
            opened={openedDrawer}
            onClose={() => setOpenedDrawer(false)}
            title="Register"
            padding="xl"
            size="300px"
          >
            <Sidebar userRole={userRole} />
          </Drawer>

          {displaySidebar && (
            <MediaQuery largerThan="xs" styles={{ display: 'none' }}>
            <Group position="center">
              <ActionIcon onClick={() => setOpenedDrawer(true)}>
                <IconMenu2 size={18} />
              </ActionIcon>
            </Group>
          </MediaQuery>
          )}
          <Link href={"/"}>
            <a className={styles.logoContainer}>
              <img
                src="/assets/icons/ic_logo.png"
                alt="Logo"
              />
              <p>English Center</p>
            </a>
          </Link>

          {authState.role == UserRole.GUEST && (
            <div className={styles.guestNavContainer}>
              <Button color="blue" onClick={() => router.push("/login")}>
                Đăng nhập
              </Button>
              <Button color="gray" variant="outline">
                Đăng ký
              </Button>
            </div>
          )}


          {authState.role == UserRole.GUEST && (
            <div className={styles.guestNavContainerMobile}>
              <GuestMenu />
            </div>
          )}

          {authState.role != UserRole.GUEST && (
            <div className={styles.navContainer}>
              <div className={`${buttonActive == "notification" ? styles.menuActive : ""}`}>
                <img src="/assets/icons/ic_notification.png" alt="icon" />
                <p className={styles.tabletHidden}>Thông báo</p>
                <div className={styles.menuContainer}>
                  Thông báo test
                </div>
              </div>
              <Link href={"#!"} passHref>
                <div>
                  <img src="/assets/icons/ic_chat.png" alt="icon" />
                  <p className={styles.tabletHidden}>Trò chuyện</p>
                </div>
              </Link>
              <div>
                <img src="/assets/icons/ic_user.png" alt="icon" />
                <p className={styles.tabletHidden}>Xin chào, {authState.fullName}</p>
                <div className={styles.menuContainer}>
                  <div className={styles.menuUserInfo}>
                    <div className={styles.menuUserImg}>
                      <img src="/assets/icons/ic_user.png" alt="icon" />
                    </div>
                    <div className={styles.user}>
                      <p>{authState.fullName}</p>
                      <p>{getRoleName(authState.role)}</p>
                    </div>
                  </div>
                  <div className={styles.divider}></div>
                  {authState.role === UserRole.TUTOR && (
                    <p className={styles.selection}>Đăng ký ca làm</p>
                  )}
                  <p className={styles.selection} onClick={() => openModal()}>Đăng xuất</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    
        <div className={styles.mainContent}>
          <div className={styles.content}>
            <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
              <div className={styles.sidebar}>
                {displaySidebar && (
                  <Sidebar userRole={userRole} />
                )}
              </div>
            </MediaQuery>
            {children}
          </div>
      </div>
      

      <div className={styles.footer}></div>
    </React.Fragment>
  );
};

export default Layout;

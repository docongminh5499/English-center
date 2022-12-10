import { ActionIcon, Group, MediaQuery } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { UserRole } from "../../../helpers/constants";
import { useAuth } from "../../../stores/Auth";
import { useChat } from "../../../stores/Chat";
import { useNotification } from "../../../stores/Notification";
import styles from "./layout.module.css";

import dynamic from "next/dynamic";
const UserMenu = dynamic(() => import("./user.menu").then(module => module.UserMenu));
const GuestMenu = dynamic(() => import("./guest.menu").then(module => module.GuestMenu));
const Sidebar = dynamic(() => import("../Sidebar").then(module => module.default));
const LoadingScreen = dynamic(() => import("../../pageComponents/LoadingScreen").then(module => module.default));
const Button = dynamic(() => import('../Button').then(module => module.default));
const DrawerComponent = dynamic(() => import('./drawer').then(module => module.default));
const IconMenu2 = dynamic(() => import("./IconMenu2").then(module => module.default));
const Link = dynamic(() => import("next/link").then(module => module.default));

interface IProps {
  children?: React.ReactNode | React.ReactNode[];
  displaySidebar?: Boolean;
  loading?: Boolean;
}

const Layout = ({ children, displaySidebar, loading = false }: IProps) => {
  const [authState] = useAuth();
  const [chatState, chatAction] = useChat();
  const [notificationState, notificationAction] = useNotification();
  const router = useRouter();

  useEffect(() => {
    try {
      authState.token && chatAction.getUnreadMessageCount(authState.token);
      authState.token && notificationAction.getUnreadNotificationCount(authState.token);
    } catch (error) {
      console.log(error);
    }
  }, [authState.token])
  const [openedDrawer, setOpenedDrawer] = useState(false);


  return (
    <React.Fragment>
      <DrawerComponent
        openedDrawer={openedDrawer}
        setOpenedDrawer={setOpenedDrawer}
      />
      <div className={styles.header}>
        <div className={styles.headerContent}>
          {displaySidebar && (
            <MediaQuery largerThan={480} styles={{ display: 'none' }}>
              <Group position="center">
                <ActionIcon onClick={() => setOpenedDrawer(true)}>
                  <IconMenu2 size={40} />
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

          {(authState.role === UserRole.GUEST || authState.role === undefined) && !loading && (
            <>
              <div className={styles.guestNavContainer}>
                <Button color="blue" onClick={() => router.push("/login")} aria-label="login">
                  Đăng nhập
                </Button>
                <Button color="gray" variant="outline" onClick={() => router.push("/register")} aria-label="register">
                  Đăng ký
                </Button>
              </div>
              <div className={styles.guestNavContainerMobile}>
                <GuestMenu />
              </div>
            </>
          )}

          {authState.role !== UserRole.GUEST && authState.role !== undefined && !loading && (
            <div className={styles.userNavbarContainer}>
              <UserMenu />
            </div>
          )}
        </div>
      </div>
      <div className={styles.mainContent}>
        {loading && (
          <LoadingScreen />
        )}

        {!loading && (
          <div className={styles.content}>
            <MediaQuery smallerThan={480} styles={{ display: 'none' }}>
              <div className={styles.sidebar}>
                {displaySidebar && (
                  <Sidebar
                    userRole={authState.role}
                    unreadMessageCount={chatState.unreadMessageCount}
                    inMessageScreen={chatState.contacts !== undefined}
                    unreadNotificationCount={notificationState.unreadNotificationCount}
                    inNotificationScreen={notificationState.maxNotificationCount !== undefined}
                  />
                )}
              </div>
            </MediaQuery>
            {children}
          </div>
        )}
      </div>


      <div className={styles.footer}></div>
    </React.Fragment>
  );
};

export default Layout;

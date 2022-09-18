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
import { Menu, Text } from '@mantine/core';
import { IconSettings, IconSearch, IconPhoto, IconMessageCircle, IconTrash, IconArrowsLeftRight } from '@tabler/icons';
import styles from "./layout.module.css";
import LoadingScreen from "../../pageComponents/LoadingScreen";
import { ActionIcon, Drawer, Group, MediaQuery } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons";


interface IProps {
  children?: React.ReactNode | React.ReactNode[];
  displaySidebar?: Boolean;
  userRole?: UserRole;
  loading?: Boolean;
}

const Layout = ({ children, displaySidebar, userRole, loading = false }: IProps) => {
  const [authState, authAction] = useAuth();
  const router = useRouter();

  const onCancelLogout = useCallback(() => {
    closeModal();
  }, []);

  const onLogout = useCallback(async () => {
    await authAction.logOut();
    await closeModal();
    await router.push("/");
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
            // size="300px"
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

          {(authState.role === UserRole.GUEST || authState.role === undefined) && !loading && (
            <>
              <div className={styles.guestNavContainer}>
                <Button color="blue" onClick={() => router.push("/login")}>
                  Đăng nhập
                </Button>
                <Button color="gray" variant="outline">
                  Đăng ký
                </Button>
              </div>
              <div className={styles.guestNavContainerMobile}>
                <GuestMenu />
              </div>
            </>

          )}
        </div>
      </div>
      <div className={styles.mainContent}>
        {loading && (
          <LoadingScreen />
        )}

        {!loading && (
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
        )}
      </div>


      <div className={styles.footer}></div>
    </React.Fragment>
  );
};

export default Layout;

import Link from "next/link";
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Button from '../Button';
import { useAuth } from "../../../stores/Auth";
import { UserRole } from "../../../helpers/constants";
import { useRouter } from "next/router";
import { GuestMenu } from './guest.menu';
import styles from "./layout.module.css";
import LoadingScreen from "../../pageComponents/LoadingScreen";
import { ActionIcon, Drawer, Group, MediaQuery } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons";
import { UserMenu } from "./user.menu";


interface IProps {
  children?: React.ReactNode | React.ReactNode[];
  displaySidebar?: Boolean;
  loading?: Boolean;
}

const Layout = ({ children, displaySidebar, loading = false }: IProps) => {
  const [authState, authAction] = useAuth();
  const router = useRouter();


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
          >
            <Sidebar userRole={authState.role} />
          </Drawer>

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
            <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
              <div className={styles.sidebar}>
                {displaySidebar && (
                  <Sidebar userRole={authState.role} />
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

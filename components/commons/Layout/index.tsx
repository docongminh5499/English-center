import Link from "next/link";
import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Button from '../Button';
import { useAuth } from "../../../stores/Auth";
import { UserRole } from "../../../helpers/constants";
import { useRouter } from "next/router";
import { GuestMenu } from './guest.menu';
import styles from "./layout.module.css";
import LoadingScreen from "../../pageComponents/LoadingScreen";
import { createStyles, ActionIcon, Drawer, Group, MediaQuery, Indicator } from "@mantine/core";
import { IconMenu2, IconBellRinging, IconMessage } from "@tabler/icons";
import { UserMenu } from "./user.menu";
import { employeeSidebar, parentSidebar, studentSidebar, teacherSidebar, tutorSidebar } from "../Sidebar/links";
import { useChat } from "../../../stores/Chat";
import { useNotification } from "../../../stores/Notification";


interface IProps {
  children?: React.ReactNode | React.ReactNode[];
  displaySidebar?: Boolean;
  loading?: Boolean;
}

const Layout = ({ children, displaySidebar, loading = false }: IProps) => {
  const [authState, authAction] = useAuth();
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

  //===========================================================================
  const useStyles = createStyles((theme, _params, getRef) => {
    const icon = getRef('icon');
    return {
      header: {
        marginBottom: "0px",
      },
      drawer: {
        padding: "0.5rem",
        [`@media (max-width: 350px)`]: {
          padding: "0.5rem",
          width: '100%',
        },
      },

      link: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
        padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        '&:hover': {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,

          [`& .${icon}`]: {
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
          },
        },
      },

      linkIcon: {
        ref: icon,
        width: "2.4rem",
        height: "2.4rem",
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
        // marginRight: theme.spacing.sm,

        // [`@media (max-width: 1024px)`]: {
        //   margin: 'auto',
        // },
      },

      linkActive: {
        '&, &:hover': {
          backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
            .background,
          color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
          [`& .${icon}`]: {
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
          },
        },
      }
    };
  });

  const [openedDrawer, setOpenedDrawer] = useState(false);
  const { classes, cx } = useStyles();

  let userDrawer = [
    {
      src: IconBellRinging,
      name: "Thông Báo",
      href: "/notification",
    },
    {
      src: IconMessage,
      name: "Trò chuyện",
      href: "/message",
    },
  ];
  let personalDrawer: any[] = [];
  if (authState.role === UserRole.TEACHER)
    personalDrawer = teacherSidebar;
  else if (authState.role === UserRole.STUDENT)
    personalDrawer = studentSidebar;
  else if (authState.role === UserRole.EMPLOYEE)
    personalDrawer = employeeSidebar;
  else if (authState.role === UserRole.TUTOR)
    personalDrawer = tutorSidebar;
  else if (authState.role === UserRole.PARENT)
    personalDrawer = parentSidebar;
  userDrawer = [...personalDrawer, ...userDrawer];

  const links = userDrawer.map((item) => (
    <div
      onClick={() => {
        router.push(item.href);
        setOpenedDrawer(false);
      }}
      key={item.href}
    >
      <a className={cx(classes.link, { [classes.linkActive]: router.asPath.startsWith(item.href) })}>
        <Group position="apart">
          {item.name === "Trò chuyện"
            && chatState.unreadMessageCount > 0
            && chatState.contacts === undefined ? (
            <Indicator size={8} offset={5} className={classes.linkIcon}>
              <item.src stroke={1.5} />
            </Indicator>
          ) : (item.name === "Thông Báo"
            && notificationState.unreadNotificationCount > 0
            && notificationState.maxNotificationCount === undefined ? (
            <Indicator size={8} offset={5} className={classes.linkIcon}>
              <item.src stroke={1.5} />
            </Indicator>
          ) : (
            <item.src className={classes.linkIcon} stroke={1.5} />
          ))}
          {/* <MediaQuery smallerThan={1024} styles={{ fontSize: '0.9rem', textAlign: 'center', margin: 'auto'}}> */}
          <span style={{ fontSize: '1.5rem' }}>{item.name}</span>
          {/* </MediaQuery> */}
        </Group>
      </a>
    </div>

  ));

  //===========================================================================

  return (
    <React.Fragment>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Drawer
            className={classes.drawer}
            classNames={{ header: classes.header }}
            opened={openedDrawer}
            onClose={() => setOpenedDrawer(false)}
            // title="Register"
            padding="xl"
          >
            {links}
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
                <Button color="gray" variant="outline" onClick={() => router.push("/register")}>
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

import { useCallback, useMemo } from "react";
import { UserRole } from "../../../helpers/constants";
import { employeeSidebar, studentSidebar, teacherSidebar, tutorSidebar } from "./links";
import { useRouter } from "next/router";
import { useState } from 'react';

import {
  createStyles,
  Navbar,
  MediaQuery,
  Group,
  Indicator,
} from '@mantine/core';
import {
  IconBellRinging,
  IconMessage,
} from '@tabler/icons';
import Link from "next/link";

interface IProps {
  unreadNotificationCount: number;
  inNotificationScreen: boolean;
  unreadMessageCount: number;
  inMessageScreen: boolean;
  userRole?: UserRole | null;
}

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    navbar: {
      width: "225px",
      height: "100%",
      flexGrow: 1,

      [`@media (max-width: 1024px)`]: {
        width: '100px',
        padding: "5px"
      },
    },

    header: {
      paddingBottom: theme.spacing.md,
      borderBottom: `2px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `2px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: '1.5rem',
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

      [`@media (max-width: 1024px)`]: {
        margin: 'auto',
      },
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

const Sidebar = (props: IProps) => {
  const router = useRouter();

  const sidebarSelector = useCallback(() => {
    let userSidebar = [
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
    let personalSidebar: any[] = [];
    if (props.userRole === UserRole.TEACHER)
      personalSidebar = teacherSidebar;
    else if (props.userRole === UserRole.STUDENT)
      personalSidebar = studentSidebar;
    else if (props.userRole === UserRole.EMPLOYEE)
      personalSidebar = employeeSidebar;
    else if (props.userRole === UserRole.TUTOR)
      personalSidebar = tutorSidebar;
    return [...personalSidebar, ...userSidebar];

    // TODO: another user role

  }, [props.userRole]);


  const sideBarList = useMemo(() => sidebarSelector(), [props.userRole]);
  const { classes, cx } = useStyles();

  const links = sideBarList.map((item) => (
    <Link href={item.href}
      key={item.href}>
      <a className={cx(classes.link, { [classes.linkActive]: router.asPath.startsWith(item.href) })}>
        <Group position="apart" spacing={8}>
          {item.name === "Trò chuyện" && props.unreadMessageCount > 0 && !props.inMessageScreen ? (
            <Indicator size={8} offset={5} className={classes.linkIcon}>
              <item.src stroke={1.5} />
            </Indicator>
          ) : (item.name === "Thông Báo" && props.unreadNotificationCount > 0 && !props.inNotificationScreen ? (
            <Indicator size={8} offset={5} className={classes.linkIcon}>
              <item.src stroke={1.5} />
            </Indicator>
          ) : (
            <item.src className={classes.linkIcon} stroke={1.5} />
          ))}

          <MediaQuery smallerThan={1024} styles={{ fontSize: '1.2rem', textAlign: 'center', margin: 'auto' }}>
            <span>{item.name}</span>
          </MediaQuery>
        </Group>
      </a>
    </Link>
  ));

  return (
    <Navbar p="md" className={classes.navbar}>
      <Navbar.Section grow>
        {links}
      </Navbar.Section>
    </Navbar>
  );
}

export default Sidebar;

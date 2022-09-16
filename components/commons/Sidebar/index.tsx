
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { UserRole } from "../../../helpers/constants";
import { teacherSidebar } from "./links";

import { useState } from 'react';
import { createStyles, Navbar, MediaQuery, Group, Title, Avatar } from '@mantine/core';
import {
  IconSwitchHorizontal,
  IconLogout,
  IconBrandApple,
  IconBellRinging,
  IconMessage,
} from '@tabler/icons';
import { UserButton } from '../UserButton/UserButton';

interface IProps {
  userRole?: UserRole
}

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    avatar: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderBottom: `2px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
  
      '&:not(:last-of-type)': {
        borderBottom: `1px solid ${
          theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,
      },

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },

    header: {
      paddingBottom: theme.spacing.md,
      borderBottom: `2px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `2px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
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
      color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
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
    },
  };
});

const Sidebar = (props: IProps) => {
  const router = useRouter();

  const sidebarSelector = useCallback(() => {
    var userSidebar = [
      {
        src: IconBellRinging ,
        name: "Thông Báo",
        href: "#!",
      },
      {
        src: IconMessage,
        name: "Trò chuyện",
        href: "#!",
      },
    ];
    if (props.userRole === UserRole.TEACHER)
    return userSidebar.concat(teacherSidebar);

    // TODO: another user role

  }, []);


  const sideBarList = useMemo(() => sidebarSelector(), [props.userRole]);
  console.log(sideBarList)
//======================================================================================================================
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('Billing');

  const links = sideBarList.map((item) => (
    <a
      className={cx(classes.link, { [classes.linkActive]: item.name === active })}
      href={item.href}
      key={item.name}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.name);
      }}
    >
      <Group position="apart">
        <item.src className={classes.linkIcon} stroke={1.5} />
        <MediaQuery smallerThan="sm" styles={{ fontSize: '0.9rem'}}>
          <span>{item.name}</span>
        </MediaQuery>
      </Group>
    </a>
  ));

  return (
    <MediaQuery smallerThan="sm" styles={{ width: '100px' }}>     
      <Navbar height={700} width={{ sm: 300 }} p="md" className={classes.navbar}>
        <Group className={classes.header}>
          <IconBrandApple className={classes.linkIcon} stroke={1.5} />
          <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <Title order={3}>ENGLISH CENTER</Title>
          </MediaQuery>
        </Group>

        <Navbar.Section className={classes.avatar}>
          <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <UserButton
              image="https://i.imgur.com/fGxgcDF.png"
              name="Bob Rulebreaker"
              email="Product owner"
            />
          </MediaQuery>
          
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Avatar src="https://i.imgur.com/fGxgcDF.png" radius="xl" />
          </MediaQuery>
        </Navbar.Section>

        <Navbar.Section grow>
          {links}
        </Navbar.Section>
        
        <Navbar.Section className={classes.footer}>
          <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
            <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <span>Thay Đổi Tài Khoản</span>
            </MediaQuery>
          </a>

          <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <span>Đăng Xuất</span>
            </MediaQuery>
          </a>
        </Navbar.Section>
      </Navbar>
    </MediaQuery>
  );
}
//========================================================================================================================

export default Sidebar;

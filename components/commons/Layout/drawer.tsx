import { createStyles, Drawer, Group, Indicator } from "@mantine/core";
import { IconBellRinging, IconMessage } from "@tabler/icons";
import { useRouter } from "next/router";
import { UserRole } from "../../../helpers/constants";
import { useAuth } from "../../../stores/Auth";
import { useChat } from "../../../stores/Chat";
import { useNotification } from "../../../stores/Notification";
import { employeeSidebar, parentSidebar, studentSidebar, teacherSidebar, tutorSidebar } from "../Sidebar/links";

const CustomDrawer = (props: any) => {
  const [authState] = useAuth();
  const [chatState] = useChat();
  const [notificationState] = useNotification();
  const router = useRouter();


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
        props.setOpenedDrawer(false);
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
          <span style={{ fontSize: '1.5rem' }}>{item.name}</span>
        </Group>
      </a>
    </div>
  ));

  return (
    <Drawer
      className={classes.drawer}
      classNames={{ header: classes.header }}
      opened={props.openedDrawer}
      onClose={() => props.setOpenedDrawer(false)}
      padding="xl"
    >
      {links}
    </Drawer>
  );
}


export default CustomDrawer;
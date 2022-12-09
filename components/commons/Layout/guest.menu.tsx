import { Button, Menu, useMantineTheme } from '@mantine/core';
import {
    IconCommand, IconSquareCheck, IconUsers
} from '@tabler/icons';
import { useRouter } from 'next/router';

export function GuestMenu() {
  const theme = useMantineTheme();
  const router = useRouter();

  return (
    <Menu transition="pop-top-right" position="top-end" width="auto">
      <Menu.Target>
        <Button variant="outline" compact={true} aria-label="personal menu dropdown">
          <IconCommand size={"1.6rem"} color={theme.colors.blue[6]} stroke={1.5} />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => router.push('/login')}
          icon={<IconUsers size={"1.6rem"} color={theme.colors.cyan[6]} stroke={1.5} />}>
          Đăng nhập
        </Menu.Item>
        <Menu.Item
          onClick={() => router.push('/register')}
          icon={<IconSquareCheck size={"1.6rem"} color={theme.colors.pink[6]} stroke={1.5} />}>
          Đăng ký
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
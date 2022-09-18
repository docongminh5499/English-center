import { Avatar, Container, Group, MediaQuery, Menu, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import {
  IconUserCircle,
  IconSwitchHorizontal,
  IconLogout,
} from '@tabler/icons';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { getRoleName } from '../../../helpers/getRoleName';
import { useModal } from '../../../helpers/useModal';
import { useAuth } from '../../../stores/Auth';
import LogoutModal from '../../pageComponents/LogoutModal';

export function UserMenu() {
  const [authState, authAction] = useAuth();
  const theme = useMantineTheme();
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

  return (
    <Menu transition="pop-top-right" position="top-end" width="auto">
      <Menu.Target>
        <UnstyledButton>
          <Group>
            <Avatar size={40} color="blue" radius='xl'>A</Avatar>
            <MediaQuery smallerThan={480} styles={{ display: 'none' }}>
              <div>
                <Text weight={500}>{authState.fullName}</Text>
                <Text size="xs" color="dimmed">{getRoleName(authState.role)}</Text>
              </div>
            </MediaQuery>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <MediaQuery largerThan={480} styles={{ display: 'none' }}>
          <div>
            <Container>
              <Text align='center' weight={500}>{authState.fullName}</Text>
              <Text size="xs" color="dimmed" align='center'>{getRoleName(authState.role)}</Text>
            </Container>
            <Menu.Divider />
          </div>
        </MediaQuery>
        <Menu.Item
          onClick={() => null}
          icon={<IconUserCircle size={"1.6rem"} color={theme.colors.cyan[6]} stroke={1.5} />}>
          Tài khoản cá nhân
        </Menu.Item>
        <Menu.Item icon={<IconSwitchHorizontal size={"1.6rem"} color={theme.colors.violet[6]} stroke={1.5} />}>
          Thay đổi tài khoản
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color={theme.colors.red[6]}
          onClick={() => openModal()}
          icon={<IconLogout size={"1.6rem"} color={theme.colors.red[6]} stroke={1.5} />}>
          Đăng xuất
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
import { Avatar, Container, Group, MediaQuery, Menu, Modal, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconUserCircle,
  IconSwitchHorizontal,
  IconLogout,
  IconBrandEdge,
} from '@tabler/icons';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { UserRole } from '../../../helpers/constants';
import { getRoleName } from '../../../helpers/getRoleName';
import { getAvatarImageUrl } from '../../../helpers/image.helper';
import { useAuth } from '../../../stores/Auth';
import LogoutModal from '../../pageComponents/LogoutModal';

export function UserMenu() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const isMobile = useMediaQuery('(max-width: 480px)');
  const [authState, authAction] = useAuth();
  const theme = useMantineTheme();
  const router = useRouter();


  const onCancelLogout = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const onLogout = useCallback(async () => {
    await authAction.startLoggingOut();
    await router.push("/");
    await authAction.logOut();
    setTimeout(() => {
      authAction.endLoggingOut();
      router.replace("/");
    }, 100);
    setIsOpenModal(false);
  }, [authAction]);


  return (
    <>
      <Modal
        opened={isOpenModal}
        onClose={onCancelLogout}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <LogoutModal
          onLogout={onLogout}
          onCancelLogout={onCancelLogout}
        />
      </Modal>

      <Menu transition="pop-top-right" position="top-end" width="auto">
        <Menu.Target>
          <UnstyledButton>
            <Group>
              <Avatar size={isMobile ? 32 : 40} color="blue" radius='xl' src={getAvatarImageUrl(authState.avatar)} />
              <MediaQuery smallerThan={480} styles={{ display: 'none' }}>
                <div>
                  <Text weight={500} color="#444">{authState.fullName}</Text>
                  <Text style={{ fontSize: "1.2rem" }} color="dimmed">{getRoleName(authState.role)}</Text>
                </div>
              </MediaQuery>
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <MediaQuery largerThan={480} styles={{ display: 'none' }}>
            <div>
              <Container>
                <Text align='center' weight={500} color="#444">{authState.fullName}</Text>
                <Text style={{ fontSize: "1.2rem" }} color="dimmed" align='center'>{getRoleName(authState.role)}</Text>
              </Container>
              <Menu.Divider />
            </div>
          </MediaQuery>
          {!authState.guestUI &&
            (authState.role === UserRole.PARENT || authState.role === UserRole.STUDENT) && (
              <Menu.Item
                onClick={async () => {
                  await authAction.turnOnGuestUI();
                  await router.push("/");
                }}
                color="#444"
                icon={<IconBrandEdge size={"1.6rem"} color={theme.colors.pink[6]} stroke={1.5} />}>
                Giao diện khách
              </Menu.Item>
            )}
          {authState.guestUI &&
            (authState.role === UserRole.PARENT || authState.role === UserRole.STUDENT) && (
              <Menu.Item
                onClick={async () => {
                  await authAction.turnOffGuestUI();
                  await router.push("/");
                }}
                color="#444"
                icon={<IconBrandEdge size={"1.6rem"} color={theme.colors.pink[6]} stroke={1.5} />}>
                Giao diện cá nhân
              </Menu.Item>
            )}
          {!authState.guestUI && (
            <>
              <Menu.Item
                onClick={() => router.push('/personal')}
                color="#444"
                icon={<IconUserCircle size={"1.6rem"} color={theme.colors.cyan[6]} stroke={1.5} />}>
                Tài khoản cá nhân
              </Menu.Item>
              <Menu.Item
                onClick={() => router.push("/modify-personal")}
                color="#444"
                icon={<IconSwitchHorizontal size={"1.6rem"} color={theme.colors.violet[6]} stroke={1.5} />}>
                Chỉnh sửa tài khoản
              </Menu.Item>
            </>
          )}
          <Menu.Divider />
          <Menu.Item
            color={theme.colors.red[6]}
            onClick={() => setIsOpenModal(true)}
            icon={<IconLogout size={"1.6rem"} color={theme.colors.red[6]} stroke={1.5} />}>
            Đăng xuất
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
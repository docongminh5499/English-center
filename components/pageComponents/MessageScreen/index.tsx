import { ActionIcon, Avatar, Card, Indicator, ScrollArea, Space, Text, TextInput, useMantineTheme } from '@mantine/core';
import { IconSearch, IconSend } from '@tabler/icons';
import Head from 'next/head';
import styles from './message.module.css';

const MessageScreen = () => {
  const theme = useMantineTheme();

  return (
    <>
      <Head>
        <title>Tin nhắn</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.pageContainer}>
        <div className={styles.messageContainer}>
          <div className={styles.messageInfoContainer}>
            <Indicator dot inline size={16} offset={7} position="bottom-end" color="red" withBorder>
              <Avatar
                size="md"
                radius="xl"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
              />
            </Indicator>
            <Space w={15} />
            <div style={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                Đỗ Công Minh
              </Text>
              <Text color="dimmed" size="xs">
                Học viên
              </Text>
            </div>
          </div>

          <span className={styles.divider}></span>

          <div className={styles.messages}>
            <Card withBorder radius="md" p="md" className={styles.yours}>
              <Card.Section p="xs">
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit (1)  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </Text>
                <Space h={10} />
                <Text color="dimmed" size="xs">
                  20:14 01/01/2022
                </Text>
              </Card.Section>
            </Card>
            <Card withBorder radius="md" p="md" className={styles.mine}>
              <Card.Section p="xs">
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit (2)  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </Text>
                <Space h={10} />
                <Text align='end' size="xs">
                  20:14 01/01/2022
                </Text>
              </Card.Section>
            </Card>
          </div>
          <div className={styles.messageInputContainer}>
            <TextInput
              radius="xl"
              size="md"
              rightSection={
                <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
                  <IconSend size={18} stroke={1.5} />
                </ActionIcon>
              }
              placeholder="Nhập tin nhắn..."
              rightSectionWidth={42}
            />
          </div>
        </div>

        <div className={styles.contactContainer}>
          <Text size="xl" weight={700} align='center'>
            Trò chuyện
          </Text>
          <Space h={10} />
          <TextInput
            icon={<IconSearch size={18} stroke={1.5} />}
            radius="xl"
            size="sm"
            placeholder="Tìm kiếm trò chuyện"
            rightSectionWidth={42}
          />
          <Space h={20} />
          <ScrollArea style={{ height: 250 }}>
            <div className={styles.contact}>
              <Indicator dot inline size={16} offset={7} position="bottom-end" color="red" withBorder>
                <Avatar
                  size="md"
                  radius="xl"
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
                />
              </Indicator>
              <Space w={15} />
              <div style={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  Đỗ Công Minh
                </Text>
                <Text color="dimmed" size="xs" className={styles.textOneLine} >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Text>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

export default MessageScreen;
import { ActionIcon, Avatar, Card, Container, Divider, Indicator, ScrollArea, Space, Text, TextInput, useMantineTheme } from '@mantine/core';
import { IconSearch, IconSend } from '@tabler/icons';
import { useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from './message.module.css';


const MessageScreen = () => {
  const theme = useMantineTheme();
  const viewport = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  const scrollToBottom = () =>
    viewport.current.scrollTo({
      top: viewport.current.scrollHeight, behavior: 'smooth'
    });
  useEffect(() => scrollToBottom(), [])

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
              <Text size="sm" weight={500} color="#444">
                Đỗ Công Minh
              </Text>
              <Text color="dimmed" size="xs">
                Học viên
              </Text>
            </div>
          </div>

          <Divider />

          <ScrollArea className={styles.messages} viewportRef={viewport}>
            {Array(20).fill(0).map((_, index) => {
              let className = "";
              let messageColor = "";
              let dateColor = "";

              if (index % 2 == 0) {
                className = styles.yours;
                messageColor = "#444";
                dateColor = "dimmed";
              } else {
                className = styles.mine;
                messageColor = "white";
                dateColor = "white";
              }

              return (
                <Card withBorder radius="md" p="md" className={className} key={index}>
                  <Card.Section p="xs">
                    <Text color={messageColor}>
                      ({index}) Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit
                    </Text>
                    <Space h={10} />
                    <Text color={dateColor} size="xs">
                      20:14 01/01/2022
                    </Text>
                  </Card.Section>
                </Card>
              );
            })}
          </ScrollArea>


          <div className={styles.messageInputContainer}>
            <TextInput
              styles={{ input: { color: "#444" } }}
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
          <Text size="xl" weight={700} align='center' color="#444">
            Trò chuyện
          </Text>
          <Space h={10} />
          <TextInput
            styles={{ input: { color: "#444" } }}
            icon={<IconSearch size={18} stroke={1.5} />}
            radius="xl"
            size="sm"
            placeholder="Tìm kiếm trò chuyện"
            rightSectionWidth={42}
          />
          <Space h={20} />
          <ScrollArea style={{ flex: 1 }}>
            {Array(20).fill(0).map((_, index) => (
              <Container mb="1.5rem" className={styles.contact} key={index}>
                <Indicator dot inline size={16} offset={7} position="bottom-end" color="red" withBorder>
                  <Avatar
                    size="md"
                    radius="xl"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
                  />
                </Indicator>
                <Container style={{ flex: 1 }}>
                  <Text size="sm" weight={500} color="#444">
                    Đỗ Công Minh
                  </Text>
                  <Text color="dimmed" size="xs" lineClamp={1} >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Text>
                </Container>
              </Container>
            ))}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

export default MessageScreen;
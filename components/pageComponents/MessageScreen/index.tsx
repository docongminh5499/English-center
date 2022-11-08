import { ActionIcon, Avatar, Card, Container, Divider, Group, Indicator, Input, Loader, Modal, ScrollArea, Space, Text, useMantineTheme } from '@mantine/core';
import { IconBrandMessenger, IconChecks, IconSearch, IconSend } from '@tabler/icons';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import styles from './message.module.css';
import { useInputState, useMediaQuery } from '@mantine/hooks';
import Button from '../../commons/Button';
import { useChat } from '../../../stores/Chat';
import Loading from '../../commons/Loading';
import { useAuth } from '../../../stores/Auth';
import { toast } from 'react-toastify';
import { TimeZoneOffset, Url } from '../../../helpers/constants';
import ChatUser from '../../../models/chatUser.model';
import { getRoleName } from '../../../helpers/getRoleName';
import moment from 'moment';
import { useSocket } from '../../../stores/Socket';
import { getAvatarImageUrl } from '../../../helpers/image.helper';


const MessageScreen = () => {
  const theme = useMantineTheme();
  const [openModal, setOpenModal] = useState(false);
  const [findName, setFindName] = useInputState("");
  const [message, setMessage] = useInputState("");
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [firstEnterChatBox, setFirstEnterChatBox] = useState(true);
  const [previousScrollHeight, setPreviusScrollHeight] = useState(0);
  const [chatState, chatAction] = useChat();
  const [, socketAction] = useSocket();
  const [authState] = useAuth();
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isSmallTablet = useMediaQuery('(max-width: 768px)');
  const viewport = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

  const [isLoadingFoundContacts, setIsLoadingFoundContacts] = useState(false);
  const findContactViewport = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const [isLoadingExistedContacts, setIsLoadingExistedContacts] = useState(false);
  const getExistedContactViewport = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    const getAllContacts = async () => {
      const token = authState.token || "";
      await chatAction.getContacts(token);
    }
    getAllContacts().catch((error) => {
      console.log(error);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại")
    });
    return () => {
      chatAction.resetData();
      authState.token && chatAction.getUnreadMessageCount(authState.token);
    }
  }, []);



  useEffect(() => {
    !loadingMessage && viewport.current && viewport.current.scrollTo({
      top: viewport.current.scrollHeight, behavior: 'smooth'
    });
  }, [chatState.currentBox?.user.userId, chatState.currentBox?.messages?.length])



  useEffect(() => {
    const onScrollComplete = (event: any) => {
      const element = event.target;
      const verticalThreshold = 50;
      if (element.scrollTop > verticalThreshold)
        firstEnterChatBox && setFirstEnterChatBox(false);
    }
    viewport.current && viewport.current.addEventListener("scroll", onScrollComplete);
    return () => viewport.current && viewport.current.removeEventListener("scroll", onScrollComplete);
  }, [viewport.current]);



  useEffect(() => {
    if (loadingMessage) {
      const verticalThreshold = 50;
      viewport.current.scrollBy({ top: viewport.current.scrollHeight - previousScrollHeight - verticalThreshold });
      setLoadingMessage(false);
    }
  }, [chatState.currentBox?.messages?.length])



  const onCloseModal = useCallback(() => {
    setIsLoadingFoundContacts(false);
    setOpenModal(false);
    setFindName("");
    chatAction.clearSearchResults();
  }, []);



  const onStartChatBox = useCallback(async (targetUser: ChatUser) => {
    try {
      const token = authState.token || "";
      await chatAction.startChatBox(token, targetUser);
      setFirstEnterChatBox(true);
      setLoadingMessage(false);
      seenMessage(targetUser.userId);
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại")
    }
  }, [authState.token]);



  const onSubmitSearchForm = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const token = authState.token || "";
      setIsLoadingFoundContacts(false);
      await chatAction.clearSearchResults();
      await chatAction.findContacts(token, findName)
    } catch (err) {
      console.log(err);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại");
    }
  }, [authState.token, findName])



  const onSendMessage = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message === undefined || message.trim() === "")
      return;
    const payload = {
      senderId: Number(authState.userId),
      receiverId: chatState.currentBox?.user.userId,
      message: message,
      token: authState.token,
    };
    socketAction.emit("message", payload);
    setMessage("");
  }, [message, authState, chatState]);



  const onScrollPositionChange = useCallback(async (positions: any) => {
    if (chatState.currentBox === undefined) return;
    if (firstEnterChatBox === true) return;
    const verticalThreshold = 50;
    const maxMessageCount = chatState.currentBox?.maxMessageCount || 0;
    const currentMessageCount = chatState.currentBox?.messages?.length || 0;
    const token = authState.token || "";
    if (currentMessageCount < maxMessageCount && !loadingMessage && positions.y < verticalThreshold) {
      try {
        setLoadingMessage(true);
        setPreviusScrollHeight(viewport.current.scrollHeight);
        await chatAction.getMoreMessages(token, currentMessageCount, chatState.currentBox?.user);
      } catch (error) {
        console.log(error);
        setLoadingMessage(false);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại");
      }
    }
  }, [authState.token, chatState.currentBox, loadingMessage, firstEnterChatBox]);



  const onScrollFindContacts = useCallback(async (positions: any) => {
    const verticalThreshold = 50;
    if (!isLoadingFoundContacts &&
      chatState.totalSearchResults > chatState.searchResults.length &&
      findContactViewport.current.offsetHeight + findContactViewport.current.scrollTop >= findContactViewport.current.scrollHeight - verticalThreshold) {
      try {
        setIsLoadingFoundContacts(true);
        await chatAction.findContacts(authState.token || "", findName);
        setIsLoadingFoundContacts(false);
      } catch (error) {
        console.log(error);
        setIsLoadingFoundContacts(false);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại");
      }
    }
  }, [authState.token, findName, isLoadingFoundContacts, chatState.totalSearchResults, chatState.searchResults.length, findContactViewport.current]);



  const onScrollGetExistedContacts = useCallback(async (positions: any) => {
    const verticalThreshold = 50;
    if (!isLoadingExistedContacts &&
      chatState.totalContacts > (chatState.contacts || []).length &&
      getExistedContactViewport.current.offsetHeight + getExistedContactViewport.current.scrollTop >= getExistedContactViewport.current.scrollHeight - verticalThreshold) {
      try {
        setIsLoadingExistedContacts(true);
        await chatAction.getContacts(authState.token || "");
        setIsLoadingExistedContacts(false);
      } catch (error) {
        console.log(error);
        setIsLoadingExistedContacts(false);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại");
      }
    }
  }, [authState.token, isLoadingExistedContacts, chatState.totalContacts, chatState.contacts?.length, getExistedContactViewport.current]);



  const seenMessage = useCallback((senderId?: number) => {
    socketAction.emit("seen_message", { sender: { userId: senderId }, token: authState.token });
  }, [])



  return (
    <>
      <Head>
        <title>Tin nhắn</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal
        opened={openModal}
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
        onClose={onCloseModal}
        closeOnClickOutside
        centered
      >
        <div className={styles.modalContainer}>
          <form onSubmit={onSubmitSearchForm}>
            <Input
              value={findName}
              onChange={setFindName}
              placeholder="Nhập tên người mà bạn muốn tìm kiếm..."
            />
          </form>
          <Space h={10} />
          <ScrollArea
            style={{ height: '300px' }}
            type={isSmallTablet ? "never" : "scroll"}
            viewportRef={findContactViewport}
            onScrollPositionChange={onScrollFindContacts}>
            {chatState.searchResults.map((contact, index) => (
              <Container key={index} py={10} px={15} className={styles.contact} onClick={() => {
                onCloseModal();
                onStartChatBox(contact.user);
              }}>
                <Indicator dot inline size={12} offset={3} position="bottom-end" color={contact.user.isActive ? "green" : "red"} withBorder>
                  <Avatar
                    size="md"
                    radius="xl"
                    src={getAvatarImageUrl(contact.user.userAvatar)}
                  />
                </Indicator>
                <Space w={15} />
                <div style={{ flex: 1 }}>
                  <Text style={{ fontSize: "1.4rem" }} weight={500} color="#444">
                    {contact.user.userFullName}
                  </Text>
                  <Text style={{ fontSize: "1rem" }} color="dimmed">
                    {getRoleName(contact.user.userRole)}
                  </Text>
                </div>
              </Container>
            ))}
            {isLoadingFoundContacts && (
              <Container style={{ display: "flex", justifyContent: "center" }} my={20} p={0}>
                <Loader variant='dots' />
              </Container>
            )}
          </ScrollArea>
        </div>
      </Modal>


      <div className={styles.pageContainer}>
        <div className={styles.messageContainer}>

          {chatState.currentBox === undefined && (
            <Container style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%"
            }}>
              <IconBrandMessenger
                color='#DEE2E6'
                style={{ width: "12rem", height: "12rem" }}
              />
              <Space h={10} />
              <Text style={{ fontSize: "1.4rem", color: '#DEE2E6' }}>
                Hãy bắt đầu trò chuyện
              </Text>
            </Container>
          )}

          {chatState.currentBox && (
            <>
              <div className={styles.messageInfoContainer}>
                <Indicator
                  dot inline size={16} offset={7} position="bottom-end"
                  color={chatState.currentBox.user.isActive ? "green" : "red"}
                  withBorder>
                  <Avatar
                    size="md"
                    radius="xl"
                    src={getAvatarImageUrl(chatState.currentBox.user.userAvatar)}
                  />
                </Indicator>
                <Space w={15} />
                <div style={{ flex: 1 }}>
                  <Text style={{ fontSize: "1.4rem" }} weight={500} color="#444">
                    {chatState.currentBox.user.userFullName}
                  </Text>
                  <Text color="dimmed" style={{ fontSize: "1.2rem" }}>
                    {getRoleName(chatState.currentBox.user.userRole)}
                  </Text>
                </div>
              </div>

              <Divider />

              <ScrollArea
                style={{ flex: 1 }}
                className={styles.messages}
                viewportRef={viewport}
                onScrollPositionChange={onScrollPositionChange}>
                {loadingMessage && (
                  <Container style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }} px={10} py={20}>
                    <Loader variant='dots' />
                  </Container>
                )}

                {chatState.currentBox.messages?.map((message, index) => {
                  let className = "";
                  let messageColor = "";
                  let dateColor = "";
                  let iconColor = "";

                  if (message.senderId == authState.userId) {
                    className = styles.mine;
                    messageColor = "blue";
                    dateColor = "blue";
                    iconColor = "#228BE6";
                  } else if (message.senderId == chatState.currentBox?.user.userId) {
                    className = styles.yours;
                    messageColor = "#444";
                    dateColor = "dimmed";
                    iconColor = "#868E96";
                  }

                  return (
                    <Card withBorder radius="md" p="md" className={className} key={index}>
                      <Card.Section p="xs">
                        <Text color={messageColor} style={{ fontSize: "1.4rem" }}>
                          {message.messageContent}
                        </Text>
                        <Space h={10} />
                        <Group spacing="sm">
                          <Text color={dateColor} style={{ fontSize: "1.0rem" }}>
                            {moment(message.sendingTime).utcOffset(TimeZoneOffset).format("HH:mm DD-MM-YYYY")}
                          </Text>
                          {message.read && message.senderId == authState.userId && (
                            <IconChecks size="1.3rem" color={iconColor} />
                          )}
                        </Group>
                      </Card.Section>
                    </Card>
                  );
                })}
              </ScrollArea>

              {!chatState.currentBox.messages && (
                <Container style={{
                  display: "flex",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center"
                }} px={10} py={20}>
                  <Loader variant='dots' />
                </Container>
              )}


              <form onSubmit={onSendMessage} className={styles.messageInputContainer}>
                <Input
                  disabled={chatState.currentBox && !chatState.currentBox.messages}
                  onFocus={() => seenMessage(chatState.currentBox?.user.userId)}
                  value={message}
                  onChange={setMessage}
                  styles={{ input: { color: "#444" } }}
                  radius="xl"
                  size={isMobile ? "sm" : "md"}
                  rightSection={
                    <ActionIcon
                      disabled={chatState.currentBox && !chatState.currentBox.messages}
                      size={32} radius="xl" color={theme.primaryColor} variant="filled"
                      type='submit'>
                      <IconSend size={18} stroke={1.5} />
                    </ActionIcon>
                  }
                  placeholder="Nhập tin nhắn..."
                  rightSectionWidth={42}
                />
              </form>
            </>
          )}
        </div>

        <div className={styles.contactContainer}>
          <Text
            style={{
              fontSize: "2rem",
              display: isSmallTablet ? "none" : "block"
            }}
            weight={700}
            align='center'
            color="#444">
            Trò chuyện
          </Text>
          <Space h={10} />

          {isSmallTablet ?
            <ActionIcon
              onClick={() => setOpenModal(true)}
              style={{ width: "100%" }}
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan' }} size="lg">
              <IconSearch size={18} />
            </ActionIcon> : (
              <Button
                onClick={() => setOpenModal(true)}
                leftIcon={<IconSearch />}
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}>
                <Text style={{ fontSize: "1.4rem" }}>Tìm kiếm</Text>
              </Button>
            )}

          <Space h={20} />

          {chatState.contacts === undefined && (
            <Container style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}>
              <Loading />
            </Container>
          )}

          <ScrollArea
            style={{ flex: 1 }}
            type={isSmallTablet ? "never" : "scroll"}
            viewportRef={getExistedContactViewport}
            onScrollPositionChange={onScrollGetExistedContacts}>
            {chatState.contacts && chatState.contacts.map((contact, index) => (
              <Container
                className={`${styles.contact} ${contact.user.userId === chatState.currentBox?.user.userId ? styles.active : ""}`}
                key={index} py={10} px={15}
                onClick={() => onStartChatBox(contact.user)}>
                <Indicator dot inline size={16} offset={7} position="bottom-end" color={contact.user.isActive ? "green" : "red"} withBorder>
                  <Avatar
                    size={isMobile ? "md" : (isSmallTablet ? "lg" : "md")}
                    radius="xl"
                    src={getAvatarImageUrl(contact.user.userAvatar)}
                  />
                </Indicator>
                <Space w={10} style={{ display: isSmallTablet ? "none" : "block" }} />
                <Container style={{ flex: 1, display: isSmallTablet ? "none" : "block" }} p={0}>
                  <Text style={{ fontSize: "1.3rem" }} weight={500} color="#444">
                    {contact.user.userFullName}
                  </Text>
                  {contact.latestMessage.read || contact.user.userId !== contact.latestMessage.senderId
                    ? (
                      <Text
                        color="dimmed"
                        style={{ fontSize: "1.1rem" }}
                        lineClamp={1}>
                        {contact.user.userId !== contact.latestMessage.senderId ? "Bạn: " : contact.user.userFullName.split(" ")[0] + ": "}
                        {contact.latestMessage.messageContent}
                      </Text>
                    ) : (
                      <Indicator size={8} offset={-5} position="middle-end">
                        <Text
                          color="blue"
                          style={{ fontSize: "1.1rem" }}
                          lineClamp={1}
                          weight={600}>
                          {contact.user.userId !== contact.latestMessage.senderId ? "Bạn: " : contact.user.userFullName.split(" ")[0] + ": "}
                          {contact.latestMessage.messageContent}
                        </Text>
                      </Indicator>
                    )}
                </Container>
              </Container>
            ))}
            {isLoadingExistedContacts && (
              <Container style={{ display: "flex", justifyContent: "center" }} my={20} p={0}>
                <Loader variant='dots' />
              </Container>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

export default MessageScreen;
import { Title, Text, Divider, Container, Space, Modal, ScrollArea, Loader } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconMail } from "@tabler/icons";
import Head from "next/head";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNotification } from "../../../stores/Notification";
import Loading from "../../commons/Loading";
import Notification from "../../../models/notification.model";
import { useAuth } from "../../../stores/Auth";
import { toast } from "react-toastify";
import moment from "moment";
import { TimeZoneOffset } from "../../../helpers/constants";
import { useSocket } from "../../../stores/Socket";

const NotificationScreen = () => {
  const [notificationState, notificationAction] = useNotification();
  const [, socketAction] = useSocket();
  const [authState] = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingMoreNotification, setLoadingMoreNotification] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification>();
  const isMobile = useMediaQuery('(max-width: 480px)');
  const viewport = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;


  const openNotificationModal = useCallback((notification: Notification) => {
    setCurrentNotification(notification);
    setIsOpenModal(true);
    socketAction.emit("read_notification", {
      userId: authState.userId,
      id: notification.id,
      token: authState.token,
    })
  }, [authState.userId]);



  useEffect(() => {
    const getIntialNotification = async () => {
      try {
        const token = authState.token || '';
        await notificationAction.getNotification(token);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại");
      }
    }
    getIntialNotification();
    return () => {
      notificationAction.resetData();
      authState.token && notificationAction.getUnreadNotificationCount(authState.token);
    }
  }, []);



  const onScrollPositionChange = useCallback(async (positions: any) => {
    const verticalThreshold = 50;

    if (positions.y + viewport.current.clientHeight >= viewport.current.scrollHeight - verticalThreshold
      && !loadingMoreNotification
      && authState.token
      && notificationState.maxNotificationCount
      && notificationState.notifications.length < notificationState.maxNotificationCount) {
      try {
        setLoadingMoreNotification(true);
        await notificationAction.getNotification(authState.token);
        setLoadingMoreNotification(false);
      } catch (error) {
        console.log(error);
        setLoadingMoreNotification(false);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại");
      }
    }
  }, [
    viewport.current,
    authState.token,
    loadingMoreNotification,
    notificationState.maxNotificationCount,
    notificationState.notifications.length
  ])



  return (
    <>
      <Head>
        <title>Thông báo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal
        opened={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <Container>
          <Text color="#444" align="justify">
            {currentNotification?.content}
          </Text>
          <Space h={10} />
          <Text color="dimmed" style={{ fontSize: "1.2rem" }} align="right">
            {moment(currentNotification?.createdAt).utcOffset(TimeZoneOffset).format("HH:mm DD/MM/yyyy")}
          </Text>
        </Container>
      </Modal>


      <Container
        p={isMobile ? "xs" : "md"}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          flexGrow: 1,
          width: "100%",
          height: "calc(100vh - 9.1rem)",
        }}>
        <Title size="2.6rem" color="#444" transform="uppercase" align="center">
          Thông báo của tôi
        </Title>
        <Space h={20} />

        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}>
            <Loading />
            <Text style={{ fontSize: "1.2rem" }} color="dimmed">Đang tải...</Text>
          </div>
        )}

        {!loading && notificationState.notifications && notificationState.notifications.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}>
            <IconMail color="#CED4DA" size={100} />
            <Text style={{ fontSize: "1.6rem", color: "#CED4DA" }} weight={600}>
              Bạn hiện tại không có thông báo
            </Text>
          </div>
        )}

        {!loading && notificationState.notifications && notificationState.notifications.length > 0 &&
          (
            <ScrollArea
              style={{ flex: 1, width: "100%" }}
              type="never"
              viewportRef={viewport}
              onScrollPositionChange={onScrollPositionChange}>
              {notificationState.notifications.map((notification, index) => {
                if (notification.read) {
                  return (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <Container style={{ width: "100%" }} p={0}>
                          <Divider />
                        </Container>
                      )}
                      <Container
                        style={{ cursor: "pointer", width: "100%" }}
                        p={isMobile ? "xs" : "md"}
                        onClick={() => openNotificationModal(notification)}>
                        <Text color="#444" align="justify" lineClamp={3}>
                          {notification.content}
                        </Text>
                        <Space h={10} />
                        <Text color="dimmed" style={{ fontSize: "1.2rem" }} align="right">
                          {moment(notification.createdAt).utcOffset(TimeZoneOffset).format("HH:mm DD/MM/yyyy")}
                        </Text>
                      </Container>
                    </React.Fragment>
                  );
                } else {
                  return (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <Container style={{ width: "100%" }} p={0}>
                          <Divider />
                        </Container>
                      )}
                      <Container
                        p={isMobile ? "xs" : "md"}
                        onClick={() => openNotificationModal(notification)}
                        style={{ backgroundColor: "#DEE2E6", cursor: "pointer" }}>
                        <Text color="#444" align="justify" weight={700} lineClamp={3}>
                          {notification.content}
                        </Text>
                        <Space h={10} />
                        <Text color="dimmed" style={{ fontSize: "1.2rem" }} align="right">
                          {moment(notification.createdAt).utcOffset(TimeZoneOffset).format("HH:mm DD/MM/yyyy")}
                        </Text>
                      </Container>
                    </React.Fragment >
                  );
                }
              })}
              {loadingMoreNotification && (
                <Container style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }} px={10} py={20}>
                  <Loader variant='dots' />
                </Container>
              )}
            </ScrollArea>
          )}
      </Container>
    </>
  );
}

export default NotificationScreen;
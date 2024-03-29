import { Badge, Container, Divider, Grid, Loader, Modal, Space, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { StudySessionState, TimeZoneOffset, TutorConstants, Url } from "../../../../helpers/constants";
import { getStudySessionState } from "../../../../helpers/getStudySessionState";
import StudySession from "../../../../models/studySession.model";
import { useAuth } from "../../../../stores/Auth";
import { useSocket } from "../../../../stores/Socket";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";
import RequestOffSessionModal from "../Modal/requestOffSession.modal";


interface IProps {
  courseSlug?: string;
  branchId?: number;
}


const CourseSession = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const router = useRouter();
  const [authState] = useAuth();
  const [, socketAction] = useSocket();
  const [listStudySessions, setListStudySessions] = useState<StudySession[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeMoreLoading, setSeeMoreLoading] = useState(false);
  const [isOpenRequestOffModal, setIsOpenRequestOffModal] = useState(false);
  const [currentStudySession, setCurrentStudySession] = useState<StudySession>();
  const [isSendingRequest, setIsSendingRequest] = useState(false);


  const getStudySessions = useCallback(async (limit: number, skip: number) => {
    return await API.post(Url.tutors.getStudySessions, {
      token: authState.token,
      limit: limit,
      skip: skip,
      courseSlug: props.courseSlug
    });
  }, [authState.token, props.courseSlug]);




  const seeMoreStudySessions = useCallback(async () => {
    try {
      setSeeMoreLoading(true);
      const responses = await getStudySessions(TutorConstants.limitStudySession, listStudySessions.length);
      setTotal(responses.total);
      setListStudySessions(listStudySessions.concat(responses.studySessions));
      setSeeMoreLoading(false);
    } catch (error) {
      setSeeMoreLoading(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [TutorConstants.limitStudySession, listStudySessions]);


  const onSendOffSessionRequest = useCallback(async (data: any) => {
    try {
      setIsSendingRequest(true);
      const responses: any = await API.post(Url.tutors.requestOffStudySession, {
        token: authState.token,
        studySessionId: currentStudySession?.id,
        excuse: data.excuse,
      });
      if (responses == true)
        toast.success("Gửi yêu cầu thành công.")
      else toast.error("Gửi yêu cầu thất bại. Vui lòng thử lại.")
      setIsSendingRequest(false);
      setIsOpenRequestOffModal(false);
    } catch (error: any) {
      setIsSendingRequest(false);
      setIsOpenRequestOffModal(false);
      if (error.status < 500) {
        if (error.data.message && typeof error.data.message === "string")
          toast.error(error.data.message);
        else if (error.data.message && Array.isArray(error.data.message)) {
          const messages: any[] = Array.from(error.data.message);
          if (messages.length > 0 && typeof messages[0] === "string")
            toast.error(messages[0]);
          else if (messages.length > 0 && Array.isArray(messages))
            toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại");
          else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
        } else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
      } else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [authState.token, currentStudySession]);


  useEffect(() => {
    const didMountFunc = async () => {
      try {
        const responses = await getStudySessions(TutorConstants.limitStudySession, 0);
        setTotal(responses.total);
        setListStudySessions(responses.studySessions);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
      }
    }
    didMountFunc();
  }, []);


  return (
    <>
      <Text color="#444" transform="uppercase" align="center" weight={600} style={{ fontSize: "2.6rem" }}>
        Danh sách buổi học
      </Text>

      <Modal
        opened={isOpenRequestOffModal}
        onClose={() => setIsOpenRequestOffModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <RequestOffSessionModal
          onSendRequest={onSendOffSessionRequest}
          loading={isSendingRequest}
        />
      </Modal>

      {loading && (
        <Container style={{
          display: "flex",
          justifyContent: "center",
          alignItems: 'center',
          flexGrow: 1,
          height: "200px"
        }}>
          <Loading />
        </Container>
      )}

      {!loading && listStudySessions && listStudySessions.length === 0 && (
        <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <Text color="dimmed" align="center" weight={600} style={{ fontSize: "1.8rem" }}>
            Chưa có buổi học
          </Text>
        </Container>
      )}

      {!loading && listStudySessions && listStudySessions.length > 0 && (
        listStudySessions.map((item, index) => (
          <React.Fragment key={index}>
            <Container size="xl" p={isMobile ? "xs" : "md"}>
              <Text weight={600} color="#444">{item.name}</Text>
              <Space h={8} />
              <Grid>
                <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 5}>
                  <Text color="#444">Ngày diễn ra: {moment(item.date).utcOffset(TimeZoneOffset).format("DD/MM/YYYY")}</Text>
                  <Text color="dimmed" style={{ fontSize: "1rem" }}>
                    Ca học: {
                      moment(item.shifts[0].startTime).utcOffset(TimeZoneOffset).format("HH:mm")
                      + "-" + moment(item.shifts[item.shifts.length - 1].endTime).utcOffset(TimeZoneOffset).format("HH:mm")
                    }
                  </Text>

                  <Space h={8} />
                  <Text color="#444">Phòng học: {item.classroom?.name || "-"}</Text>
                  {item.classroom && (
                    <Text color="dimmed" style={{ fontSize: "1rem" }}>
                      {item.classroom.branch.name}
                    </Text>
                  )}
                </Grid.Col>
                <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 5}>
                  <Text color="#444">Giáo viên: {item.teacher.worker.user.fullName}</Text>
                  <Text color="dimmed" style={{ fontSize: "1rem" }}>
                    MSGV: {item.teacher.worker.user.id}
                  </Text>
                  <Space h={8} />
                  <Text color="#444">Tình trạng:
                    {getStudySessionState(item) === StudySessionState.Finish && (
                      <Text weight={600} component="span" color="pink"> Đã kết thúc</Text>
                    )}
                    {getStudySessionState(item) === StudySessionState.Ready && (
                      <Text weight={600} component="span" color="gray"> Chưa diễn ra</Text>
                    )}
                    {getStudySessionState(item) === StudySessionState.Start && (
                      <Text weight={600} component="span" color="green"> Đang diễn ra</Text>
                    )}
                  </Text>
                </Grid.Col>
                <Grid.Col span={isLargeTablet ? 12 : 2}>
                  {(getStudySessionState(item) === StudySessionState.Finish ||
                    getStudySessionState(item) === StudySessionState.Start) && (
                      <>
                        <Button compact={isLargeTablet ? false : true} fullWidth
                          onClick={() => router.push(router.asPath + "/study-session/" + item.id)}>
                          Xem chi tiết
                        </Button>
                      </>
                    )}
                  {getStudySessionState(item) === StudySessionState.Ready && (
                    <Button
                      color="pink"
                      compact={isLargeTablet ? false : true}
                      fullWidth
                      onClick={() => {
                        setCurrentStudySession(item);
                        setIsOpenRequestOffModal(true);
                      }}>Xin nghỉ</Button>
                  )}
                </Grid.Col>
              </Grid>
            </Container>
            {index !== listStudySessions.length - 1 && (
              <Divider />
            )}
          </React.Fragment>
        )))}

      <Space h={20} />
      <Container style={{
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        flexGrow: 1,
      }}>
        {seeMoreLoading && <Loader variant="dots" />}
        {!seeMoreLoading && listStudySessions.length < total && <Button
          onClick={() => seeMoreStudySessions()}
        >Xem thêm</Button>}
      </Container>
      <Space h={20} />
    </>
  );
}

export default CourseSession;
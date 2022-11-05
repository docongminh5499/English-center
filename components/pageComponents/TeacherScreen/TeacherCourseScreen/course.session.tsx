import { Badge, Container, Divider, Grid, Loader, Modal, Space, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { StudySessionState, TeacherConstants, TimeZoneOffset, Url } from "../../../../helpers/constants";
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
    return await API.post(Url.teachers.getStudySessions, {
      token: authState.token,
      limit: limit,
      skip: skip,
      courseSlug: props.courseSlug
    });
  }, [authState.token, props.courseSlug]);




  const seeMoreStudySessions = useCallback(async () => {
    try {
      setSeeMoreLoading(true);
      const responses = await getStudySessions(TeacherConstants.limitStudySession, listStudySessions.length);
      setTotal(responses.total);
      setListStudySessions(listStudySessions.concat(responses.studySessions));
      setSeeMoreLoading(false);
    } catch (error) {
      setSeeMoreLoading(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [TeacherConstants.limitStudySession, listStudySessions]);


  const onSendOffSessionRequest = useCallback(async (data: any) => {
    setIsSendingRequest(true);
    const message = `Giáo viên: ${currentStudySession?.teacher.worker.user.fullName}, MSGV: ${currentStudySession?.teacher.worker.user.id}.
    Yêu cầu nghỉ buổi học: ${currentStudySession?.name}, thuộc khóa học: ${currentStudySession?.course.name}.
    Lý do: ${data.excuse}.`;
    socketAction.emit('notification', { token: authState.token, userId: data.employeeId, content: message });
    setIsSendingRequest(false);
    setIsOpenRequestOffModal(false);
  }, [socketAction, authState.token, currentStudySession]);


  useEffect(() => {
    const didMountFunc = async () => {
      try {
        const responses = await getStudySessions(TeacherConstants.limitStudySession, 0);
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
          branchId={props.branchId}
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
                  <Text color="#444">Phòng học: {item.classroom.name}</Text>
                  <Text color="dimmed" style={{ fontSize: "1rem" }}>
                    {item.classroom.branch.name}
                  </Text>
                </Grid.Col>
                <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 5}>
                  <Text color="#444">Trợ giảng: {item.tutor.worker.user.fullName}</Text>
                  <Text color="dimmed" style={{ fontSize: "1rem" }}>
                    MSTG: {item.tutor.worker.user.id}
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
                        {authState.userId != item.teacher.worker.user.id.toString() && (
                          <Container p={0} mt={5} style={{ background: "#FFE3E3", borderRadius: 5 }}>
                            <Text color="pink" weight={600} align="center" style={{ fontSize: "1.1rem" }}>
                              Vắng
                            </Text>
                            <Text weight={600} align="center" style={{ fontSize: "1.1rem" }}>
                              Người dạy thay
                            </Text>
                            <Text align="center" style={{ fontSize: "1.1rem" }}>
                              {item.teacher.worker.user.fullName} - MSGV: {item.teacher.worker.user.id}
                            </Text>
                          </Container>
                        )}
                      </>
                    )}
                  {getStudySessionState(item) === StudySessionState.Ready && (
                    <>
                      {authState.userId != item.teacher.worker.user.id.toString() && (
                        <Container p={0} mt={5}>
                          <Text weight={600} align="center" style={{ fontSize: "1.4rem" }} color="pink">
                            Người dạy thay
                          </Text>
                          <Text color="#444" align="center" style={{ fontSize: "1.4rem" }}>
                            {item.teacher.worker.user.fullName}
                          </Text>
                          <Text color="dimmed" align="center" style={{ fontSize: "1.2rem" }}>
                            MSGV: {item.teacher.worker.user.id}
                          </Text>
                        </Container>
                      )}
                      {authState.userId == item.teacher.worker.user.id.toString() && (
                        <Button
                          color="pink"
                          compact={isLargeTablet ? false : true}
                          fullWidth
                          onClick={() => {
                            setCurrentStudySession(item);
                            setIsOpenRequestOffModal(true);
                          }}>
                          Xin nghỉ</Button>
                      )}
                    </>
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
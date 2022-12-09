import { Badge, Button, Container, Loader, ScrollArea, Space, Table, Text, Title } from "@mantine/core";
import { RangeCalendar } from "@mantine/dates";
import 'dayjs/locale/vi';
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { StudySessionState, TeacherConstants, Url } from "../../../../helpers/constants";
import { getStudySessionState } from "../../../../helpers/getStudySessionState";
import StudySession from "../../../../models/studySession.model";
import { useAuth } from "../../../../stores/Auth";


const TeacherScheduleScreen = () => {
  const [authState] = useAuth();
  const [value, setValue] = useState<[Date | null, Date | null]>([new Date(), new Date()]);
  const [listSchedules, setListSchedules] = useState<StudySession[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeMoreLoading, setSeeMoreLoading] = useState(false);
  const router = useRouter();


  const getSchedules = useCallback(
    async (limit: number, skip: number, startDate: Date | null, endDate: Date | null) => {
      return await API.post(Url.teachers.getSchedules, {
        token: authState.token,
        limit: limit,
        skip: skip,
        startDate: startDate,
        endDate: endDate,
      });
    }, [authState.token]);



  const seeMoreSchedules = useCallback(async (startDate: Date | null, endDate: Date | null) => {
    try {
      setSeeMoreLoading(true);
      const responses = await getSchedules(
        TeacherConstants.limitSchedule, listSchedules.length, startDate, endDate);
      setTotal(responses.total);
      setListSchedules(listSchedules.concat(responses.studySessions));
      setSeeMoreLoading(false);
    } catch (error) {
      setSeeMoreLoading(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [TeacherConstants.limitSchedule, listSchedules]);



  const onCompleteChangeDateCallback = useCallback(async (startDate: Date | null, endDate: Date | null) => {
    try {
      setLoading(true);
      const responses = await getSchedules(TeacherConstants.limitSchedule, 0, startDate, endDate);
      setTotal(responses.total);
      setListSchedules(responses.studySessions);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [TeacherConstants.limitSchedule])


  useEffect(() => {
    if (value[1] !== null) onCompleteChangeDateCallback(value[0], value[1]);
  }, [value[1]])


  return (
    <>
      <Head>
        <title>Nhật ký giảng dạy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container style={{ width: "100%", minWidth: 0 }} size="xl" mb={20}>
        <Title size="2.6rem" transform="uppercase" align="center" my={20} color="#444">
          Nhật ký giảng dạy
        </Title>
        <RangeCalendar
          value={value}
          onChange={setValue}
          allowSingleDateInRange
          mx="auto"
          locale="vi"
          fullWidth
        />
        {loading && (
          <Container style={{
            display: "flex",
            justifyContent: "center",
            alignItems: 'center',
            height: "200px",
          }}>
            <Loader variant="dots" />
          </Container>
        )}
        {!loading && (
          <ScrollArea style={{ width: "100%" }}>
            <Table verticalSpacing="xs" highlightOnHover={listSchedules.length > 0} style={{ width: "100%", minWidth: "1000px" }} mt={20}>
              <thead>
                <tr>
                  <th>Mã khóa học</th>
                  <th>Khóa học</th>
                  <th>Ngày diễn ra</th>
                  <th>Giờ học</th>
                  <th>Phòng học</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listSchedules.length == 0 && (
                  <tr>
                    <td align="center" colSpan={5}>
                      <Text color="#CED4DA" my={30} style={{ fontSize: "1.6rem" }} weight={600}>
                        Không có lịch dạy
                      </Text>
                    </td>
                  </tr>
                )}

                {listSchedules.length > 0 &&
                  listSchedules.map((studySession: StudySession, index: number) => (
                    <tr key={index}>
                      <td style={{ textAlign: "center" }}>{studySession.course.id}</td>
                      <td style={{ width: "40%" }}>{studySession.course.name}</td>
                      <td>{moment(studySession.date).format("DD/MM/YYYY")}</td>
                      <td>{moment(studySession.shifts[0].startTime).format("HH:mm")
                        + "-" + moment(studySession.shifts[studySession.shifts.length - 1].endTime).format("HH:mm")
                      }</td>
                      <td>
                        <Text>{studySession.classroom?.name || "-"}</Text>
                        {studySession.classroom && (
                          <Text color="dimmed" style={{ fontSize: "1rem" }}>{studySession.classroom.branch.name}</Text>
                        )}
                      </td>
                      <td>
                        {authState.userId != studySession.course.teacher.worker.user.id.toString() && (
                          <Badge>
                            <Text style={{ fontSize: "1.1rem" }}>Dạy thay</Text>
                          </Badge>
                        )}
                        {authState.userId != studySession.teacher.worker.user.id.toString() && (
                          <Container p={0} style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: 'center',
                          }}>
                            <Badge color="pink" mx="auto">
                              <Text style={{ fontSize: "1.1rem" }}>{getStudySessionState(studySession) == StudySessionState.Ready ? "Đăng ký nghỉ" : "Vắng"}</Text>
                            </Badge>
                            <Text color="dimmed" style={{ fontSize: "1.1rem" }} align="center" mt={8}>
                              Người dạy thay
                            </Text>
                            <Text color="dimmed" style={{ fontSize: "1.1rem" }} align="center">
                              {studySession.teacher.worker.user.fullName} - MSGV: {studySession.teacher.worker.user.id}
                            </Text>
                          </Container>
                        )}
                      </td>
                      <td>
                        {getStudySessionState(studySession) !== StudySessionState.Ready && (
                          <Button component="a" target="_blank" compact
                            href={`/teacher/course/${studySession.course.slug}/study-session/${studySession.id}`}>
                            Xem chi tiết
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            <Space h={5} />
            <Container style={{
              display: "flex",
              justifyContent: "center",
              alignItems: 'center',
              flexGrow: 1,
            }}>
              {seeMoreLoading && <Loader variant="dots" />}
              {!seeMoreLoading && listSchedules.length < total && <Button
                onClick={() => seeMoreSchedules(value[0], value[1])}
              >Xem thêm</Button>}
            </Container>
            <Space h={5} />
          </ScrollArea>
        )}
      </Container>
    </>
  );
}

export default TeacherScheduleScreen;
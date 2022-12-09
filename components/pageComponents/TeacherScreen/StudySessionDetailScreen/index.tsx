import { Checkbox, Container, Divider, Grid, Group, Space, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CourseStatus, StudySessionState, TimeZoneOffset, UserRole } from "../../../../helpers/constants";
import { getCourseStatus } from "../../../../helpers/getCourseStatus";
import { getStudySessionState } from "../../../../helpers/getStudySessionState";
import MakeUpLession from "../../../../models/makeUpLesson.model";
import StudySession from "../../../../models/studySession.model";
import UserAttendStudySession from "../../../../models/userAttendStudySession.model";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";
import Table from "../../../commons/Table";

const COLUMN_ATTENDANCE = {
  HO_TEN: 'col_1',
  MSHV: 'col_2',
  HOC_BU: 'col_3',
  VANG: 'col_4',
  GHI_CHU: 'col_5',
}
const columnTable = [
  { _idColumn: COLUMN_ATTENDANCE.HO_TEN, titleColumn: 'Họ và tên', widthColumn: '20%' },
  { _idColumn: COLUMN_ATTENDANCE.MSHV, titleColumn: 'MSHV', widthColumn: '10%' },
  { _idColumn: COLUMN_ATTENDANCE.HOC_BU, titleColumn: 'Học bù', widthColumn: '10%' },
  { _idColumn: COLUMN_ATTENDANCE.VANG, titleColumn: 'Vắng', widthColumn: '10%' },
  { _idColumn: COLUMN_ATTENDANCE.GHI_CHU, titleColumn: 'Ghi chú', widthColumn: '50%' },
]

interface IProps {
  userRole: UserRole | null,
  studySession: StudySession | null,
  attendences: UserAttendStudySession[],
  makeups: MakeUpLession[],
  ownMakeups: MakeUpLession[],
}

const StudySessionDetailScreen = (props: IProps) => {
  const [authState] = useAuth();
  const [didMount, setDidMount] = useState(false);
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isSmallTablet = useMediaQuery('(max-width: 768px)');
  const isLargetTablet = useMediaQuery('(max-width: 1024px)');

  const router = useRouter();
  const [infoStudySession, setInfoStudySession] = useState(props.studySession);
  const [dataTable, setDataTable] = useState<Array<any>>([]);

  useEffect(() => {
    let dataTableTemp: any[] = [];
    // Attendance data
    if (props.attendences && props.attendences.length > 0) {
      const dataAttendance = props.attendences.map(e => {
        if (!columnTable || columnTable.length == 0) return [];

        const foundOwnMakeUps = props.ownMakeups.find(makeup => makeup.student.user.id === e.student.user.id);
        return columnTable.map(_e => {
          if (_e._idColumn === COLUMN_ATTENDANCE.HO_TEN) return { _idColumn: COLUMN_ATTENDANCE.HO_TEN, valueRow: e.student.user.fullName }
          if (_e._idColumn === COLUMN_ATTENDANCE.MSHV) return { _idColumn: COLUMN_ATTENDANCE.MSHV, valueRow: e.student.user.id }
          if (_e._idColumn === COLUMN_ATTENDANCE.HOC_BU) return { _idColumn: COLUMN_ATTENDANCE.HOC_BU, templateRow: <TemplateCheckBoxStudy status={false} /> }
          if (_e._idColumn === COLUMN_ATTENDANCE.VANG) return { _idColumn: COLUMN_ATTENDANCE.VANG, templateRow: foundOwnMakeUps ? <TemplateCheckBoxAbsent status={!foundOwnMakeUps.isAttend} /> : <TemplateCheckBoxAbsent status={!e.isAttend} /> }
          if (_e._idColumn === COLUMN_ATTENDANCE.GHI_CHU) return { _idColumn: COLUMN_ATTENDANCE.GHI_CHU, valueRow: <TemplateComment makeupLesson={foundOwnMakeUps} comment={e.commentOfTeacher} /> }
          return {}
        })
      });
      dataTableTemp = dataTableTemp.concat(dataAttendance);
    }
    // Make up data
    if (props.makeups && props.makeups.length > 0) {
      const dataMakeUpLessons = props.makeups.map(e => {
        if (!columnTable || columnTable.length == 0) return []
        return columnTable.map(_e => {
          if (_e._idColumn === COLUMN_ATTENDANCE.HO_TEN) return { _idColumn: COLUMN_ATTENDANCE.HO_TEN, valueRow: e.student.user.fullName }
          if (_e._idColumn === COLUMN_ATTENDANCE.MSHV) return { _idColumn: COLUMN_ATTENDANCE.MSHV, valueRow: e.student.user.id }
          if (_e._idColumn === COLUMN_ATTENDANCE.HOC_BU) return { _idColumn: COLUMN_ATTENDANCE.HOC_BU, templateRow: <TemplateCheckBoxStudy status={true} /> }
          if (_e._idColumn === COLUMN_ATTENDANCE.VANG) return { _idColumn: COLUMN_ATTENDANCE.VANG, templateRow: <TemplateCheckBoxAbsent status={!e.isAttend} /> }
          if (_e._idColumn === COLUMN_ATTENDANCE.GHI_CHU) return { _idColumn: COLUMN_ATTENDANCE.GHI_CHU, valueRow: <TemplateComment makeupLesson={undefined} comment={e.commentOfTeacher} /> }
          return {}
        })
      });
      dataTableTemp = dataTableTemp.concat(dataMakeUpLessons);
    }
    setDataTable(dataTableTemp)
  }, [])


  useEffect(() => {
    if (props.studySession === null)
      router.replace("/not-found");
    else setDidMount(true);
  }, []);


  const TemplateComment = ({ makeupLesson, comment }: { makeupLesson: MakeUpLession | undefined, comment: string }) => {
    if (makeupLesson === undefined)
      return <Text>{comment}</Text>
    return <Container p={0}>
      <Text style={{ fontSize: "1.1rem" }} weight={600} color="dimmed">Học bù buổi khác
        <Text style={{ fontSize: "1.1rem" }} component="span" ml={8}>{moment(makeupLesson.targetStudySession.shifts[0].startTime).utcOffset(TimeZoneOffset).format("HH:mm") +
          "-" + moment(makeupLesson.targetStudySession.shifts[makeupLesson.targetStudySession.shifts.length - 1].endTime).utcOffset(TimeZoneOffset).format("HH:mm")}
        </Text>
        <Text style={{ fontSize: "1.1rem" }} component="span" ml={8}>{moment(makeupLesson.targetStudySession.date).utcOffset(TimeZoneOffset).format("DD/MM/YYYY")}</Text>
      </Text>
      <Text style={{ fontSize: "1.1rem" }} lineClamp={1} weight={600} color="dimmed">Khóa học:
        <Text weight={400} component="span" ml={8}>
          {makeupLesson.targetStudySession.course.name}
        </Text>
      </Text>
      {makeupLesson.commentOfTeacher && makeupLesson.commentOfTeacher.trim().length > 0 && (
        <Divider />
      )}
      {makeupLesson.commentOfTeacher && makeupLesson.commentOfTeacher.trim().length > 0 && (
        <Text>{makeupLesson.commentOfTeacher}</Text>
      )}
      {makeupLesson.commentOfTeacher && makeupLesson.commentOfTeacher.trim().length > 0 && (
        <Text style={{ fontSize: "1.1rem" }} align="right" color="dimmed" mr={8}> -- GV: {makeupLesson.targetStudySession.teacher.worker.user.fullName}</Text>
      )}
    </Container>
  }


  const TemplateCheckBoxStudy = ({ status }: { status: boolean }) => {
    return <Checkbox
      readOnly
      checked={status}
      transitionDuration={0}
    />
  }


  const TemplateCheckBoxAbsent = ({ status }: { status: boolean }) => {
    return <Checkbox
      readOnly
      checked={status}
      transitionDuration={0}
    />
  }


  return (
    <>
      <Head>
        <title>Chi tiết buổi học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!didMount && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Loading />
        </Container>
      )}

      {didMount && (
        <Container size="xl" style={{ width: "100%" }}>
          <Title transform="uppercase" color="#444444" size="2.6rem" mt={20} align="left">
            {infoStudySession?.name || ""}
          </Title>
          <Text
            transform="uppercase"
            weight={600}
            color="#666666"
            style={{ fontSize: '1.6rem', cursor: "pointer" }}
            align="justify"
            onClick={() => router.push("/teacher/course/" + infoStudySession?.course.slug)}
          >
            Khóa học: {infoStudySession?.course.name || ""}
          </Text>
          <Space h={30} />
          <Grid>
            <Grid.Col span={isLargetTablet ? (isSmallTablet ? 12 : 6) : 3}>
              <Group position={isSmallTablet ? "apart" : "left"} align="flex-start">
                <Text color="#444444" mr={5}>Trợ giảng:</Text>
                <div style={{ display: "flex", flexDirection: "column", alignItems: isSmallTablet ? "flex-end" : "flex-start" }}>
                  <Text color="#444444">{infoStudySession?.tutor.worker.user.fullName || "-"}</Text>
                  <Text color="dimmed" style={{ fontSize: "1rem" }}>MSTG: {infoStudySession?.tutor.worker.user.id}</Text>
                </div>
              </Group>
            </Grid.Col>
            <Grid.Col span={isLargetTablet ? (isSmallTablet ? 12 : 6) : 3}>
              <Group position={isSmallTablet ? 'apart' : 'left'} align="flex-start">
                <Text color="#444444" mr={5}>Ngày: </Text>
                <div style={{ display: "flex", flexDirection: "column", alignItems: isSmallTablet ? "flex-end" : "flex-start" }}>
                  <Text color="#444444">{moment(infoStudySession?.date).utcOffset(TimeZoneOffset).format("DD/MM/YYYY") || '--/--/----'}</Text>
                  {
                    infoStudySession && infoStudySession.shifts && infoStudySession.shifts.length > 0 ?
                      <div>
                        <Text color="dimmed" style={{ fontSize: "1rem" }}>{
                          moment(infoStudySession.shifts[0].startTime).utcOffset(TimeZoneOffset).format("HH:mm")
                          + "-" + moment(infoStudySession.shifts[infoStudySession.shifts.length - 1].endTime).utcOffset(TimeZoneOffset).format("HH:mm")
                        }</Text>
                      </div> :
                      <Text color="dimmed" style={{ fontSize: "1rem" }}>--:--</Text>
                  }
                </div>
              </Group>
            </Grid.Col>
            <Grid.Col span={isLargetTablet ? (isSmallTablet ? 12 : 6) : 3}>
              <Group position={isSmallTablet ? 'apart' : 'left'} align="flex-start" >
                <Text color="#444444" mr={5}>Tình trạng: </Text>
                {!infoStudySession && (
                  <Text color="#444444">-</Text>
                )}
                {infoStudySession &&
                  getStudySessionState(infoStudySession) === StudySessionState.Finish && (
                    <Text weight={600} component="span" color="pink"> Đã kết thúc</Text>
                  )}
                {infoStudySession &&
                  getStudySessionState(infoStudySession) === StudySessionState.Ready && (
                    <Text weight={600} component="span" color="gray"> Chưa diễn ra</Text>
                  )}
                {infoStudySession &&
                  getStudySessionState(infoStudySession) === StudySessionState.Start && (
                    <Text weight={600} component="span" color="green"> Đang diễn ra</Text>
                  )}
              </Group>
            </Grid.Col>
            <Grid.Col span={isLargetTablet ? (isSmallTablet ? 12 : 6) : 3}>
              <Group position={isSmallTablet ? 'apart' : 'left'} align="flex-start">
                <Text color="#444">Phòng học:</Text>
                <div style={{ display: "flex", flexDirection: "column", alignItems: isSmallTablet ? "flex-end" : "flex-start" }}>
                  <Text color="#444">{infoStudySession?.classroom?.name || "-"}</Text>
                  {infoStudySession?.classroom && (
                    <Text color="dimmed" style={{ fontSize: "1rem" }}>{infoStudySession?.classroom.branch.name}</Text>
                  )}
                </div>
              </Group>
            </Grid.Col>
          </Grid>
          <Space h={15} />
          <Text color="#444444" weight={700} style={{ fontSize: "1.8rem" }}>Ghi chú</Text>
          <Container
            p={0}
            pt={10}
            size="xl"
            style={{ color: "#444444", textAlign: "justify" }}
            dangerouslySetInnerHTML={{ __html: infoStudySession?.notes || '-' }} />
          <Space h={20} />
          <Text color="#444444" weight={700} style={{ fontSize: "1.8rem" }}>Điểm danh</Text>
          <Space h={20} />
          {
            !dataTable || dataTable.length == 0 ?
              <Text color="#444444">Không có thông tin</Text> :
              <Table
                columnTable={columnTable}
                rowTable={dataTable}
                heightTable={isMobile ? 500 : 300}
              />
          }

          <Space h={20} />

          {props.studySession && getCourseStatus(props.studySession.course) !== CourseStatus.Closed &&
            props.studySession.teacher.worker.user.id.toString() == authState.userId && (
              <Container my={20} style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={() => router.push(router.asPath + "/modify")}
                >Chỉnh sửa</Button>
              </Container>
            )}
        </Container>
      )}
    </>
  );
};

export default StudySessionDetailScreen;

import Head from "next/head";
import { Container, Title, Text, Space, Grid } from "@mantine/core";
import { UserRole } from "../../../../helpers/constants";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import InfoUser from './components/InfoUser'
import Attendance from './components/Attendance'
import Exercise from './components/Exercise'
import UserStudent from "../../../../models/userStudent.model";
import StudentDoExercise from "../../../../models/studentDoExercise.model";
import UserAttendStudySession from "../../../../models/userAttendStudySession.model";
import { useRouter } from "next/router";
import Loading from "../../../commons/Loading";
import MakeUpLession from "../../../../models/makeUpLesson.model";

interface IProps {
  userRole?: UserRole | null;
  student: UserStudent | null;
  doExercises: StudentDoExercise[];
  attendences: UserAttendStudySession[];
  makeUpLessons: MakeUpLession[];
}

const TempleteScreen = (props: IProps) => {
  const [didMount, setDidMount] = useState(false);
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const router = useRouter();

  useEffect(() => {
    if (props.student === null)
      router.replace('/not-found');
    else setDidMount(true);
  }, []);

  return (
    <>
      <Head>
        <title>Chi tiết học viên</title>
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
        <Container size="xl" style={{ width: "100%" }} pb={'5rem'} >
          <InfoUser
            title={'Thông tin học sinh'}
            data={props.student?.user}
          />
          <Space h={50} />
          <InfoUser
            title={'Thông tin phụ huynh'}
            data={props.student?.userParent?.user}
          />
          <Space h={50} />
          <Title transform="uppercase" color="#444444" size="2.6rem" mt={20} align="left">
            Điểm danh
          </Title>
          <Space h={30} />
          {
            !props.attendences || props.attendences.length === 0 ?
              <Container style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "150px"
              }}>
                <Text style={{ fontSize: "2.4rem", color: "#CED4DA" }} weight={600}>
                  Không có dữ liệu
                </Text>
              </Container> :
              <Grid gutter={40} style={{ overflowX: "hidden", maxWidth: "100%" }}>
                {
                  props.attendences.map((e, i) => {
                    const makeUpLesson = props.makeUpLessons.find(makeup => makeup.studySession.id === e.studySession.id)
                    return (
                      <Grid.Col key={i} span={isLargeTablet ? 12 : 6}>
                        <Attendance data={e} makeUpLesson={makeUpLesson} />
                      </Grid.Col>
                    )
                  })
                }
              </Grid>
          }
          <Space h={50} />
          <Title transform="uppercase" color="#444444" size="2.6rem" mt={20} align="left">
            Bài tập
          </Title>
          <Space h={30} />
          {
            !props.doExercises || props.doExercises.length === 0 ?
              <Container style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "150px"
              }}>
                <Text style={{ fontSize: "2.4rem", color: "#CED4DA" }} weight={600}>
                  Không có dữ liệu
                </Text>
              </Container> :
              <Grid gutter={40} style={{ overflowX: "hidden", maxWidth: "100%" }}>
                {
                  props.doExercises.map((e, i) => (
                    <Grid.Col key={i} span={isLargeTablet ? 12 : 6}>
                      <Exercise data={e} />
                    </Grid.Col>
                  ))
                }
              </Grid>
          }
        </Container>
      )}
    </>
  );
};

export default TempleteScreen;

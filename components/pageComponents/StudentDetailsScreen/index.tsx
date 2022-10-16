import Head from "next/head";
import { Container, Title, Text, Image, Loader, Space, Grid, NavLink, Divider, Group, Textarea, ScrollArea, Checkbox } from "@mantine/core";
import { UserRole } from "../../../helpers/constants";
import styles from "./studentDetailsScreen.module.module.css";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import InfoUser from './components/InfoUser'
import Attendance from './components/Attendance'
import Exercise from './components/Exercise'

import {
  infoStudent_mock,
  infoParents_mock,
  dataAttendance_mock,
  dataExercise_mock
} from './_mock_'

interface IProps {
  userRole?: UserRole | null;
}

const TempleteScreen = (props: IProps) => {

  const [didMount, setDidMount] = useState(false);
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const [infoStudent, setInfoStudent] = useState(infoStudent_mock);
  const [infoParents, setInfoParents] = useState(infoParents_mock);
  const [dataAttendance, setDataAttendance] = useState(dataAttendance_mock);
  const [dataExercise, setDataExercise] = useState(dataExercise_mock);

  useEffect(() => {
    setDidMount(true);
  }, []);

  return (
    <>
      <Head>
        <title>Chi tiết lịch sử buổi học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {didMount && (
          <Container size="xl" style={{ width: "100%" }} pb={'5rem'} >
          <InfoUser
            title={'Thông tin học sinh'}
            data={infoStudent}
          />
          <Space h={50} />
          <InfoUser
            title={'Thông tin phụ huynh'}
            data={infoParents}
          />
          <Space h={50} />
          <Title transform="uppercase" color="#222222" size="2.6rem" mt={20} align="left">
              Điểm danh
          </Title>
          <Space h={30} />
          {
            !dataAttendance || dataAttendance.length === 0 ?
            <Text color="#222222">Không có thông tin</Text> :
            <Grid gutter={40}>
              { 
                dataAttendance.map((e, i)=> (
                  <Grid.Col  key={i} span={isLargeTablet ? 12 : 6}>
                      <Attendance data={e} />
                  </Grid.Col>
                )) 
              }
            </Grid>
          }
          <Space h={50} />
          <Title transform="uppercase" color="#222222" size="2.6rem" mt={20} align="left">
              Bài tập
          </Title>
          <Space h={30} />
          {
            !dataExercise || dataExercise.length === 0 ?
            <Text color="#222222">Không có thông tin</Text> :
            <Grid gutter={40}>
              { 
                dataExercise.map((e, i)=> (
                  <Grid.Col  key={i} span={isLargeTablet ? 12 : 6}>
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

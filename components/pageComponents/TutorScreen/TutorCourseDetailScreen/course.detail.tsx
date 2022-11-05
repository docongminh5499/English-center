import { Container, Title, Text, Space, Grid, Tabs } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconMicroscope, IconSchool, IconUsers } from "@tabler/icons";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CourseStatus, TimeZoneOffset, Url, UserRole } from "../../../../helpers/constants";
import { getCourseStatus } from "../../../../helpers/getCourseStatus";
import { Course } from "../../../../models/course.model";
import Loading from "../../../commons/Loading";
import CourseCurriculum from "./course.curriculum";
import CourseSession from "./course.session";
import CourseStudent from "./course.student";

interface IProps {
  userRole?: UserRole | null;
  course: Course | null;
}

const TutorCourseDetailScreen = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const [didMount, setDidMount] = useState(false);
  const [course, setCourse] = useState(props.course);
  const router = useRouter();


  useEffect(() => {
    if (props.course === null)
      router.replace('/not-found');
    else setDidMount(true);
  }, []);


  return (
    <>
      <Head>
        <title>Chi tiết khóa học</title>
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
        <Container p={isMobile ? "xs" : "md"} size="xl" style={{ width: "100%" }}>
          <Title size="2.6rem" color="#444">{course?.name}</Title>
          <Space h={14} />
          <Text align="justify" color="#444">
            {course?.curriculum.desc}
          </Text>
          <Space h={14} />
          <Grid>
            <Grid.Col span={isLargeTablet ? (isTablet ? 12 : 6) : 4} pb={!isTablet ? 8 : 0}>
              <Text color="#444">
                <Text weight={600} component="span">Giáo viên: </Text>
                {course?.teacher.worker.user.fullName}
              </Text>
            </Grid.Col>
            <Grid.Col span={isLargeTablet ? (isTablet ? 12 : 6) : 4} pt={!isTablet ? 8 : 4}>
              <Text color="#444">
                <Text weight={600} component="span">MSGV: </Text>
                {course?.teacher.worker.user.id}
              </Text>
            </Grid.Col>
          </Grid>
          <Space h={4} />
          <Grid>
            <Grid.Col span={isLargeTablet ? (isTablet ? 12 : 6) : 4} pb={!isTablet ? 8 : 0} pt={!isTablet ? 8 : 4}>
              <Text color="#444">
                <Text weight={600} component="span">Ngày khai giảng: </Text>
                {moment(course?.openingDate).utcOffset(TimeZoneOffset).format("DD/MM/YYYY")}
              </Text>
              <Space h={5} />
              <Text color="#444">
                <Text weight={600} component="span">Ngày dự kiến kết thúc: </Text>
                {moment(course?.expectedClosingDate).utcOffset(TimeZoneOffset).format("DD/MM/YYYY")}
              </Text>
            </Grid.Col>
            <Grid.Col span={isLargeTablet ? (isTablet ? 12 : 6) : 4} pt={!isTablet ? 8 : 4}>
              <Text color="#444">
                <Text weight={600} component="span">Trạng thái: </Text>

                {getCourseStatus(course) === CourseStatus.NotOpen && (
                  <Text component="span" weight={600} color="grape">
                    Sắp diễn ra
                  </Text>
                )}

                {getCourseStatus(course) === CourseStatus.Opened && (
                  <Text component="span" color="green" weight={600}>
                    Đang diễn ra
                  </Text>
                )}

                {getCourseStatus(course) === CourseStatus.Closed && (
                  <Text component="span" color="pink" weight={600}>
                    Đã kết thúc
                  </Text>
                )}
              </Text>
              <Space h={5} />
              <Text color="#444">
                <Text weight={600} component="span">Ngày kết thúc: </Text>
                {course?.closingDate ?
                  moment(course?.closingDate).utcOffset(TimeZoneOffset).format("DD/MM/YYYY")
                  : "--/--/----"}
              </Text>
            </Grid.Col>
          </Grid>
          <Space h={14} />
          <Tabs defaultValue="curriculum" styles={{ tabLabel: { color: "#444" } }} keepMounted={false}>
            <Tabs.List grow>
              <Tabs.Tab
                value="curriculum"
                icon={<IconSchool size={14} />}>
                Chương trình học
              </Tabs.Tab>
              <Tabs.Tab
                value="session"
                icon={<IconMicroscope size={14} />}>
                Buổi học
              </Tabs.Tab>
              <Tabs.Tab value="student"
                icon={<IconUsers size={14} />}>
                Học viên
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="curriculum" pt="xs">
              <CourseCurriculum curriculum={course?.curriculum} />
            </Tabs.Panel>

            <Tabs.Panel value="session" pt="xs">
              <CourseSession courseSlug={course?.slug} branchId={course?.branch.id} />
            </Tabs.Panel>

            <Tabs.Panel value="student" pt="xs">
              <CourseStudent
                courseId={course?.id}
                courseSlug={course?.slug}
              />
            </Tabs.Panel>
          </Tabs>
        </Container>
      )}
    </>
  );
}


export default TutorCourseDetailScreen;
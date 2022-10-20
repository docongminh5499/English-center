import { Container, Title, Text, Space, Grid, Tabs } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconBallpen, IconBook, IconMicroscope, IconSchool, IconStar, IconUsers } from "@tabler/icons";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CourseStatus, TimeZoneOffset, UserRole } from "../../../../helpers/constants";
import { getCourseStatus } from "../../../../helpers/getCourseStatus";
import { Course } from "../../../../models/course.model";
import Loading from "../../../commons/Loading";
import CourseCurriculum from "./course.curriculum";
import CourseDocument from "./course.document";
import CourseExercise from "./course.exercise";
import CourseRating from "./course.rating";
import CourseSession from "./course.session";
import CourseStudent from "./course.student";

interface IProps {
  userRole?: UserRole | null;
  course: Course | null;
}

const TeacherCourseDetailScreen = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const [didMount, setDidMount] = useState(false);
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
          <Title size="2.6rem" color="#444">{props.course?.name}</Title>
          <Space h={14} />
          <Text align="justify" color="#444">
            {props.course?.curriculum.desc}
          </Text>
          <Space h={14} />
          <Grid>
            <Grid.Col span={isLargeTablet ? (isTablet ? 12 : 6) : 4}>
              <Text color="#444">
                <Text weight={600} component="span">Ngày khai giảng: </Text>
                {moment(props.course?.openingDate).utcOffset(TimeZoneOffset).format("DD/MM/YYYY")}
              </Text>
              <Space h={5} />
              <Text color="#444">
                <Text weight={600} component="span">Ngày dự kiến kết thúc: </Text>
                {moment(props.course?.expectedClosingDate).utcOffset(TimeZoneOffset).format("DD/MM/YYYY")}
              </Text>
            </Grid.Col>
            <Grid.Col span={isLargeTablet ? (isTablet ? 12 : 6) : 4}>
              <Text color="#444">
                <Text weight={600} component="span">Trạng thái: </Text>

                {getCourseStatus(props.course) === CourseStatus.NotOpen && (
                  <Text component="span" weight={600} color="grape">
                    Sắp diễn ra
                  </Text>
                )}

                {getCourseStatus(props.course) === CourseStatus.Opened && (
                  <Text component="span" color="green" weight={600}>
                    Đang diễn ra
                  </Text>
                )}

                {getCourseStatus(props.course) === CourseStatus.Closed && (
                  <Text component="span" color="pink" weight={600}>
                    Đã kết thúc
                  </Text>
                )}
              </Text>
              <Space h={5} />
              <Text color="#444">
                <Text weight={600} component="span">Ngày kết thúc: </Text>
                {props.course?.closingDate ?
                  moment(props.course?.closingDate).utcOffset(TimeZoneOffset).format("DD/MM/YYYY")
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
              <Tabs.Tab
                value="exercise"
                icon={<IconBallpen size={14} />}>
                Bài tập
              </Tabs.Tab>
              <Tabs.Tab
                value="document"
                icon={<IconBook size={14} />}>
                Tài liệu
              </Tabs.Tab>

              {getCourseStatus(props.course) === CourseStatus.Closed && (
                <Tabs.Tab
                  value="rating"
                  icon={<IconStar size={14} />}>
                  Đánh giá
                </Tabs.Tab>
              )}

            </Tabs.List>

            <Tabs.Panel value="curriculum" pt="xs">
              <CourseCurriculum curriculum={props.course?.curriculum} />
            </Tabs.Panel>

            <Tabs.Panel value="session" pt="xs">
              <CourseSession courseSlug={props.course?.slug} />
            </Tabs.Panel>

            <Tabs.Panel value="student" pt="xs">
              <CourseStudent
                courseId={props.course?.id}
                courseSlug={props.course?.slug}
              />
            </Tabs.Panel>

            <Tabs.Panel value="exercise" pt="xs">
              <CourseExercise
                courseSlug={props.course?.slug}
                course={props.course}
              />
            </Tabs.Panel>

            <Tabs.Panel value="document" pt="xs">
              <CourseDocument
                courseSlug={props.course?.slug}
                course={props.course}
              />
            </Tabs.Panel>
            {getCourseStatus(props.course) === CourseStatus.Closed && (
              <Tabs.Panel value="rating" pt="xs">
                <CourseRating courseSlug={props.course?.slug} />
              </Tabs.Panel>
            )}
          </Tabs>
        </Container>
      )}
    </>
  );
}


export default TeacherCourseDetailScreen;
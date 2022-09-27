import { Container, Title, Text, Space, Grid, Tabs } from "@mantine/core";
import { IconBallpen, IconBook, IconMicroscope, IconSchool, IconStar, IconUsers } from "@tabler/icons";
import Head from "next/head";
import CourseCurriculum from "./course.curriculum";
import CourseDocument from "./course.document";
import CourseExercise from "./course.exercise";
import CourseRating from "./course.rating";
import CourseSession from "./course.session";
import CourseStudent from "./course.student";

const TeacherCourseDetailScreen = () => {
  return (
    <>
      <Head>
        <title>Chi tiết khóa học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container p="md" size="lg">
        <Title size="2.6rem" color="#444">Khóa học IELTS 6.0+</Title>
        <Space h={14} />
        <Text align="justify" color="#444">
          Learn in practice everything you need to know about Computer Vision! Build projects step by step using Python!
        </Text>
        <Text align="justify" color="#444">
          Computer Vision is a subarea of Artificial Intelligence focused on creating systems that can process, analyze and identify visual data in a similar way to the human eye. There are many commercial applications in various departments, such as: security, marketing, decision making and production. Smartphones use Computer Vision to unlock devices using face recognition, self-driving cars use it to detect pedestrians and keep a safe distance from other cars, as well as security cameras use it to identify whether there are people in the environment for the alarm to be triggered.
        </Text>
        <Space h={14} />
        <Grid>
          <Grid.Col span={4}>
            <Text color="#444">
              Ngày khai giảng: 01/01/2022
            </Text>
            <Space h={5} />
            <Text color="#444">
              Ngày dự kiến kết thúc: 03/05/2022
            </Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Text color="#444">
              Trạng thái: Đang diễn ra
            </Text>
            <Space h={5} />
            <Text color="#444">
              Ngày kết thúc: --/--/--
            </Text>
          </Grid.Col>
        </Grid>
        <Space h={14} />
        <Tabs defaultValue="curriculum">
          <Tabs.List>
            <Tabs.Tab
              value="curriculum"
              styles={{ tabLabel: { color: "#444" } }}
              icon={<IconSchool size={14} />}>
              Chương trình học
            </Tabs.Tab>
            <Tabs.Tab
              value="session"
              styles={{ tabLabel: { color: "#444" } }}
              icon={<IconMicroscope size={14} />}>
              Buổi học
            </Tabs.Tab>
            <Tabs.Tab value="student"
              styles={{ tabLabel: { color: "#444" } }}
              icon={<IconUsers size={14} />}>
              Học viên
            </Tabs.Tab>
            <Tabs.Tab
              value="exercise"
              styles={{ tabLabel: { color: "#444" } }}
              icon={<IconBallpen size={14} />}>
              Bài tập
            </Tabs.Tab>
            <Tabs.Tab
              value="document"
              styles={{ tabLabel: { color: "#444" } }}
              icon={<IconBook size={14} />}>
              Tài liệu
            </Tabs.Tab>
            <Tabs.Tab
              value="rating"
              styles={{ tabLabel: { color: "#444" } }}
              icon={<IconStar size={14} />}>
              Đánh giá
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="curriculum" pt="xs">
            <CourseCurriculum />
          </Tabs.Panel>

          <Tabs.Panel value="session" pt="xs">
            <CourseSession />
          </Tabs.Panel>

          <Tabs.Panel value="student" pt="xs">
            <CourseStudent />
          </Tabs.Panel>

          <Tabs.Panel value="exercise" pt="xs">
            <CourseExercise />
          </Tabs.Panel>

          <Tabs.Panel value="document" pt="xs">
            <CourseDocument />
          </Tabs.Panel>

          <Tabs.Panel value="rating" pt="xs">
            <CourseRating />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </>
  );
}


export default TeacherCourseDetailScreen;
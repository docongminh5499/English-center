import { Container, Title, Text, Space, Grid, Tabs, Button, Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconBallpen, IconBook, IconMicroscope, IconSchool, IconStar, IconUsers } from "@tabler/icons";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { CourseStatus, TimeZoneOffset, Url, UserRole } from "../../../../helpers/constants";
import { getCourseStatus } from "../../../../helpers/getCourseStatus";
import { Course } from "../../../../models/course.model";
import { useAuth } from "../../../../stores/Auth";
import Loading from "../../../commons/Loading";
import CloseCourseModal from "../Modal/closeCourse.modal";
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
  const [authState] = useAuth();
  const [didMount, setDidMount] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [course, setCourse] = useState(props.course);
  const router = useRouter();


  const onCloseCourse = useCallback(async () => {
    try {
      setIsClosing(true);
      const responses = await API.post(Url.teachers.closeCourse, {
        token: authState.token,
        courseSlug: course?.slug
      });
      if (responses !== null) {
        toast.success("Đóng khóa học thành công");
        setCourse(responses);
      } else toast.error("Đóng khóa học thất bại. Vui lòng thử lại sau.");
      setIsClosing(false);
      setIsOpenModal(false);
    } catch (error) {
      setIsClosing(false);
      setIsOpenModal(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
    }
  }, [authState.token, course?.slug]);


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

      <Modal
        opened={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <CloseCourseModal
          loading={isClosing}
          callBack={onCloseCourse}
        />
      </Modal>

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
            <Grid.Col span={isLargeTablet ? (isTablet ? 12 : 6) : 4}>
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
            <Grid.Col span={isLargeTablet ? (isTablet ? 12 : 6) : 4}>
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
            {course?.teacher.worker.user.id.toString() == authState.userId &&
              course?.closingDate === null &&
              moment().diff(moment(course?.expectedClosingDate).utcOffset(TimeZoneOffset)) >= 0 && (
                <Grid.Col span={isLargeTablet ? 12 : 4}>
                  <Container style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%"
                  }} p={0}>
                    <Button fullWidth color="red" onClick={() => setIsOpenModal(true)}>
                      Kết thúc khóa học
                    </Button>
                  </Container>
                </Grid.Col>
              )}
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

              {course?.teacher.worker.user.id == authState.userId && (
                <>
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
                  {getCourseStatus(course) === CourseStatus.Closed && (
                    <Tabs.Tab
                      value="rating"
                      icon={<IconStar size={14} />}>
                      Đánh giá
                    </Tabs.Tab>
                  )}
                </>
              )}
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
                courseTeacherId={course?.teacher.worker.user.id}
              />
            </Tabs.Panel>

            {/* <Tabs.Panel value="exercise" pt="xs">
              <CourseExercise courseSlug={course?.slug} exercises={props.course?.exercises} courseId={props.course?.id} course={props.course}/>
            </Tabs.Panel> */}

           
            {course?.teacher.worker.user.id == authState.userId && (
              <>
                <Tabs.Panel value="exercise" pt="xs">
                  <CourseExercise
                    exercises={props.course?.exercises}
                    courseSlug={course?.slug}
                    course={course}
                    courseId={props.course?.id}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="document" pt="xs">
                  <CourseDocument
                    courseSlug={course?.slug}
                    course={course}
                  />
                </Tabs.Panel>
                {getCourseStatus(course) === CourseStatus.Closed && (
                  <Tabs.Panel value="rating" pt="xs">
                    <CourseRating courseSlug={course?.slug} />
                  </Tabs.Panel>
                )}
              </>
            )}
          </Tabs>
        </Container>
      )}
    </>
  );
}


export default TeacherCourseDetailScreen;
import { Loader, Tabs, Text, Title, Container } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../../helpers/api";
import { CourseStatus, Url } from "../../../../../helpers/constants";
import { getCourseStatus } from "../../../../../helpers/getCourseStatus";
import { useAuth } from "../../../../../stores/Auth";
import CourseAttendanceTab from "./course.attendance";
import CourseExerciseTab from "./course.exercise";

function translateCourseStatus2String(courseStatus: CourseStatus) {
  if (courseStatus === CourseStatus.Opened) return "Đang diễn ra";
  else if (courseStatus === CourseStatus.NotOpen) return "Sắp diễn ra";
  else return "Đã kết thúc";
}

const ParentCourseContentScreen = (props: any) => {
  const router = useRouter();
  const [authState] = useAuth();

  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [attendance, setAttendance] = useState(null);

  let courseSlug = "";
  const studentId = router.query.studentId;
  useEffect(() => {
    if (!router.isReady) return;

    courseSlug = router.query.slug[0];
    console.log("====================================================");
    console.log(courseSlug);
    const didMountFunc = async () => {
      try {
        setLoading(true);
        const courseResponse = await API.get(
          Url.parents.getCourseDetail + courseSlug,
          {
            token: authState.token,
            studentId: studentId,
          }
        );

        const attendanceResponse = await API.get(
          Url.parents.getAttendance + courseSlug,
          {
            token: authState.token,
            studentId: studentId,
          }
        );
        //Set state
        console.log(courseResponse);
        setCourse(courseResponse);
        setAttendance(attendanceResponse);
      } catch (error) {
        console.log(error);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    didMountFunc();
  }, [router.isReady]);

  console.log("====================================================");
  console.log(courseSlug);

  let openingDate = new Date();
  let closingDate = new Date();

  if (course === null) {
    // setLoading(true);
  } else {
    openingDate = new Date(course.openingDate);
    closingDate =
      course.closingDate === null
        ? new Date(course.expectedClosingDate)
        : new Date(course.closingDate);
  }

  return (
    <>
      <Head>
        <title>Chi tiết khóa học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading && (
        <>
          <Container style={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 9.1rem)",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <Loader size={"xl"} />
          </Container>

        </>
      )}

      {course !== null && (
        <div style={{ width: "100%", padding: "0px 2rem 0px 2rem" }}>
          <Title
            order={3}
            align="left"
            style={{
              width: "100%",
              margin: "20px 0px 0px",
              textAlign: "left",
            }}
          >
            Khóa học: {course.name}
          </Title>
          <Text
            size="md"
            align="left"
            style={{
              width: "100%",
              textAlign: "left",
            }}
          >
            Thời gian:{" "}
            {`${openingDate.getDate()}/${
              openingDate.getMonth() + 1
            }/${openingDate.getFullYear()} -
							${closingDate.getDate()}/${
              closingDate.getMonth() + 1
            }/${closingDate.getFullYear()}`}
          </Text>
          <Text
            size="md"
            align="left"
            style={{
              width: "100%",
              textAlign: "left",
            }}
          >
            Tình trạng: {translateCourseStatus2String(getCourseStatus(course))}
          </Text>
          <Tabs defaultValue="attendance" style={{ margin: "20px 0px 0px" }}>
            <Tabs.List>
              <Tabs.Tab value="attendance">Điểm danh</Tabs.Tab>
              <Tabs.Tab value="exercise">Bài tập</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="attendance">
              <CourseAttendanceTab course={course} attendance={attendance} />
            </Tabs.Panel>
            <Tabs.Panel value="exercise">
              <CourseExerciseTab course={course} studentId={studentId} />
            </Tabs.Panel>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default ParentCourseContentScreen;

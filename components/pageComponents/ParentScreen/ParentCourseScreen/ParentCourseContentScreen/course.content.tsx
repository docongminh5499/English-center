import { Loader, Tabs, Text, Title } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../../helpers/api";
import { CourseStatus, Url } from "../../../../../helpers/constants";
import { getCourseStatus } from "../../../../../helpers/getCourseStatus";
import { useAuth } from "../../../../../stores/Auth";

function translateCourseStatus2String(courseStatus: CourseStatus){
  if (courseStatus === CourseStatus.Opened)
    return "Đang diễn ra";
  else if (courseStatus === CourseStatus.NotOpen)
    return "Sắp diễn ra";
  else
    return "Đã kết thúc";
}

const ParentCourseContentScreen = (props: any) => {
	const router = useRouter();
	const [authState, ] = useAuth();

  const [loading, setLoading] = useState(false);
	const [course, setCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

	const courseSlug = router.query.slug[0] === undefined ? "" : router.query.slug[0];
	const studentId = router.query.studentId;

	useEffect(() => {
    const didMountFunc = async () => {
      try {
        setLoading(true);
        if(selectedStudent === null)
          return;
        const course = await API.get(Url.parents.getCourseDetail, {
          token: authState.token,
					studentId: studentId,
					courseSlug: courseSlug,
        });
				//Set state
        setCourse(course);
      } catch (error) {
				console.log(error);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
      }finally {
				setLoading(false);
			}
    };
    didMountFunc();
  }, [selectedStudent]);

  let openingDate = new Date();
  const closingDate = course.closingDate === null ? new Date(course.expectedClosingDate) : new Date(course.closingDate);

	if(course === null){
    setLoading(true);
  }else {
		openingDate = new Date(course.openingDate);
	}


  return (
    <>
      <Head>
          <title>{courseSlug}</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>
			{loading && 
				<>
					<Loader size={"xl"}/>
				</>
			}
			{course !== null &&
				<div style={{width: "100%", margin: "0px 0px 0px 20px"}}>
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
						Thời gian: {
							`${openingDate.getDate()}/${openingDate.getMonth() + 1}/${openingDate.getFullYear()} -
							${closingDate.getDate()}/${closingDate.getMonth() + 1}/${closingDate.getFullYear()}`
						}
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
					<Tabs defaultValue="attendance" style={{margin: "20px 0px 0px"}}>
						<Tabs.List>
							<Tabs.Tab value="attendance">Điểm danh</Tabs.Tab>
							<Tabs.Tab value="document">Tài liệu</Tabs.Tab>
							<Tabs.Tab value="exercise">Bài tập</Tabs.Tab>
							<Tabs.Tab value="rating">Đánh giá</Tabs.Tab>
						</Tabs.List>

						{/* <Tabs.Panel value="attendance">
							<CourseAttendanceTab {...props} />
						</Tabs.Panel>
						<Tabs.Panel value="document">
							<CourseDocumentTab course={course}/>
						</Tabs.Panel>
						<Tabs.Panel value="exercise">
							<CourseExerciseTab course={course}/>
						</Tabs.Panel>
						<Tabs.Panel value="rating">
							<CourseRatingTab {...course} />
						</Tabs.Panel> */}
					</Tabs>
				</div>
			}
    </>
  );
};

export default ParentCourseContentScreen;

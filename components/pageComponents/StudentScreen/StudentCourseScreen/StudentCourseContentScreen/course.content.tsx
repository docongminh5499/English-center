import { Tabs, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { CourseStatus } from "../../../../../helpers/constants";
import { getCourseStatus } from "../../../../../helpers/getCourseStatus";
import { useAuth } from "../../../../../stores/Auth";
import CourseAttendanceTab from "./course.attendance";
import CourseDocumentTab from "./course.document";
import CourseExerciseTab from "./course.exercise";
import CourseRatingTab from "./course.rating";

function translateCourseStatus2String(courseStatus: CourseStatus){
  if (courseStatus === CourseStatus.Opened)
    return "Đang diễn ra";
  else if (courseStatus === CourseStatus.NotOpen)
    return "Sắp diễn ra";
  else
    return "Đã kết thúc";
}

const StudentCourseContentScreen = (props: any) => {
  const course = props.course;

  const openingDate = new Date(course.openingDate);
  const closingDate = course.closingDate === null ? new Date(course.expectedClosingDate) : new Date(course.closingDate);

  return (
    <>
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

          <Tabs.Panel value="attendance">
            <CourseAttendanceTab />
          </Tabs.Panel>
          <Tabs.Panel value="document">
            <CourseDocumentTab />
          </Tabs.Panel>
          <Tabs.Panel value="exercise">
            <CourseExerciseTab />
          </Tabs.Panel>
          <Tabs.Panel value="rating">
            <CourseRatingTab {...course} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
};

export default StudentCourseContentScreen;

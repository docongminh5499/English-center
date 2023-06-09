import {
  Box,
  Button,
  Container,
  Grid,
  Group,
  Loader,
  MediaQuery,
  Modal,
  Popover,
  RingProgress,
  ScrollArea,
  Select,
  Table,
  Title,
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { Url } from "../../../../helpers/constants";
import { useAuth } from "../../../../stores/Auth";
import SelectStudentModal from "../Modal/selectStudent.modal";
import Head from "next/head";
import { useParent } from "../../../../stores/Parent";

function getKeyFromDate(date: Date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function format2dayInTimetable(courses: any) {
  const formatDayInTimetable = new Map();

  for (const course of courses) {
    for (const studySession of course.studySessions) {
      const studySessionDate = new Date(studySession.date);
      const key = getKeyFromDate(studySessionDate);

      if (!formatDayInTimetable.has(key)) {
        formatDayInTimetable.set(key, []);
      }
      formatDayInTimetable.get(key).push({
        courseName: course.name,
        studySession: studySession,
        branchName: course.branch.name,
      });
    }
  }

  return formatDayInTimetable;
}

const ParentHomeScreen = (props: any) => {
  const [authState] = useAuth();
  const [parentState, setParentState] = useParent();
  const [selectStudentModal, setSelectStudentModal] = useState(
    parentState.selectedStudentId == undefined ? true : false
  );
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const arrColor = ["green", "blue", "orange", "grape", "yellow"];

  console.log(
    "============================================================================="
  );
  console.log(parentState);
  const parent = props.parent;

  useEffect(() => {
    const didMountFunc = async () => {
      try {
        setLoading(true);
        if (parentState.selectedStudentId == undefined) return;
        const courseResponse = await API.get(Url.parents.getAllStudentCourses, {
          token: authState.token,
          studentId: parentState.selectedStudentId,
        });

        //Set state
        console.log(
          "-------------------------------------------------------------------"
        );
        console.log(parent);
        const userStudent = parent.userStudents.filter(
          (value: any) => value.user.id === parentState.selectedStudentId
        );
        console.log(
          "-------------------------------------------------------------------"
        );
        console.log(userStudent);
        if (userStudent.length !== 0) setSelectedStudent(userStudent[0]);
        setCourses(courseResponse);
      } catch (error) {
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    didMountFunc();
  }, [parentState.selectedStudentId]);

  const dayInTimetable = format2dayInTimetable(courses);
  let minDate = new Date();

  if (courses.length !== 0) {
    minDate = new Date(courses[0].openingDate);
    minDate = new Date(minDate.setDate(1));
  }

  console.log(props.parent);
  console.log(`Selected Student: ${selectedStudent?.user.fullName}`);

  console.log("=================================================");
  console.log(dayInTimetable);

  return (
    <Box m={"md"} style={{ width: "100%" }}>
      <Head>
        <title>Thời khóa biểu</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {selectStudentModal && (
        <SelectStudentModal
          students={parent.userStudents}
          setSelectedStudent={setSelectedStudent}
          openedModal={setSelectStudentModal}
        />
      )}
      {!selectStudentModal && !loading && courses.length === 0 && (
        <Box style={{ width: "100%", margin: "0px 20px" }}>
          <MediaQuery smallerThan={768} styles={{ fontSize: "2rem" }}>
            <Title
              order={1}
              align="justify"
              style={{
                width: "100%",
                textAlign: "center",
              }}
            >
              Học viên này hiện không tham gia khóa học nào.
            </Title>
          </MediaQuery>
        </Box>
      )}
      {!selectStudentModal && !loading && courses.length !== 0 && (
        <>
          <Box style={{ width: "100%" }}>
            <Box>
              <MediaQuery smallerThan={768} styles={{ fontSize: "2rem" }}>
                <Title
                  order={1}
                  align="justify"
                  style={{
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  Thời Khóa Biểu
                </Title>
              </MediaQuery>

              <MediaQuery smallerThan={768} styles={{ fontSize: "1.5rem" }}>
                <Title
                  order={5}
                  align="center"
                  style={{ width: "100%" }}
                  mt={"sm"}
                >
                  {new Date().toLocaleDateString("pt-PT")}
                </Title>
              </MediaQuery>
              <Grid>
                <Grid.Col span={6}>
                  <Title
                    align="right"
                    order={3}
                    style={{ width: "100%" }}
                    mt={"sm"}
                  >
                    Học viên:
                  </Title>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Group position="left" align={"center"} mt="sm">
                    <Select
                      radius={"md"}
                      size={"md"}
                      placeholder="Chọn học viên muốn bạn theo dõi"
                      defaultValue={parentState.selectedStudentId?.toString()}
                      onChange={(value: string) => {
                        setParentState.setSelectedStudent(parseInt(value));
                      }}
                      data={parent.userStudents.map((userStudent: any) => {
                        return {
                          value: userStudent.user.id.toString(),
                          label: userStudent.user.fullName,
                        };
                      })}
                    />
                  </Group>
                </Grid.Col>
              </Grid>
            </Box>

            <Calendar
              style={{ marginTop: "20px" }}
              fullWidth
              onChange={() => console.log("CHANGED")}
              locale="vi"
              labelFormat="MM/YYYY"
              initialMonth={
                new Date().getTime() >
                new Date(courses[0].openingDate).getTime()
                  ? new Date()
                  : new Date(courses[0].openingDate)
              }
              minDate={minDate}
              renderDay={(date) => {
                let day = date.getDate() + "";
                if (day.length < 2) day = "0" + day;
                const key = getKeyFromDate(date);
                let dateBackgroundColor = "white";
                let textColor = null;
                let dropdownInfo = <></>;
                // TODO: handle studysession is cancelled
                if (dayInTimetable.has(key)) {
                  console.log(date);
                  for (const data of dayInTimetable.get(key)) {
                    console.log("***********************");
                    dateBackgroundColor = "green";
                    textColor = "white";
                  }
                  dropdownInfo = dayInTimetable.get(key).map((data: any) => {
                    const shifts = data.studySession.shifts;
                    const startTime = moment(shifts[0].startTime).format("hh");
                    const endTime = moment(
                      shifts[shifts.length - 1].endTime
                    ).format("hh");
                    return (
                      <tr key={data.studySession.id}>
                        <td>{data.courseName}</td>
                        <td>{`${startTime} - ${endTime}`}</td>
                        <td>{data.branchName}</td>
                        <td>
                          {data.studySession.classroom === null
                            ? "-"
                            : data.studySession.classroom.name}
                        </td>
                      </tr>
                    );
                  });
                } else {
                  return <div>{day}</div>;
                }
                return (
                  <Box>
                    <Popover
                      width={"100"}
                      position="bottom-end"
                      withArrow
                      shadow="md"
                      zIndex={1}
                    >
                      <Popover.Target>
                      <Group position="center">
                      <RingProgress
                      size={90}
                        label={
                          <>
                            {day}
                          </>
                        }
                        sections={dayInTimetable.get(key).map((value, index) => {
                          return { value: 100/dayInTimetable.get(key).length, color: arrColor[index % arrColor.length] };
                        })}
                      />
                    </Group>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <ScrollArea style={{ width: "100%", flex: 1 }}>
                          <Table withBorder withColumnBorders>
                            <thead>
                              <tr>
                                <th>Tên khóa học</th>
                                <th>Giờ</th>
                                <th>Chi nhánh</th>
                                <th>Phòng</th>
                              </tr>
                            </thead>
                            <tbody>{dropdownInfo}</tbody>
                          </Table>
                        </ScrollArea>
                      </Popover.Dropdown>
                    </Popover>
                  </Box>
                );
              }}
            />
          </Box>
        </>
      )}

      {loading && (
        <Group position="center">
          <Loader size={"lg"} />
        </Group>
      )}
    </Box>
  );
};

export default ParentHomeScreen;

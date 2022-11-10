import { Box, Button, Container, Group, Loader, MediaQuery, Modal, Popover, Table, Title } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { Url } from "../../../../helpers/constants";
import { useAuth } from "../../../../stores/Auth";
import SelectStudentModal from "../Modal/selectStudent.modal";

function getKeyFromDate(date: Date){
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function format2dayInTimetable(courses: any){
  const formatDayInTimetable = new Map();

  for(const course of courses){
    for(const studySession of course.studySessions){
      const studySessionDate = new Date(studySession.date);
      const key = getKeyFromDate(studySessionDate);

      if(!formatDayInTimetable.has(key)){
        formatDayInTimetable.set(key, []);
      }
      formatDayInTimetable.get(key).push({
        courseName: course.name,
        studySession: studySession,
      });
    }
  }

  return formatDayInTimetable;
}

const ParentHomeScreen = (props: any) => {
  const [authState, ] = useAuth();
  const [selectStudentModal, setSelectStudentModal] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const parent = props.parent;

  useEffect(() => {
    const didMountFunc = async () => {
      try {
        setLoading(true);
        if(selectedStudent === null)
          return;
        const exerciseResponse = await API.get(Url.parents.getAllStudentCourses, {
          token: authState.token,
					studentId: selectedStudent?.user.id
        });

				//Set state
        setCourses(exerciseResponse);
      } catch (error) {
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
      }finally {
				setLoading(false);
			}
    };
    didMountFunc();
  }, [selectedStudent]);

  const dayInTimetable = format2dayInTimetable(courses);
  // console.log(new Date(courses[0].openingDate).setDate(1));
  let minDate = new Date();

  if(!courses){
    minDate = new Date(courses[0].openingDate);
    minDate = new Date(minDate.setDate(1));
  }
  
  console.log(props.parent);
  console.log(`Selected Student: ${selectedStudent?.user.fullName}`);

  console.log("=================================================")
  console.log(courses);

  return ( 
    <Box m={"md"} style={{width: "100%"}}>
      {selectStudentModal &&
        <SelectStudentModal 
          students={parent.userStudents} 
          setSelectedStudent={setSelectedStudent} 
          openedModal={setSelectStudentModal}
        />
      }

      {!selectStudentModal && !loading && courses.length !== 0 &&
        <> 
          <Box style={{width: "100%", margin: "0px 20px"}}>
            <Box>
            <MediaQuery smallerThan={768} styles={{ fontSize: "1rem" }}>
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

            <MediaQuery smallerThan={768} styles={{ fontSize: "0.6rem" }}>
              <Title
                order={3}
                align="center"
                style={{ width: "100%"}}
                mt={"md"}
              >
                Học viên: {selectedStudent?.user.fullName}
              </Title>
            </MediaQuery>

            <MediaQuery smallerThan={768} styles={{ fontSize: "0.6rem" }}>
              <Title
                order={5}
                align="center"
                style={{ width: "100%" }}
                mt={"md"}
              >
                {new Date().toLocaleDateString("pt-PT")}
              </Title>
            </MediaQuery>
            </Box>

            <Calendar
              style={{marginTop: "20px"}}
              fullWidth
              onChange={() => console.log("CHANGED")}
              locale="vi"
              labelFormat="MM/YYYY"
              initialMonth={(new Date()).getTime() > (new Date(courses[0].openingDate)).getTime() ? new Date() : new Date(courses[0].openingDate)}
              minDate={minDate}
              renderDay={(date) => {
                let day = date.getDate() + '';
                if (day.length < 2)
                  day = '0' + day
                const key = getKeyFromDate(date);
                let dateBackgroundColor = "white";
                let textColor = null;
                let dropdownInfo = <></>;
                // TODO: handle studysession is cancelled
                if(dayInTimetable.has(key)){
                  for(const data of dayInTimetable.get(key)){
                    console.log("***********************")
                    dateBackgroundColor = "green";
                    textColor = "white";
                  }
                  dropdownInfo = dayInTimetable.get(key).map((data: any) => {
                    const shifts = data.studySession.shifts;
                    const startTime = moment(shifts[0].startTime).format('hh')
                    const endTime = moment(shifts[shifts.length - 1].endTime).format('hh')
                    return (
                      <tr key={data.studySession.id}>
                        <td>{data.courseName}</td>
                        <td>{`${startTime} - ${endTime}`}</td>
                        <td>{data.studySession.classroom?.name || "-"}</td>
                      </tr>
                    );
                  });
                }else {
                  return (
                    <div>{day}</div>
                  );
                }
                return (
                  <Box>
                    <Popover width={"300"} position="bottom" withArrow shadow="md">
                      <Popover.Target>
                        <div>
                          <span style={{backgroundColor: dateBackgroundColor, padding: "10px", width: "70px", height: "70px", color: textColor ,borderRadius: "50%"}}>{day}</span>  
                        </div>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Table withBorder withColumnBorders>
                          <thead>
                            <tr>
                              <th>Tên khóa học</th>
                              <th>Giờ</th>
                              <th>Phòng</th>
                            </tr>
                          </thead>
                          <tbody>{dropdownInfo}</tbody>
                        </Table>
                      </Popover.Dropdown>
                    </Popover>
                  </Box>
                );
              }}
            />
            </Box>
        </>
      }

      {loading &&
        <Group position="center">
          <Loader size={"lg"}/>
        </Group>
      }

    </Box>
  );
};

export default ParentHomeScreen;

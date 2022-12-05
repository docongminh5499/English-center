import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  MediaQuery,
  Modal,
  Popover,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { IconTrash } from "@tabler/icons";
import moment from "moment";
import Head from "next/head";
import { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { Url } from "../../../../helpers/constants";
import { useAuth } from "../../../../stores/Auth";

enum MakeupLessionStatus {
  NONE = "NONE", // Không đăng ký bù
  REGISTERED = "REGISTER", // Buổi được bù
  IS_REGISTER = "IS_REGISTER", // Buổi dùng đăng ký bù
}

function getKeyFromDate(date: Date){
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function format2dayInTimetable(courses: any, makeupLessions: any){
  const formatDayInTimetable = new Map();

  for(const course of courses){
    course.studySessions.forEach((studySession: any, index: number) => {
      const studySessionDate = new Date(studySession.date);
      const key = getKeyFromDate(studySessionDate);

      let isRegisterMakeup = false
      for(const makeupLession of makeupLessions){
        if (makeupLession.studySession === studySession.id){
          isRegisterMakeup = true;
        }
      }

      if(!isRegisterMakeup){
        if(!formatDayInTimetable.has(key)){
          formatDayInTimetable.set(key, []);
        }
        formatDayInTimetable.get(key).push({
          courseName: course.name,
          studySession: studySession,
          order: index,
          courseId: course.id,
          curriculumId: course.curriculum.id,
          branchId: course.branch.id,
          makeupLessionStatus: MakeupLessionStatus.NONE,
        });
      }
    })
  }

  for(const makeupLession of makeupLessions){
    const studySessionDate = new Date(makeupLession.targetStudySession.date);
    const key = getKeyFromDate(studySessionDate);

    if(!formatDayInTimetable.has(key)){
      formatDayInTimetable.set(key, []);
    }
    formatDayInTimetable.get(key).push({
      courseName: makeupLession.targetStudySession.course.name,
      studySession: makeupLession.targetStudySession,
      order: -1,
      courseId: makeupLession.targetStudySession.course.id,
      // curriculumId: makeupLession.targetStudySession.course.curriculum.id,
      // branchId: makeupLession.targetStudySession.course.branch.id,
      makeupLessionStatus: MakeupLessionStatus.IS_REGISTER,
    });
  }

  return formatDayInTimetable;
}

const StudentHomeScreen = (props: any) => {
  const [authState,] = useAuth();
  const [selectMakeupLession, setSelectMakeupLession] = useState(false);
  const [rerender, setRerender] = useState(true);
  const [makeupLessionRow, setMakeupLessionRow] = useState(<></>);
  const courses:[] = props.courses;
  const makeupLessions:[] = props.makeupLessions;
  console.log(makeupLessions);

  const dayInTimetable = format2dayInTimetable(courses, makeupLessions);
  // console.log(new Date(courses[0].openingDate).setDate(1));
  console.log(dayInTimetable);
  let minDate = new Date();
  if (courses.length !== 0)
    minDate = new Date(courses[0].openingDate);
  minDate = new Date(minDate.setDate(1));

  const deleteMakeupLession = async (studySessionId: number, targetStudySessionId: number) => {
    try{
      const response = await API.post(Url.students.deleteMakeupLession, {
        token: authState.token, 
        studySessionId: studySessionId,
        targetStudySessionId: targetStudySessionId,
      });
      toast.success("Xóa buổi học bù thành công!");
    }catch (error){
      console.log(error);
      toast.error("Hệ thống đang gặp sự cố, vui lòng thử lại sau!");
    }
  }
  let makeupLessonRows = <></>;
  if (makeupLessions.length !== 0){
    makeupLessonRows = makeupLessions.map((data: any, index: number) => {
      const shifts = data.targetStudySession.shifts;
      const startTime = moment(shifts[0].startTime).format('hh')
      const endTime = moment(shifts[shifts.length - 1].endTime).format('hh')
      return (
        <>
          <tr key={data.studySession}>
            <td>{data.targetStudySession.course.name}</td>
            <td><Text align="center">{`${startTime} - ${endTime}`}</Text></td>
            <td><Text align="center">{moment(data.targetStudySession.date).format("DD/MM/YYYY")}</Text></td>
            <td><Text align="center">{data.targetStudySession.classroom === null ? "-" : data.targetStudySession.classroom.name}</Text></td>
            <td>
              <Group position="center">
                <Button 
                  color={"red"} 
                  leftIcon={<IconTrash size={14}/>} 
                  mt="md" 
                  style={{float: "right"}}
                  onClick={() => {
                    try{
                      deleteMakeupLession(data.studySession, data.targetStudySession.id);
                      makeupLessions.splice(index, 1);
                      setRerender(!rerender);
                    }catch(error){
                      console.log(error)
                    }   
                  }}
                > 
                  Xóa 
                </Button>
              </Group>
            </td>
          </tr>
        </>
      )
    })
  }
  return (
    <Box style={{ width: "100%" }}>
    <Head>
      <title>Thời khóa biểu</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>


    <Modal
      zIndex={10}
      centered 
      opened={selectMakeupLession}
      // size={1000}
      fullScreen
      onClose={() => {
        setSelectMakeupLession(false);
        setMakeupLessionRow(<></>);
      }}
    >
      <Group  position="center">
        <Title order={2}>Chọn buổi học bù mong muốn.</Title>
      </Group>
      <Group  position="center">
          {makeupLessionRow}
      </Group>
    </Modal>
    
    {courses.length === 0 &&
      <Box style={{
          width: "100%", 
          display: "flex", 
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 9.1rem)"
        }}>
        <MediaQuery smallerThan={768} styles={{ fontSize: "2rem" }}>
          <Title
            order={3}
            color="#CED4DA"
            align="center"
            style={{width: "100%"}}>
            Bạn hiện không tham gia khóa học nào.
          </Title>
        </MediaQuery>
      </Box>
    }

    {courses.length !== 0 &&
      <Box style={{width: "100%"}}>
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
            order={5}
            align="center"
            style={{ width: "100%", margin: "0px" }}
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
              dropdownInfo = dayInTimetable.get(key).map(data => {
                const shifts = data.studySession.shifts;
                const startTime = moment(shifts[0].startTime).format('hh')
                const endTime = moment(shifts[shifts.length - 1].endTime).format('hh')
                const nơw = new Date();
                const handleSelectMakeupLession = async (targetStudySession: number) => {
                  try{
                    const response = await API.post(Url.students.registerMakeupLesion, {
                      token: authState.token, 
                      studySession: data.studySession.id,
                      targetStudySession: targetStudySession,
                    });
                    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
                    console.log(response)
                    makeupLessions.push(response);
                    setRerender(!rerender);
                    toast.success("Đăng ký học bù thành công!");
                  }catch (error){
                    console.log(error);
                    toast.error("Hệ thống đang gặp sự cố, vui lòng thử lại sau!");
                  }finally {
                    setSelectMakeupLession(false);
                  }
                }

                const showSelectMakeupLession = async () => {
                  setSelectMakeupLession(true);
                  try{
                    const compatibleStudySession = await API.get(Url.students.getMakeupLessionCompatible, {
                      token: authState.token, 
                      courseId: data.courseId,
                      curriculumId: data.curriculumId,
                      branchId: data.branchId,
                      studySession: data.studySession.id,
                      order: data.order,
                    });
                    console.log(compatibleStudySession)
                    if (compatibleStudySession === null || compatibleStudySession.length === 0) {
                      setMakeupLessionRow(<Box><Text size="md" weight={500} color={"gray"}>Không có buổi học bù tương ứng</Text></Box>);
                    }else {
                      setMakeupLessionRow(
                        <Table withBorder withColumnBorders mt={"md"}>
                          <thead>
                            <tr>
                              <th><Text align="center">Tên khóa học</Text></th>
                              <th><Text align="center">Giờ</Text></th>
                              <th><Text align="center">Ngày</Text></th>
                              <th><Text align="center">Phòng</Text></th>
                              <th><Text align="center">Sĩ số</Text></th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>{compatibleStudySession.map((makeupLession: any) => {
                              const studySession = makeupLession.studySession;
                              const shifts = studySession.shifts;
                              const startTime = moment(shifts[0].startTime).format('hh')
                              const endTime = moment(shifts[shifts.length - 1].endTime).format('hh')
                              return (
                                  <tr key={studySession.id}>
                                    <td>
                                      {studySession.course.name}
                                    </td>
                                    <td>
                                      <Text 
                                        align="center" 
                                      >
                                      {`${startTime} - ${endTime}`}
                                      </Text>
                                    </td>
                                    <td>
                                      <Text 
                                        align="center" 
                                      >
                                        {moment(studySession.date).format("DD/MM/YYYY")}
                                      </Text>
                                    </td>
                                    <td>
                                      <Text 
                                        align="center" 
                                      >
                                        {studySession.classroom === null ? "-" : studySession.classroom.name}
                                      </Text>
                                    </td>
                                    <td>
                                      <Text 
                                        align="center" 
                                      >
                                        {`${makeupLession.numStudentWillAttend}/${makeupLession.maxStudent}`}
                                      </Text>
                                    </td>
                                    {makeupLession.numStudentWillAttend < makeupLession.maxStudent &&
                                    <td>
                                      <Text 
                                        align="center" 
                                        color={"blue"} 
                                        underline
                                        onClick={() => {
                                          handleSelectMakeupLession(studySession.id);
                                        }}
                                      >
                                        Chọn
                                      </Text>
                                      </td>
                                    }
                                    {makeupLession.numStudentWillAttend >= makeupLession.maxStudent &&
                                    <td>
                                      <Text 
                                        align="center" 
                                        color={"black"} 
                                      >
                                        Buổi đã đầy.
                                      </Text>
                                      </td>
                                    }
                                  </tr>
                                
                              )
                            })}</tbody>
                        </Table>
                        );
                    }
                  }catch (error){
                    console.log(error);
                    toast.error("Hệ thống đang gặp sự cố, vui lòng thử lại sau!");
                  }
                };
                let registerMakeupSession = <></>;
                //TODO: TESTING
                console.log(date.getTime() - nơw.getTime())
                if (data.makeupLessionStatus === MakeupLessionStatus.IS_REGISTER){
                  registerMakeupSession = <td>
                    <Text 
                      align="center"    
                    >
                      Buổi được đăng ký bù
                    </Text>
                  </td>
                }
                else if (date.getTime() - nơw.getTime() <= 30 * 24 * 60 * 60 * 1000 && date.getTime() - nơw.getTime() >= 14 * 24 * 60 * 60 * 1000 && date.getTime() > nơw.getTime())
                  registerMakeupSession = (
                    <>
                      <td>
                        <Text 
                          align="center" 
                          color={"blue"} 
                          underline
                          onClick={() => {
                            showSelectMakeupLession();
                          }}
                        >
                          Đăng ký
                        </Text>
                      </td>
                    </>
                  )
                else 
                  registerMakeupSession = <td>-</td>;
                return (
                  <tr key={data.studySession.id}>
                    <td>{data.courseName}</td>
                    <td>{`${startTime} - ${endTime}`}</td>
                    <td>{data.studySession.classroom === null ? "-" : data.studySession.classroom.name}</td>
                    {registerMakeupSession}
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
                <Popover width={"300"} position="bottom" withArrow shadow="md" zIndex={1}>
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
                          <th>Đăng ký bù</th>
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
      }

      {makeupLessions.length !== 0 &&
        <Box style={{width: "100%", margin: "20px 20px"}}>
          <Divider my="xl" size={"xl"} color={"violet"} mt="lg"/>
          <MediaQuery smallerThan={768} styles={{ fontSize: "1rem" }}>
            <Title
              order={1}
              align="justify"
              style={{
                width: "100%",
                textAlign: "center",
              }}
            >
              Danh sách buổi học bù
            </Title>
          </MediaQuery>

          <Table withBorder withColumnBorders mt={"md"}>
            <thead>
              <tr>
                <th><Text align="center">Tên khóa học</Text></th>
                <th><Text align="center">Giờ</Text></th>
                <th><Text align="center">Ngày</Text></th>
                <th><Text align="center">Phòng</Text></th>
                <th></th>
              </tr>
            </thead>
            <tbody>{makeupLessonRows}</tbody>
          </Table>
        </Box>
      }
    </Box>
  );
};

export default StudentHomeScreen;

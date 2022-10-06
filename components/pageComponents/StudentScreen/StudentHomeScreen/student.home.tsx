import { Box, Button, Container, Divider, Grid, Group, MediaQuery, ScrollArea, Table, Text, Title } from "@mantine/core";
import Head from "next/head";
import { useEffect, useState } from "react";
import API from "../../../../helpers/api";
import { Url } from "../../../../helpers/constants";
import { useAuth } from "../../../../stores/Auth";
import styles from "./student.module.css";

function getKey(a: number, b: number){
  return a.toString() + b.toString();
}

function cvtWeekDay2Num(weekDay: string){
  switch(weekDay){
    case "Monday":
      return 2;
    case "Tuesday":
      return 3;
    case "Wednesday":
      return 4;
    case "Thursday":
      return 5;  
    case "Friday":
      return 6;
    case "Saturday":
      return 7;
    case "Sunday":
      return 8;
  }
}

function formatContiniousWeekDay(weekDay: []){
  const sortedWeekday = weekDay.sort();
  const setWeekDay = new Set(weekDay);
  if(weekDay.length > 1 && setWeekDay.size === (Math.max(...sortedWeekday) - Math.min(...sortedWeekday) + 1)){
    return Math.min(...sortedWeekday) + " - " + Math.max(...sortedWeekday);
  }
  return weekDay.join(', ');
}

function createRowsTimetableFromCourses(courses: []){
  let arrTimeTable = [];

  for(const course of courses){
    let timeTable = new Map();
    for(const schedule of course.schedules){
      const startTime = schedule.startShift.startTime.split(":");
      const endTime = schedule.endShift.endTime.split(":");
      let key = course.name + getKey(startTime[0], endTime[0]);
      if(!timeTable.has(key)){
        timeTable.set(key, {
          name: course.name,
          openingDate: new Date(course.openingDate),
          closingDate: new Date(course.closingDate),
          startTime: startTime[0],
          endTime: endTime[0],
          room: new Map([[schedule.classroom.name, []]]),
        });
      }
      if(!timeTable.get(key).room.has(schedule.classroom.name))
        timeTable.get(key).room.set(schedule.classroom.name, []);
      timeTable.get(key).room.get(schedule.classroom.name).push(schedule.startShift.weekDay);
    }
    arrTimeTable.push(timeTable);
  }

  let tbodies = [];

  arrTimeTable.forEach(timeTable =>{
    timeTable.forEach((value, key) => {
      let index = 0;
      const rows = [];
      value.room.forEach((v: [], k: string) =>{
        const courseName = index === 0 ? <td rowSpan={value.room.size + 1}>{value.name}</td> : null;
        const shift = index === 0 ? <td rowSpan={value.room.size + 1}>{`${value.startTime}-${value.endTime}`}</td> : null;
        const startingDateFormated = `${value.openingDate.getDate()}/${value.openingDate.getMonth() + 1}/${value.openingDate.getFullYear()}`;
        const closingDateFormated = `${value.closingDate.getDate()}/${value.closingDate.getMonth() + 1}/${value.closingDate.getFullYear()}`;
        const openingDate = index === 0 ? <td rowSpan={value.room.size + 1}>{startingDateFormated}</td> : null;
        const closingDate = index === 0 ? <td rowSpan={value.room.size + 1}>{closingDateFormated}</td> : null;
        rows.push(
          (
            <tr key={index}>
              {courseName}
              {shift}
              <td>{formatContiniousWeekDay(v.map(day => cvtWeekDay2Num(day)))}</td>
              <td>{k}</td>
              {openingDate}
              {closingDate}
            </tr>
          )
        )
        index = index + 1;
      });

      tbodies.push((
        <tbody key={key}>
          {rows}
        </tbody>
      ));
    });
  });
  return tbodies;
}

const StudentHomeScreen = (props: any) =>{
  const [authState,] = useAuth();
  const [nowCourse, setNowCourse] = useState([]);
  const [pastCourse, setPastCourse] = useState([]);
  console.log("===================================Render===================================");

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const courses = await API.get(Url.students.getTimetable, {
        token: authState.token,
        username: authState.userName,
      });
      const nowCourseTemp = [];
      const pastCourseTemp = [];
      courses.forEach(course => {
        const closingDate = new Date(course.closingDate);
        const now = new Date();

        
        if(closingDate.getTime() < now.getTime())
          pastCourseTemp.push(course);
        else
          nowCourseTemp.push(course);
      });

      setNowCourse(nowCourseTemp);
      setPastCourse(pastCourseTemp);
      // setNowCourse(courses);
    }
    console.log("Fecth Data");
    // call the function
    fetchData().catch(console.error);
  }, [])

  const tbodiesNowTimetable = createRowsTimetableFromCourses(nowCourse);
  const tbodiesPastTimetable = createRowsTimetableFromCourses(pastCourse);

  return (
    <>
      <Head>
          <title>Thời khóa biểu</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid grow style={{width: "80%", overflowX: "auto"}}>
        <MediaQuery smallerThan={768} styles={{fontSize: "1rem"}}>
          <Title order={1} align="justify"  style={{width: "100%", margin: "20px 20px 0px", textAlign: "center"}}> Thời Khóa Biểu</Title>
        </MediaQuery>

        <MediaQuery smallerThan={768} styles={{fontSize: "0.6rem"}}>
          <Title order={5} align="center"  style={{width: "100%", margin: "0px"}}> {(new Date()).toLocaleDateString('pt-PT')}</Title>
        </MediaQuery>
        <MediaQuery smallerThan={768} styles={{fontSize: "0.8rem"}}>
          <Title order={3} align="left" transform="full-width" style={{width: "100%", marginLeft: "50px"}}> Đang diễn ra</Title>
        </MediaQuery>

        <MediaQuery smallerThan={768} styles={{margin: "10px 10px"}}>
          <div style={{margin: "20px 50px", width: "100%", overflowX:"auto"}}>
            <table  className={styles.timeTable}>
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Giờ</th>
                  <th>Thứ</th>
                  <th>Phòng</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                </tr>
              </thead>
              {tbodiesNowTimetable}
            </table>
          </div>
        </MediaQuery>
        <MediaQuery smallerThan={768} styles={{margin: "10px 10px"}}>
          <Divider my="xl" style={{width: "100%", margin: "10px 10px"}}/>
        </MediaQuery>
        {/* ======================================================================================= */}
        <MediaQuery smallerThan={768} styles={{fontSize: "0.8rem"}}>
          <Title order={3} align="left" transform="full-width" style={{width: "100%", marginLeft: "50px"}}>Đã kết thúc</Title>
        </MediaQuery>

        <MediaQuery smallerThan={768} styles={{margin: "10px 10px"}}>
          <div style={{margin: "20px 50px", width: "100%", overflowX:"auto"}}>
            <table  className={styles.timeTable}>
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Giờ</th>
                  <th>Thứ</th>
                  <th>Phòng</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                </tr>
              </thead>
              {tbodiesPastTimetable}
            </table>
          </div>
        </MediaQuery>
      </Grid>
    </>
  )
};

export default StudentHomeScreen;

/*

data:
  Course:
    openingDate: Date,
    closingDate: Date,
    schedules: [
      id: int
      startShift: 
        id: int,
        startTime: Date,
        endTime: Date,
        weekDay: Weekday,       
      endShift:
        id: int,
        startTime: Date,
        endTime: Date,
        weekDay: Weekday,
      classroom: 
        name: string,
        branch: Branch,
    ],
*/
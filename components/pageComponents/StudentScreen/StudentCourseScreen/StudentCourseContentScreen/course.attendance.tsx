import {
  createStyles,
  Divider,
  Grid,
  Group,
  Indicator,
  List,
  MediaQuery,
  Popover,
  Text,
  Title,
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import "dayjs/locale/vi";

function getKeyFromDate(date: Date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function formatAttendanceData(attendances: any) {
  const formatedAttendance = new Map();
  for (const attendance of attendances) {
    const studySessionDate = new Date(attendance.studySession.date);
    const key = getKeyFromDate(studySessionDate);
    if (!formatedAttendance.has(key)) {
      formatedAttendance.set(key, [
        {
          commentOfTeacher: attendance.commentOfTeacher,
          isAttend: attendance.isAttend,
        },
      ]);
    } else {
      formatedAttendance
        .get(key)
        .push({
          commentOfTeacher: attendance.commentOfTeacher,
          isAttend: attendance.isAttend,
        });
    }
  }
  return formatedAttendance;
}

const useStyles = createStyles((theme, _params, getRef) => ({
  dot: {
    height: "20px",
    width: "20px",
    borderRadius: "50%",
    display: "inline-block",
    margin: "5px 10px",
  },

  redDot: {
    backgroundColor: "red",
  },

  greenDot: {
    backgroundColor: "green",
  },

  blackDot: {
    backgroundColor: "black",
  },

  annotationContent: {
    margin: "15px 0px 0px 20px",
  },

  annotationItem: {
    display: "inline",
    margin: "auto",
  },
}));

const CourseAttendanceTab = (props: any) => {

  const course = props.course;
  const totalCourseStudySession = props.totalCourseStudySession;
  console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP");
  console.log(totalCourseStudySession);

  const openingDate = new Date(course.openingDate);
  const closingDate =
    course.closingDate === null
      ? new Date(course.expectedClosingDate)
      : new Date(course.closingDate);
  const now = new Date();
  let initialMonth = null;

  if (
    now.getTime() > openingDate.getTime() &&
    now.getTime() < closingDate.getTime()
  )
    initialMonth = now;
  else initialMonth = openingDate;

  const attendances = formatAttendanceData(props.attendance);
  console.log(attendances);
  // console.log(`Start: ${openingDate}, Closed: ${closingDate}`);

  const { classes, cx } = useStyles();
  return (
    <>
      <Title
        order={1}
        align="justify"
        style={{ width: "100%", margin: "20px 20px 0px", textAlign: "center" }}
      >
        Kết quả điểm danh
      </Title>
      <Grid grow style={{ margin: "20px 0px" }}>
        <Grid.Col span={4}>
          <Calendar
            style={{ margin: "auto" }}
            onChange={() => console.log("CHANGED")}
            locale="vi"
            labelFormat="MM/YYYY"
            hideOutsideDates
            minDate={openingDate}
            maxDate={closingDate}
            initialMonth={initialMonth}
            renderDay={(date) => {
              const day = date.getDate();
              let indicatorColor = "white";
              const positionOrder = ["top-end", "top-middle", "top-start"];
              let dayJSX = <div>{day}</div>;
              if (attendances.has(getKeyFromDate(date))) {
                attendances
                  .get(getKeyFromDate(date))
                  .forEach((studenAttendStudySession: any, idx: number) => {
                    if (studenAttendStudySession.isAttend === true)
                      indicatorColor = "green";
                    else if (studenAttendStudySession.isAttend === false)
                      indicatorColor = "red";
                    dayJSX = (
                      <Indicator
                        size={6}
                        color={indicatorColor}
                        offset={8}
                        position={positionOrder[idx]}
                      >
                        {dayJSX}
                      </Indicator>
                    );
                  });
                dayJSX = (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Popover
                      width={200}
                      position="bottom"
                      withArrow
                      shadow="md"
                    >
                      <Popover.Target>{dayJSX}</Popover.Target>
                      <Popover.Dropdown>
                        <Text size="sm">
                          {
                            attendances.get(getKeyFromDate(date))[0]
                              .commentOfTeacher
                          }
                        </Text>
                      </Popover.Dropdown>
                    </Popover>
                  </div>
                );
              } else return <div>{day}</div>;
              return dayJSX;
            }}
            allowLevelChange={false}
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <Title order={3}>Chú thích</Title>
          <List withPadding>
            <List.Item icon={<span className={cx(classes.dot, classes.greenDot)}></span>}>
              <Group position="center" align={"center"}>
                <Text size={20} fw={500}>Có mặt</Text>
              </Group>
            </List.Item>
            <List.Item icon={<span className={cx(classes.dot, classes.redDot)}></span>}>
              <Group position="center" align={"center"}>
                <Text size={20} fw={500}>Vắng mặt</Text>
              </Group>
            </List.Item>
          </List>

          <Divider mt="sm" />

          <Title order={3} mt="sm">Thống kê chi tiết:</Title>

          <List withPadding>
            <List.Item>
              <Group position="center" align={"center"}>
                <Text size={20} fw={500}>Tổng số buổi học: {totalCourseStudySession}</Text>
              </Group>
            </List.Item>

            <List.Item>
              <Group position="center" align={"center"}>
                <Text size={20} fw={500}>Đã diễn ra: {props.attendance.length}</Text>
              </Group>
            </List.Item>

            <List.Item>
              <Group position="center" align={"center"}>
                <Text size={20} fw={500}>Tham dự: {props.attendance.filter((value: any) => value.isAttend).length}</Text>
              </Group>
            </List.Item>

            <List.Item>
              <Group position="center" align={"center"}>
                <Text size={20} fw={500}>Vắng mặt: {props.attendance.filter((value: any) => !value.isAttend).length}</Text>
              </Group>
            </List.Item>
          </List>

        </Grid.Col>
      </Grid>
    </>
  );
};

export default CourseAttendanceTab;

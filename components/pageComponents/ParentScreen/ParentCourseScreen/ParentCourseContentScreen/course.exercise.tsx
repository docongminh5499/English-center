import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Loader,
  Modal,
  Radio,
  ScrollArea,
  Space,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import moment from "moment";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import API from "../../../../../helpers/api";
import {
  ExerciseStatus,
  TimeZoneOffset,
  Url,
} from "../../../../../helpers/constants";
import { getImageUrl } from "../../../../../helpers/image.helper";
import { useAuth } from "../../../../../stores/Auth";
import { useMediaQuery } from "@mantine/hooks";
import Lecture from "../../../../../models/lecture.model";
import Exercise from "../../../../../models/exercise.model";
import { getCourseStatus } from "../../../../../helpers/getCourseStatus";
import { getExerciseStatus } from "../../../../../helpers/getExerciseStatus";
import { IconVocabulary } from "@tabler/icons";

const gradeColor = (grade: number, times: number) => {
  if (times == 0)
    return "black"
	if(grade < 5){
		return "red";
	}else if (grade < 8){
		return "orange";
	}else {
		return "green";
	}
}

const aboutExpiredColor = (openTime: Date, endTime: Date, times: number) => {
  const now = new Date();
  if (
    times === 0 &&
    getExerciseStatus(openTime, endTime) === ExerciseStatus.Opened &&
    Math.abs(endTime.getTime() - now.getTime()) < 3 * 24 * 60 * 60 * 1000
  ) {
    return "orange";
  }
  return "#444";
};

const CourseExerciseTab = (props: any) => {
  const isLargeTablet = useMediaQuery("(max-width: 1024px)");
  const isTablet = useMediaQuery("(max-width: 768px)");
  const isMobile = useMediaQuery("(max-width: 480px)");

  const [authState] = useAuth();
  const [listExercises, setListExercises] = useState<Exercise[]>([]);
  const [studentDoExercise, setStudentDoExercise] = useState([]);
  const [loading, setLoading] = useState(true);
  const course = props.course;
  const studentId = props.studentId;

  const listLecture =
    course.curriculum === undefined ? [] : course.curriculum.lectures;
  listLecture.sort((a: Lecture, b: Lecture) => {
    return a.order - b.order;
  });
  const groupedExercise = new Map<number, Exercise[]>();
  for (const lecture of listLecture) {
    groupedExercise.set(lecture.id, []);
  }
  for (const exercise of listExercises) {
    const key = exercise.lecture.id;
    if (groupedExercise.has(key)) {
      groupedExercise.get(key)?.push(exercise);
    }
  }
  console.log(
    "--------------------------------------------------------------------------"
  );
  console.log(listLecture);
  console.log(groupedExercise);

  useEffect(() => {
    (async () => {
      try {
        const exercises: [] = await API.get(Url.parents.getAllExercises, {
          token: authState.token,
          studentId: studentId,
          courseId: course.id,
        });
        setListExercises(exercises);

        const studentDoExercise: [] = await API.get(
          Url.parents.getStudentDoExercise,
          {
            token: authState.token,
            studentId: studentId,
            courseId: course.id,
          }
        );
        setStudentDoExercise(studentDoExercise);
      } catch (error) {
        console.log(error);
        toast.error("Hệ thống đang gặp sự cố, vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const exerciseRows = listLecture.map((lecture: Lecture, index: number) => {
    if (groupedExercise.get(lecture.id)?.length === 0) {
      return;
    }

    return (
      <Box
        key={index}
        p={"sm"}
        mb={"xs"}
        // style={{ backgroundColor: "#F5F5F5" }}
      >
        <Title mt={"sm"} order={3}>
          Bài Học {lecture.order}: {lecture.name}
        </Title>
        {groupedExercise.get(lecture.id)?.map((exercise: Exercise, index) => {
          let maxGrade = 0;
          let times = 0;
          const now = new Date();
          studentDoExercise.forEach((stdDoExe: any) => {
            if (stdDoExe.exercise.id === exercise.id) {
              maxGrade = stdDoExe.score > maxGrade ? stdDoExe.score : maxGrade;
              times++;
            }
          });
          return (
            <React.Fragment key={index}>
              <Container size="xl" p={isLargeTablet ? 0 : 10} my={10}>
                <Grid>
                  <Grid.Col>
                    <Title
                      weight={600}
                      color={aboutExpiredColor(
                        new Date(exercise.openTime!),
                        new Date(exercise.endTime!),
                        times
                      )}
                      order={4}
                    >
                      {exercise.name.toUpperCase()}
                    </Title>
                    <Space h={8} />
                    <Grid>
                      <Grid.Col span={isMobile ? 12 : 4}>
                        <Text color="#444" size={15}>
                          Ngày diễn ra:
                          <Text
                            weight={600}
                            component={
                              !isLargeTablet || isMobile ? "span" : "p"
                            }
                          >
                            {" "}
                            {exercise.openTime === null
                              ? "--:--   --/--/----"
                              : moment(exercise.openTime)
                                  .utcOffset(TimeZoneOffset)
                                  .format("HH:mm - DD/MM/YYYY")}
                          </Text>
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={isMobile ? 12 : 4}>
                        <Text color="#444" size={15}>
                          Ngày kết thúc:
                          <Text
                            weight={600}
                            component={
                              !isLargeTablet || isMobile ? "span" : "p"
                            }
                          >
                            {" "}
                            {exercise.endTime === null
                              ? "--:--   --/--/----"
                              : moment(exercise.endTime)
                                  .utcOffset(TimeZoneOffset)
                                  .format("HH:mm - DD/MM/YYYY")}
                          </Text>
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={isMobile ? 12 : 4}>
                        {getExerciseStatus(
                          exercise.openTime,
                          exercise.endTime
                        ) === ExerciseStatus.Closed && (
                          <Text color="#444" size={15}>
                            Tình trạng:
                            <Text
                              weight={600}
                              color="pink"
                              component={
                                !isLargeTablet || isMobile ? "span" : "p"
                              }
                            >
                              {" "}
                              Đã đóng
                            </Text>
                          </Text>
                        )}
                        {getExerciseStatus(
                          exercise.openTime,
                          exercise.endTime
                        ) === ExerciseStatus.Opened && (
                          <Text color="#444" size={15}>
                            Tình trạng:
                            <Text
                              weight={600}
                              color="green"
                              component={
                                !isLargeTablet || isMobile ? "span" : "p"
                              }
                            >
                              {" "}
                              Đang mở
                            </Text>
                          </Text>
                        )}
                        {getExerciseStatus(
                          exercise.openTime,
                          exercise.endTime
                        ) === ExerciseStatus.NotOpen && (
                          <Text color="#444">
                            Tình trạng:
                            <Text
                              weight={600}
                              size={15}
                              color="grape"
                              component={
                                !isLargeTablet || isMobile ? "span" : "p"
                              }
                            >
                              {" "}
                              Chưa mở
                            </Text>
                          </Text>
                        )}
                      </Grid.Col>
                      <Grid.Col span={isMobile ? 12 : 4}>
                        <Text color="#444" size={15}>
                          Số lần thực hiện tối đa:
                          <Text
                            weight={600}
                            component={
                              !isLargeTablet || isMobile ? "span" : "p"
                            }
                          >
                            {" "}
                            {exercise.maxTime}
                          </Text>
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={isMobile ? 12 : 4}>
                        <Text color="#444" size={15}>
                          Số lần đã thực hiện:
                          <Text
                            weight={600}
                            component={
                              !isLargeTablet || isMobile ? "span" : "p"
                            }
                          >
                            {" "}
                            {times}
                          </Text>
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={isMobile ? 12 : 4}>
                        <Text color="#444" size={15}>
                          Điểm cao nhất:
                          <Text
                            weight={600}
                            color={gradeColor(maxGrade, times)}
                            component={
                              !isLargeTablet || isMobile ? "span" : "p"
                            }
                          >
                            {" "}
                            {times == 0 ? "---": maxGrade}
                          </Text>
                        </Text>
                      </Grid.Col>
                    </Grid>
                  </Grid.Col>
                </Grid>
              </Container>

              {index !== listExercises.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </Box>
    );
  });

  return (
    <>
      <Group position="center" mt={"md"} mb={"lg"}>
        <Title order={1}> Danh sách bài tập </Title>
      </Group>

      <Divider
        size={"xl"}
        style={{ width: "50%", margin: "auto" }}
        labelPosition="center"
        label={
          <>
            <IconVocabulary size={30} style={{ margin: "2px" }} />
            <IconVocabulary size={30} style={{ margin: "2px" }} />
            <IconVocabulary size={30} style={{ margin: "2px" }} />
          </>
        }
      />

      <Space h={20} />

      {loading && (
        <Center mt={"xl"}>
          <Loader size={"xl"} />
        </Center>
      )}
      {listExercises.length === 0 && !loading && (
        <>
          <Space h={200} />
          <Group position="center" mt={"md"}>
            <Title order={1}> Hiện tại chưa có bài tập nào. </Title>
          </Group>
        </>
      )}

      {listExercises.length !== 0 && !loading && <>{exerciseRows}</>}
    </>
  );
};

export default CourseExerciseTab;

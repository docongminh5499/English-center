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
  CourseStatus,
  ExerciseStatus,
  TimeZoneOffset,
  Url,
} from "../../../../../helpers/constants";
import { getCourseStatus } from "../../../../../helpers/getCourseStatus";
import { getAudioUrl, getImageUrl } from "../../../../../helpers/image.helper";
import { useAuth } from "../../../../../stores/Auth";
import Lecture from "../../../../../models/lecture.model";
import Exercise from "../../../../../models/exercise.model";
import { getExerciseStatus } from "../../../../../helpers/getExerciseStatus";
import { useMediaQuery } from "@mantine/hooks";
import { IconSeparator, IconVocabulary } from "@tabler/icons";

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
	if(times === 0 && getExerciseStatus(openTime, endTime) === ExerciseStatus.Opened && Math.abs(endTime.getTime() - now.getTime()) < 3*24*60*60*1000){
		return "orange";
	}
	return "#444";
}

const CourseExerciseTab = (props: any) => {
  const isLargeTablet = useMediaQuery("(max-width: 1024px)");
  const isTablet = useMediaQuery("(max-width: 768px)");
  const isMobile = useMediaQuery("(max-width: 480px)");

  const [authState] = useAuth();
  const [listExercises, setListExercises] = useState<Exercise[]>([]);
  const [studentDoExercise, setStudentDoExercise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doExercise, setDoExercise] = useState(false);
  const [confirmDoExercise, setConfirmDoExercise] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [confirmSubmitExercise, setConfirmSubmitExercise] = useState(false);
  const [doingId, setDoingId] = useState(null);
  const course = props.course;
  // console.log(course);
  // console.log("==========================================");
  // console.log(listExercises);

  //====================================================================
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
        const exercises: [] = await API.get(Url.students.getAllExercises, {
          token: authState.token,
          courseId: course.id,
        });
        setListExercises(exercises);

        const studentDoExercise: [] = await API.get(
          Url.students.getStudentDoExercise,
          {
            token: authState.token,
            courseId: course.id,
          }
        );
        setStudentDoExercise(studentDoExercise);
        console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||");
        console.log(studentDoExercise);
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
        // style={{width: "100%"}}
      >
        <Title mt={"sm"} order={3}>
          Bài Học {lecture.order}: {lecture.name}
        </Title>
        {groupedExercise.get(lecture.id)?.map((exercise: Exercise, index) => {
          const openTime = new Date(exercise.openTime!);
          const endTime = new Date(exercise.endTime!);
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
              <Box p={isLargeTablet ? 0 : 10} my={10} style={{width: "100%"}}>
                <Grid grow>
                  <Grid.Col span={isLargeTablet ? 12 : 10}>
                    <Title weight={600} color={aboutExpiredColor(new Date(exercise.openTime!), new Date(exercise.endTime!), times)} order={4}>
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
                          <Text color="#444" size={15}>
                            Tình trạng:
                            <Text
                              weight={600}
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

                  {getCourseStatus(course) === CourseStatus.Opened &&
                    times !== exercise.maxTime &&
                    now.getTime() >= openTime!.getTime() &&
                    now.getTime() <= endTime!.getTime() && (
                      <Grid.Col
                        span={isLargeTablet ? 12 : 2}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          compact={isLargeTablet ? false : true}
                          fullWidth
                          size="xs"
                          variant="light"
                          onClick={() => {
                            if (times === exercise.maxTime) {
                              toast.info(
                                "Bận đã thực hiện hết số lần làm cho phép của bài tập này"
                              );
                              return;
                            }
                            setSelectedExercise(exercise);
                            setConfirmDoExercise(true);
                          }}
                        >
                          Làm bài
                        </Button>
                      </Grid.Col>
                    )}
                </Grid>
              </Box>

              {index !== listExercises.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </Box>
    );

  });

  //============================================== Student Do Exercise ==============================================
  let answerForm = useForm({
    initialValues: {
      answers: [],
    },
  });
  const questions = selectedExercise === null ? null: selectedExercise.questions.sort((a, b) => 0.5 - Math.random());
  const questionRows = useMemo(
    () =>
      selectedExercise === null
        ? null
        : questions.map((element: any, idx: number) => {
            const answer = [
              {
                id: element.id,
                answer: element.answer,
              },
            ];

            answerForm.insertListItem("answers", {
              questionId: element.id,
              answerId: null,
            });

            element.wrongAnswers.forEach((wrongAnswer: any) => {
              answer.push({
                id: wrongAnswer.id,
                answer: wrongAnswer.answer,
              });
            });

            const shuffledAnswer = answer.sort((a, b) => 0.5 - Math.random());

            const question = {
              content: element.quesContent,
              imgSrc: element.imgSrc,
              audioSrc: element.audioSrc,
              tags: element.tags,
            };
            console.log(question);
            return (
              <Box key={element.id} mt={"lg"}>
                <Divider my="xl" size={"xl"} color={"violet"} />
                <Title order={4}>Câu hỏi {idx + 1}:</Title>
                <Title order={5} mt={"sm"}>
                  {question.content}
                </Title>

                <Group mt={"sm"}>
                  {question.tags.map((tag: any) => {
                    return <Badge key={tag.name}>{tag.name}</Badge>;
                  })}
                </Group>
                {question.imgSrc !== null && (
                  <Box
                    style={{
                      width: 240,
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                    mt={"md"}
                  >
                    <Image
                      withPlaceholder
                      placeholder={
                        <Container
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            maxWidth: "300px",
                          }}
                        >
                          <Loader variant="dots" />
                        </Container>
                      }
                      style={{ maxWidth: "300px" }}
                      radius="md"
                      src={getImageUrl(question.imgSrc)}
                      alt="Hình minh họa cho câu hỏi"
                    />
                  </Box>
                )}

                {question.audioSrc != null && (
                  <Group position="center" mt={"sm"} mb="sm">
                    <audio controls>
                      <source src={getAudioUrl(question.audioSrc)} />
                    </audio>
                  </Group>
                )}

                <Radio.Group
                  mt={"sm"}
                  {...answerForm.getInputProps(`answers.${idx}.answerId`, {
                    type: "checkbox",
                  })}
                >
                  <Grid>
                    {shuffledAnswer.map((element: any) => {
                      return (
                        <Grid.Col span={6} key={element.id}>
                          <Radio
                            value={element.id.toString()}
                            label={element.answer}
                          />
                        </Grid.Col>
                      );
                    })}
                  </Grid>
                </Radio.Group>
              </Box>
            );
          }),
    [selectedExercise]
  );

  const startDoExercise = async () => {
    try {
      const result = await API.post(Url.students.startDoExercise, {
        token: authState.token,
        exerciseId: selectedExercise?.id,
      });
      if (result === null) {
        throw new Error();
      }
      setDoingId(result);
      setDoExercise(true);
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống đang gặp sự cố, vui lòng thử lại sau!");
    } finally {
      setConfirmDoExercise(false);
    }
  };

  const handleSubmitExercise = async (exercise: any) => {
    try {
      const studentDoExercise = await API.post(Url.students.submitExercise, {
        token: authState.token,
        doingId: doingId,
        ...answerForm.values,
      });
      setStudentDoExercise((current: any[]) => [...current, studentDoExercise]);
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống đang gặp sự cố, vui lòng thử lại sau!");
    } finally {
      answerForm.reset();
      setDoingId(null);
      setSelectedExercise(null);
      setDoExercise(false);
    }
  };

  return (
    <Box style={{width: "100%"}}>
      {doExercise === false && (
        <Box style={{width: "100%"}}>
          <Modal
            centered
            opened={confirmDoExercise}
            onClose={() => setConfirmDoExercise(false)}
            withCloseButton={false}
          >
            <Group position="center">
              <Text size="xl">Xác nhận thực hiện bài tập này?</Text>
            </Group>
            <Group position="center">
              <Button
                type="submit"
                color={"green"}
                mt="md"
                onClick={startDoExercise}
              >
                Xác nhận
              </Button>
              <Button
                type="submit"
                color={"red"}
                mt="md"
                ml="sm"
                onClick={() => {
                  setSelectedExercise(null);
                  setConfirmDoExercise(false);
                }}
              >
                Hủy bỏ
              </Button>
            </Group>
          </Modal>
          <Group position="center" mt={"md"} mb={"lg"}>
            <Title order={1}> Danh sách bài tập </Title>
          </Group>

          
          <Divider 
            size={"xl"} 
            style={{width: "50%", margin: "auto"}}
            labelPosition="center"
            label={
              <>
                <IconVocabulary size={30} style={{margin: "2px"}}/>
                <IconVocabulary size={30} style={{margin: "2px"}}/>
                <IconVocabulary size={30} style={{margin: "2px"}}/>
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
        </Box>
      )}

      {doExercise === true && selectedExercise !== null && (
        <>
          <Modal
            centered
            opened={confirmSubmitExercise}
            onClose={() => setConfirmSubmitExercise(false)}
            withCloseButton={false}
          >
            <Group position="center">
              <Text size="xl">Xác nhận nộp bài làm?</Text>
            </Group>
            <Group position="center">
              <Button
                type="submit"
                color={"green"}
                mt="md"
                onClick={() => {
                  setConfirmSubmitExercise(false);
                  handleSubmitExercise(selectedExercise);
                }}
              >
                Xác nhận
              </Button>
              <Button
                type="submit"
                color={"red"}
                mt="md"
                ml="sm"
                onClick={() => {
                  setConfirmSubmitExercise(false);
                }}
              >
                Hủy bỏ
              </Button>
            </Group>
          </Modal>

          <Title order={1} align="center" mt={"xl"}>
            {selectedExercise?.name}
          </Title>
          {questionRows}
          <Group position="center" mt={"xl"} mb={"xl"}>
            <Button
              type="submit"
              color={"blue"}
              mt="md"
              onClick={() => {
                console.log("****************************************");
                console.log(answerForm.values);
                setConfirmSubmitExercise(true);
              }}
            >
              Nộp bài
            </Button>
          </Group>
        </>
      )}
    </Box>
  );
};

export default CourseExerciseTab;

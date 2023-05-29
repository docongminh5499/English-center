import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Input,
  Loader,
  LoadingOverlay,
  Modal,
  NativeSelect,
  Popover,
  ScrollArea,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconArrowBackUp, IconEdit } from "@tabler/icons";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { ExerciseStatus, Url } from "../../../../helpers/constants";
import { getAudioUrl, getImageUrl } from "../../../../helpers/image.helper";
import { useAuth } from "../../../../stores/Auth";
import CourseModifyExercise from "./course.exercise.modify";
import dynamic from "next/dynamic";
import { useForm } from "@mantine/form";
import Exercise from "../../../../models/exercise.model";
import Lecture from "../../../../models/lecture.model";
import { DatePicker, TimeInput } from "@mantine/dates";
import { getExerciseStatus } from "../../../../helpers/getExerciseStatus";
const CChart = dynamic(() =>
  import("./cchart").then((module) => module.default)
);

const CourseExerciseDetail = (props: any) => {
  const [authState] = useAuth();
  const [loading, setLoading] = useState(true);
  const [exercise, setExercise] = useState<Exercise>(props.exercise);
  const [studentDoExercise, setStudentDoExercise] = useState([]);
  const [modifyExercise, setModifyExercise] = useState(false);
  const [tags, setTags] = useState([]);
  const [changeInfo, setChangeInfo] = useState(false);
  const listLecture = props.listLecture;

  const [loadingOverplay, setLoadingOverplay] = useState(false);
  const [openTimePopoverOpened, setOpenTimePopoverOpened] = useState(false);
  const [endTimePopoverOpened, setEndTimePopoverOpened] = useState(false);
  const [openTime, setOpenTime] = useState(
    new Date(exercise === null ? "" : exercise.openTime!)
  );
  const [endTime, setEndTime] = useState(
    new Date(exercise === null ? "" : exercise.endTime!)
  );
  console.log("=============================================================");
  console.log(exercise);

  useEffect(() => {
    // 👇️ scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [modifyExercise]);

  useEffect(() => {
    const didMountFunc = async () => {
      try {
        const exerciseResponse = await API.get(Url.teachers.getExerciseById, {
          token: authState.token,
          exerciseId: props.exerciseId,
        });

        const stdDoExeResponse = await API.get(Url.teachers.getStdExeResult, {
          token: authState.token,
          exerciseId: props.exerciseId,
        });
        //Set state
        setExercise(exerciseResponse);
        setStudentDoExercise(stdDoExeResponse);
      } catch (error) {
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    didMountFunc();
  }, []);
  const now = new Date();

  const chartData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (studentDoExercise.length !== 0) {
    studentDoExercise.forEach((element: any) => {
      chartData[Math.round(element.score)]++;
    });
  }

  const basicInfo = useForm({
    initialValues: {
      nameExercise: exercise === null ? "" : exercise.name,
      maxTime: exercise === null ? "" : exercise.maxTime,
      startDate: new Date(exercise === null ? "" : exercise.openTime!),
      startTime: new Date(exercise === null ? "" : exercise.openTime!),
      endDate: new Date(exercise === null ? "" : exercise.endTime!),
      endTime: new Date(exercise === null ? "" : exercise.endTime!),
      lecture: exercise === null ? "" : exercise.lecture.id,
    },

    validate: {
      nameExercise: (value) =>
        value.trim().length === 0 ? "Vui lòng nhập tên bài tập." : null,
      maxTime: (value) =>
        value > 0 && value <= 10
          ? null
          : "Vui lòng nhập số lần thực hiện tối đa trong khoảng 1-5.",
    },
  });

  const changeExerciseInfo = async () => {
    setLoadingOverplay(true)
    basicInfo.validate();
    if (!basicInfo.isValid()) return;
    try {
      const response = await API.post(Url.teachers.changeExerciseInfo, {
        token: authState.token,
        exerciseId: exercise.id,
        basicInfo: basicInfo.values,
      });
      setExercise(response);
      props.setListExercises((listExercise: Exercise[]) => {
        return listExercise.map((exercise: Exercise, index: number) => exercise.id === response.id ? response : exercise);
      })
      toast.success("Thay đổi thông tin thành công!");
    } catch (error) {
      console.log(error)
      toast.error("Thay đổi thất bại, vui lòng thử lại sau!");
    } finally{
      setChangeInfo(false);
      setLoadingOverplay(false);
    }
    setChangeInfo(false);
    setLoadingOverplay(false);
  };

  return (
    <>
      <Modal
        centered
        opened={changeInfo}
        onClose={() => setChangeInfo(false)}
        withCloseButton={false}
      >
        <Grid>
          <Grid.Col span={6}>
            <Title order={4} mt="md">
              Tên bài tập
            </Title>
            <TextInput
              mt="md"
              withAsterisk
              placeholder="Tên bài tập"
              {...basicInfo.getInputProps("nameExercise")}
            />

            <Title order={4} mt="md">
              Số làn làm tối đa
            </Title>
            <TextInput
              mt="md"
              withAsterisk
              placeholder="1"
              {...basicInfo.getInputProps("maxTime")}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Title order={4} mt="md">
              Thời gian mở
            </Title>
            <Group mt="md" grow>
              <Popover
                opened={openTimePopoverOpened}
                position="bottom"
                width="target"
                transition="pop"
                disabled={!(getExerciseStatus(exercise.openTime, exercise.endTime) == ExerciseStatus.NotOpen)}
              >
                <Popover.Target>
                  <div onFocusCapture={() => setOpenTimePopoverOpened(true)}>
                    <Input
                      placeholder="Thời gian bắt đầu"
                      value={moment(openTime).format("HH:mm - DD/MM/YYYY")}
                      onChange={() => {}}
                    />
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <TimeInput
                    mt="sm"
                    defaultValue={new Date()}
                    label="Chọn giờ"
                    withSeconds
                    // clearable
                    {...basicInfo.getInputProps("startTime")}
                  />
                  <DatePicker
                    mt="sm"
                    locale="vi"
                    label="Chọn ngày"
                    defaultValue={new Date()}
                    clearable={false}
                    {...basicInfo.getInputProps("startDate")}
                  />

                  <Button
                    mt="sm"
                    onClick={() => {
                      setOpenTimePopoverOpened(false);
                      const startDate = basicInfo.values.startDate;
                      const startTime = basicInfo.values.startTime;
                      if (startDate === null || startTime === null) return;
                      setOpenTime(
                        new Date(
                          startDate.getFullYear(),
                          startDate.getMonth(),
                          startDate.getDate(),
                          startTime.getHours(),
                          startTime.getMinutes(),
                          startTime.getSeconds()
                        )
                      );
                    }}
                  >
                    Chọn
                  </Button>
                  <Button
                    color={"red"}
                    mt="sm"
                    ml={"sm"}
                    onClick={() => {
                      setOpenTimePopoverOpened(false);
                    }}
                  >
                    Hủy
                  </Button>
                </Popover.Dropdown>
              </Popover>
            </Group>

            <Title order={4} mt="md">
              Thời gian đóng
            </Title>
            <Group mt="md" grow>
              <Popover
                opened={endTimePopoverOpened}
                position="bottom"
                width="target"
                transition="pop"
              >
                <Popover.Target>
                  <div onFocusCapture={() => setEndTimePopoverOpened(true)}>
                    <Input
                      placeholder="Thời gian kết thúc"
                      value={moment(endTime).format("HH:mm - DD/MM/YYYY")}
                      onChange={() => {}}
                    />
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <TimeInput
                    mt="sm"
                    defaultValue={new Date()}
                    label="Chọn giờ"
                    withSeconds
                    // clearable
                    {...basicInfo.getInputProps("endTime")}
                  />
                  <DatePicker
                    mt="sm"
                    locale="vi"
                    label="Chọn ngày"
                    defaultValue={new Date()}
                    clearable={false}
                    {...basicInfo.getInputProps("endDate")}
                  />

                  <Button
                    mt="sm"
                    onClick={() => {
                      setEndTimePopoverOpened(false);
                      const endDate = basicInfo.values.endDate;
                      const endTime = basicInfo.values.endTime;
                      if (endDate === null || endTime === null) return;
                      setEndTime(
                        new Date(
                          endDate.getFullYear(),
                          endDate.getMonth(),
                          endDate.getDate(),
                          endTime.getHours(),
                          endTime.getMinutes(),
                          endTime.getSeconds()
                        )
                      );
                    }}
                  >
                    Chọn
                  </Button>
                  <Button
                    color={"red"}
                    mt="sm"
                    ml={"sm"}
                    onClick={() => {
                      setEndTimePopoverOpened(false);
                    }}
                  >
                    Hủy
                  </Button>
                </Popover.Dropdown>
              </Popover>
            </Group>
          </Grid.Col>

          <Grid.Col span={6}>
            <Title order={4} mt="xs">
              Chọn bài học
            </Title>
            <NativeSelect
              mt="md"
              data={listLecture.map((lecture: Lecture, index: number) => {
                return {
                  value: lecture.id,
                  label: `Bài học ${lecture.order}: ` + lecture.name,
                };
              })}
              {...basicInfo.getInputProps("lecture")}
              withAsterisk
            />
          </Grid.Col>
        </Grid>
        <Group position="center">
          <Button
            type="submit"
            color={"green"}
            mt="md"
            onClick={changeExerciseInfo}
          >
            Lưu thay đổi
          </Button>
          <Button
            type="submit"
            color={"red"}
            mt="md"
            ml="sm"
            onClick={() => setChangeInfo(false)}
          >
            Hủy bỏ
          </Button>
        </Group>
        <LoadingOverlay visible={loadingOverplay} overlayBlur={2} />
      </Modal>
      {loading === true && (
        <Group position="center">
          <Loader size={"lg"} />
        </Group>
      )}

      {loading === false && (
        <>
          {exercise !== null && !modifyExercise && (
            <>
              <Group position="center">
                <Title order={1} mt={"md"}>
                  Bài tập: {exercise.name}
                </Title>
              </Group>

              <Grid mt={"md"}>
                <Grid.Col span={6}>
                  <Text weight={600} size={"lg"}>
                    {" "}
                    Bài học: {exercise.lecture.name}
                  </Text>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Text weight={600} size={"lg"}>
                    {" "}
                    Số lần làm tối đa: {exercise.maxTime}{" "}
                  </Text>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Text weight={600} size={"lg"}>
                    {" "}
                    Thời gian bắt đầu:{" "}
                    {moment(exercise.openTime).format(
                      "HH:mm - DD/MM/YYYY"
                    )}{" "}
                  </Text>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Text weight={600} size={"lg"}>
                    {" "}
                    Thời gian kết thúc:{" "}
                    {moment(exercise.endTime).format("HH:mm - DD/MM/YYYY")}{" "}
                  </Text>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Button onClick={() => setChangeInfo(true)}>
                    Thay đổi thông tin
                  </Button>
                </Grid.Col>
              </Grid>

              <Title order={1} mt={"lg"}>
                Thống kê điểm bài tập:
              </Title>
              {
                <Box>
                  <CChart
                    type="bar"
                    data={{
                      labels: [
                        "0",
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                      ],
                      datasets: [
                        {
                          label: "Số lượng học viên",
                          backgroundColor: "#f87979",
                          data: chartData,
                        },
                      ],
                    }}
                    labels="Số lượng: "
                  />
                </Box>
              }

              <Title order={1} mt={"lg"}>
                Danh sách bài làm:
              </Title>

              {studentDoExercise.length !== 0 && (
                <ScrollArea
                  style={{ width: "100%", height: 500 }}
                  type="scroll"
                >
                  <Grid>
                    {studentDoExercise.map((element: any, idx: number) => {
                      return (
                        <Grid.Col span={6} key={element.student.user.id}>
                          <Text size={"md"} weight={600} mt={"sm"}>
                            Tên:{" "}
                            {element.student.user.fullName === ""
                              ? "Default Name"
                              : element.student.user.fullName}
                          </Text>
                          <Text size={"md"} mt={"sm"}>
                            <Text weight={600} span>
                              Ngày làm:
                            </Text>{" "}
                            {moment(element.endTime).format(
                              "hh:mm - DD/MM/YYYY"
                            )}
                          </Text>
                          <Text
                            size={"md"}
                            weight={600}
                            mt={"sm"}
                            style={{
                              borderBottom: "3px solid red",
                              width: "50%",
                            }}
                          >
                            {" "}
                            Điểm:{" "}
                            <Text span color={"blue"}>
                              {element.score}
                            </Text>
                          </Text>
                        </Grid.Col>
                      );
                    })}
                  </Grid>
                </ScrollArea>
              )}

              {studentDoExercise.length === 0 && (
                <Text color={"#444444"} size={"lg"} weight={600}>
                  Hiện chưa có học viên làm bài tập này.
                </Text>
              )}
              <Title order={1} mt={"lg"}>
                Danh sách câu hỏi: {exercise?.questions.length} câu hỏi
              </Title>

              {exercise?.questions.map((question: any, idx: any) => {
                const rightAnswer = {
                  id: question.id,
                  answer: question.answer,
                };

                const wrongAnswer = question.wrongAnswers.map(
                  (wrongAnswer: any) => {
                    return {
                      id: wrongAnswer.id,
                      answer: wrongAnswer.answer,
                    };
                  }
                );
                return (
                  <Box key={question.id} mt={"lg"}>
                    <Divider my="xl" size={"xl"} color={"violet"} />
                    <Title order={4}>Câu hỏi {idx + 1}:</Title>
                    <Text size={"md"} mt={"sm"}>
                      {question.quesContent}
                    </Text>

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

                    {question.audioSrc !== null && (
                      <Group position="center" mt={"md"}>
                        <audio controls>
                          <source src={getAudioUrl(question.audioSrc)} />
                        </audio>
                      </Group>
                    )}

                    <Grid mt={"md"}>
                      <Grid.Col span={6}>
                        <Title order={4}>Đáp án đúng:</Title>
                        <Text size={"md"}>{rightAnswer.answer}</Text>
                      </Grid.Col>

                      {wrongAnswer.map((element: any, idx: number) => {
                        return (
                          <Grid.Col span={6} key={element.id}>
                            <Title order={4}>Đáp án sai {idx + 1}:</Title>
                            <Text size={"md"}>{element.answer}</Text>
                          </Grid.Col>
                        );
                      })}
                    </Grid>
                  </Box>
                );
              })}

              <Group position="center" mt={"xl"} mb={"xl"}>
                {props.course.closingDate === null &&
                  new Date(exercise.openTime).getTime() > now.getTime() && (
                    <Button
                      style={{ backgroundColor: "#FFC125" }}
                      leftIcon={<IconEdit />}
                      onClick={async () => {
                        const tag: [] = await API.get(
                          Url.teachers.getAllQuestionTag,
                          {
                            token: authState.token,
                          }
                        );

                        const formTags: any[] = [];
                        tag.forEach((element) => {
                          formTags.push({
                            value: element.name,
                            label: element.name,
                          });
                        });
                        setTags(formTags);
                        setModifyExercise(true);
                      }}
                    >
                      Chỉnh cửa
                    </Button>
                  )}

                <Button
                  leftIcon={<IconArrowBackUp />}
                  onClick={() => props.setSeeExerciseDetail(false)}
                >
                  Quay lại
                </Button>
              </Group>
            </>
          )}

          {exercise !== null && modifyExercise && (
            <CourseModifyExercise
              {...props}
              setModifyExercise={setModifyExercise}
              setExercise={setExercise}
              exercise={exercise}
              tags={tags}
              setListExercises={props.setListExercises}
            />
          )}
        </>
      )}
    </>
  );
};

export default CourseExerciseDetail;

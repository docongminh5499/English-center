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
    NumberInput,
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
  import { Url } from "../../../../helpers/constants";
  import { getAudioUrl, getImageUrl } from "../../../../helpers/image.helper";
  import { useAuth } from "../../../../stores/Auth";
  import dynamic from "next/dynamic";
  import { useForm } from "@mantine/form";
  import Exercise from "../../../../models/exercise.model";
  import Lecture from "../../../../models/lecture.model";
  import { DatePicker, TimeInput } from "@mantine/dates";
import CurriculumModifyExercise from "./curriculum.exercise.modify";
  
  const CurriculumExerciseDetail = (props: any) => {
    const [authState] = useAuth();
    const [loading, setLoading] = useState(true);
    const [exercise, setExercise] = useState<Exercise>(props.exercise);
    const [modifyExercise, setModifyExercise] = useState(false);
    const [tags, setTags] = useState([]);
    const [changeInfo, setChangeInfo] = useState(false);
    const listLecture = props.listLecture;
  
    const [loadingOverplay, setLoadingOverplay] = useState(false);
 
    console.log(exercise);
  
    useEffect(() => {
      // 👇️ scroll to top on page load
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [modifyExercise]);
  
    useEffect(() => {
      const didMountFunc = async () => {
        try {
          const exerciseResponse = await API.get(Url.teachers.getCurriculumExerciseById, {
            token: authState.token,
            exerciseId: props.exerciseId,
          });
          //Set state
          setExercise(exerciseResponse);
        } catch (error) {
          toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
        } finally {
          setLoading(false);
        }
      };
      didMountFunc();
    }, []);
  
    const basicInfo = useForm({
      initialValues: {
        nameExercise: exercise === null ? "" : exercise.name,
        maxTime: exercise === null ? "" : exercise.maxTime,
        lecture: exercise === null ? "" : exercise.lecture.id,
        startWeek: exercise === null ? "" : exercise.startWeek,
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
      setLoadingOverplay(true);
      console.log("===============================================");
      console.log(basicInfo.values);
      basicInfo.validate();
      if (!basicInfo.isValid()) return;
      try {
        const response = await API.post(Url.teachers.changeCurriculumExerciseInfo, {
          token: authState.token,
          exerciseId: exercise.id,
          basicInfo: basicInfo.values,
        });
        console.log("===============================================");
        console.log(response);
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
      <Box ml={"md"} mt={"md"} style={{width: "100%"}}>
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

              <Title order={4} mt="md">
                Tuần bắt đầu
              </Title>

              <NumberInput
                mt="md"
                placeholder="1"
                max={120}
                min={1}
                {...basicInfo.getInputProps("startWeek")}
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
                      Tuần bắt đầu: {exercise.startWeek}{" "}
                    </Text>
                  </Grid.Col>
                  {authState.isManager && 
                    <Grid.Col span={6}>
                      <Button onClick={() => setChangeInfo(true)}>
                        Thay đổi thông tin
                      </Button>
                    </Grid.Col>
                  }
                </Grid>
  
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
                  {authState.isManager && 
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
                  }
  
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
              <CurriculumModifyExercise
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
      </Box>
    );
  };
  
  export default CurriculumExerciseDetail;
  
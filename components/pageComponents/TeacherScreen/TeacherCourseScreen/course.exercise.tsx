import {
  Box,
  Checkbox,
  Container,
  Divider,
  Grid,
  Group,
  Loader,
  Modal,
  ScrollArea,
  Space,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import "dayjs/locale/vi";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import {
  CourseStatus,
  ExerciseStatus,
  TeacherConstants,
  TimeZoneOffset,
  Url,
} from "../../../../helpers/constants";
import { getCourseStatus } from "../../../../helpers/getCourseStatus";
import { getExerciseStatus } from "../../../../helpers/getExerciseStatus";
import { Course } from "../../../../models/course.model";
import Exercise from "../../../../models/exercise.model";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";
import DeleteExerciseModal from "../Modal/delete.modal";
import CourseCreateExercise from "./course.create.exercise";
import CourseExerciseDetail from "./course.exercise.detail";
import Curriculum from "../../../../models/cirriculum.model";
import Lecture from "../../../../models/lecture.model";
import { IconVocabulary } from "@tabler/icons";

interface IProps {
  exercises?: Exercise[];
  courseId?: number;
  courseSlug?: string;
  course: Course | null;
  curriculum: Curriculum | undefined;
}

const CourseExercise = (props: IProps) => {
  console.log(props.curriculum);
  const isLargeTablet = useMediaQuery("(max-width: 1024px)");
  const isTablet = useMediaQuery("(max-width: 768px)");
  const isMobile = useMediaQuery("(max-width: 480px)");

  const [authState] = useAuth();
  const [currentExercise, setCurrentExercise] = useState<Exercise>();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [listExercises, setListExercises] = useState(
    props.exercises === undefined ? [] : props.exercises
  );
  const [listCurriculumExercises, setListCurriculumExercises] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeMoreLoading, setSeeMoreLoading] = useState(false);
  const [addCurriculumExerciseLoader, setAddCurriculumExerciseLoader] = useState(false);
  const [isOpenAddExerciseModal, setIsOpenAddExerciseModal] = useState(false);
  const [groupedCurriculumExercise, setGroupedCurriculumExercise] = useState(
    new Map()
  );
  const [checkedCurruculumExercise, setCheckedCurruculumExercise] = useState(
    new Map<number, boolean>()
  );
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  //See detail
  const [seeExerciseDetail, setSeeExerciseDetail] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise>();
  const [reRender, setReRender] = useState(false);

  const getExercises = useCallback(
    async (limit: number, skip: number) => {
      return await API.post(Url.teachers.getExercises, {
        token: authState.token,
        limit: limit,
        skip: skip,
        courseSlug: props.courseSlug,
      });
    },
    [authState.token, props.courseSlug]
  );

  const onDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      const responses: any = await API.delete(
        Url.teachers.deleteExercise + currentExercise?.id,
        { token: authState.token }
      );
      if (responses.success) {
        const updatedListExercises = listExercises?.filter(
          (item) => item.id !== currentExercise?.id
        );
        setListExercises(updatedListExercises);
        setTotal(total - 1);
        setIsOpenDeleteModal(false);
        setIsDeleting(false);
        toast.success("Xóa bài tập thành công.");
      } else {
        setIsOpenDeleteModal(false);
        setIsDeleting(false);
        toast.error("Xóa bài tập thất bại. Vui lòng thử lại.");
      }
    } catch (error: any) {
      setIsOpenDeleteModal(false);
      setIsDeleting(false);
      if (error.status < 500) {
        if (error.data.message && typeof error.data.message === "string")
          toast.error(error.data.message);
        else if (error.data.message && Array.isArray(error.data.message)) {
          const messages: any[] = Array.from(error.data.message);
          if (messages.length > 0 && typeof messages[0] === "string")
            toast.error(messages[0]);
          else if (messages.length > 0 && Array.isArray(messages))
            toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại");
          else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
        } else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
      } else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
    }
  }, [authState.token, currentExercise, listExercises]);

  //TODO: Create new exercise
  const [createNewExercise, setCreateNewExercise] = useState(false);

  const seeMoreExercises = useCallback(async () => {
    try {
      setSeeMoreLoading(true);
      const responses = await getExercises(
        TeacherConstants.limitExercise,
        listExercises.length
      );
      setTotal(responses.total);
      setListExercises(listExercises.concat(responses.exercises));
      setSeeMoreLoading(false);
    } catch (error) {
      setSeeMoreLoading(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
    }
  }, [TeacherConstants.limitStudent, listExercises]);

  useEffect(() => {
    const didMountFunc = async () => {
      try {
        setLoading(true);
        const responses = await getExercises(TeacherConstants.limitExercise, 0);
        setTotal(responses.total);
        setListExercises(responses.exercises);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
      }
    };
    didMountFunc();
  }, []);

  //==============================================
  const listLecture =
    props.curriculum === undefined ? [] : props.curriculum.lectures;
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
  console.log(groupedExercise);

  //=========================Add Exercise==============================
  const updateGroupedCurriculumExercise = new Map();
  const updateCheckedCurriculumExercise = new Map<number, boolean>();

  const showAddExerciseModal = async () => {
    const response = await API.get(Url.teachers.getAllCurriculumExercise, {
      token: authState.token,
      curriculumId: props.curriculum?.id,
      courseId: props.course?.id,
    });
    setListCurriculumExercises(response);
    for (const lecture of listLecture) {
      updateGroupedCurriculumExercise.set(lecture.id, []);
    }

    for (const exercise of response) {
      const key = exercise.lecture.id;
      if (updateGroupedCurriculumExercise.has(key)) {
        updateGroupedCurriculumExercise.get(key)?.push(exercise);
      }
      updateCheckedCurriculumExercise.set(exercise.id, false);
    }
    setGroupedCurriculumExercise(updateGroupedCurriculumExercise);
    setCheckedCurruculumExercise(updateCheckedCurriculumExercise);
    // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    // console.log(updateCheckedCurriculumExercise);
    setIsCheckedAll(false);
    setIsOpenAddExerciseModal(true);
  };

  const addCheckCurriculumExercise = async () => {
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    console.log(checkedCurruculumExercise);
    setAddCurriculumExerciseLoader(true);
    setIsOpenAddExerciseModal(false);
    try {
      const addExercise: number[] = [];
      checkedCurruculumExercise.forEach((value, key) => {
        if(value){
          addExercise.push(key);
        }
      })
      const response = await API.post(Url.teachers.addCurriculumExerciseToCourse, {
        token: authState.token,
        courseId: props.course?.id,
        addExerciseId: addExercise,
      });
      setListExercises([...listExercises, ...response]);
      toast.success("Thêm bài tập thành công!");
    }catch (error){
      console.log(error);
      toast.error("Thêm bài tập thất bại, vui lòng thử lại sau!");
    }finally{
      setAddCurriculumExerciseLoader(false);
    }

  };

  return (
    <>
      <Modal
        opened={isOpenDeleteModal}
        onClose={() => setIsOpenDeleteModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <DeleteExerciseModal
          loading={isDeleting}
          title="Xóa bài tập"
          message={`Bạn có chắc muốn xóa bài tập ${
            currentExercise
              ? "'" + currentExercise.name.toLocaleUpperCase() + "'"
              : "này"
          } chứ?`}
          onDelete={onDelete}
        />
      </Modal>

      {/* <Modal
        opened={addCurriculumExerciseLoader}
        onClose={() => setAddCurriculumExerciseLoader(false)}
        centered
        withCloseButton={false}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Group>
          <Loader />
          <Text size={15}>Đang xử lý...</Text>
        </Group>
      </Modal> */}

      <Modal
        opened={isOpenAddExerciseModal}
        onClose={() => setIsOpenAddExerciseModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Box>
          <Text
            color="#444"
            transform="uppercase"
            align="center"
            weight={600}
            style={{ fontSize: "2.6rem" }}
            mb={"md"}
          >
            Danh sách bài tập
          </Text>

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

          {listCurriculumExercises.length === 0 && (
            <Container
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <Text
                color="dimmed"
                align="center"
                weight={600}
                style={{ fontSize: "1.5rem" }}
              >
                Chưa có bài tập
              </Text>
            </Container>
          )}

          {listCurriculumExercises.length !== 0 && (
            <Group position="right" ml={"md"}>
              <Checkbox
                ml={"md"}
                checked={isCheckedAll}
                onChange={(event) => {
                  setCheckedCurruculumExercise((current: Map<number, boolean>) => {
                    current.forEach((_, key) => {
                      current.set(key, event.currentTarget.checked);
                    })
                    return current;
                  });
                  setIsCheckedAll(event.currentTarget.checked);
                }}
                label={<Text size={15}>Chọn tất cả</Text>}
                labelPosition="left"
              />
            </Group>
          )}

          <ScrollArea style={{ height: "500px" }} mt={"md"} type="never">
            {listLecture.map((item, index) => {
              if (!groupedCurriculumExercise.has(item.id)) {
                return;
              }
              if (groupedCurriculumExercise.get(item.id)?.length === 0) {
                return;
              }

              return (
                <Box key={index} p={"sm"} mb={"xs"}>
                  <Title mt={"sm"} order={4}>
                    Bài Học {item.order}: {item.name}
                  </Title>
                  {groupedCurriculumExercise
                    .get(item.id)
                    ?.map((exercise: any, index: number) => {
                      return (
                        <React.Fragment key={index}>
                          <Container
                            size="xl"
                            p={isLargeTablet ? 0 : 10}
                            my={10}
                          >
                            <Grid>
                              <Grid.Col span={isLargeTablet ? 12 : 10}>
                                <Title order={4} weight={600} color="#444">
                                  {exercise.name.toUpperCase()}
                                </Title>
                                <Space h={8} />
                              </Grid.Col>
                              <Grid.Col span={"auto"}>
                                <Checkbox
                                  checked={checkedCurruculumExercise.get(
                                    exercise.id
                                  )}
                                  onChange={(event) => {
                                    setCheckedCurruculumExercise(
                                      (current: Map<number, boolean>) => {
                                        current.set(
                                          exercise.id,
                                          !current.get(exercise.id)
                                        );
                                        return current;
                                      }
                                    );
                                    setReRender(!reRender);
                                  }}
                                />
                                <Space h={8} />
                              </Grid.Col>
                            </Grid>
                          </Container>

                          {index !== listExercises.length - 1 && <Divider />}
                        </React.Fragment>
                      );
                    })}
                </Box>
              );
            })}
          </ScrollArea>
          <Group position="center" mt={"md"}>
            <Button onClick={addCheckCurriculumExercise}>Thêm bài tập</Button>
          </Group>
        </Box>
      </Modal>
      {createNewExercise === false && seeExerciseDetail === false && (
        <>
          <Text
            color="#444"
            transform="uppercase"
            align="center"
            weight={600}
            style={{ fontSize: "2.6rem" }}
            mb={"md"}
          >
            Danh sách bài tập
          </Text>

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

          {getCourseStatus(props.course) !== CourseStatus.Closed && (
            <Container
              my={10}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="light"
                onClick={() => setCreateNewExercise(true)}
              >
                Tạo bài tập mới
              </Button>
              <Button ml={"md"} variant="light" onClick={showAddExerciseModal}>
                Thêm bài tập
              </Button>
            </Container>
          )}
          {loading && (
            <Container
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
                height: "200px",
              }}
            >
              <Loading />
            </Container>
          )}
          {!loading && listExercises && listExercises.length === 0 && (
            <Container
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <Text
                color="dimmed"
                align="center"
                weight={600}
                style={{ fontSize: "1.8rem" }}
              >
                Chưa có bài tập
              </Text>
            </Container>
          )}
          {!loading &&
            listExercises &&
            listExercises.length > 0 &&
            listLecture.map((item, index) => {
              if (groupedExercise.get(item.id)?.length === 0) {
                return;
              }

              return (
                <Box key={index} p={"sm"} mb={"xs"}>
                  <Title mt={"sm"} order={3}>
                    Bài Học {item.order}: {item.name}
                  </Title>
                  {groupedExercise.get(item.id)?.map((exercise, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Container size="xl" p={isLargeTablet ? 0 : 10} my={10}>
                          <Grid>
                            <Grid.Col span={isLargeTablet ? 12 : 10}>
                              <Title order={4} weight={600} color="#444">
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
                                        !isLargeTablet || isMobile
                                          ? "span"
                                          : "p"
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
                                        !isLargeTablet || isMobile
                                          ? "span"
                                          : "p"
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
                                          !isLargeTablet || isMobile
                                            ? "span"
                                            : "p"
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
                                          !isLargeTablet || isMobile
                                            ? "span"
                                            : "p"
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
                                          !isLargeTablet || isMobile
                                            ? "span"
                                            : "p"
                                        }
                                      >
                                        {" "}
                                        Chưa mở
                                      </Text>
                                    </Text>
                                  )}
                                </Grid.Col>
                              </Grid>
                            </Grid.Col>

                            {getExerciseStatus(
                              exercise.openTime,
                              exercise.endTime
                            ) === ExerciseStatus.Opened ||
                            getCourseStatus(props.course) ===
                              CourseStatus.Closed ? (
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
                                  variant="light"
                                  onClick={() => {
                                    setSelectedExercise(exercise);
                                    setSeeExerciseDetail(true);
                                  }}
                                >
                                  Xem chi tiết
                                </Button>
                              </Grid.Col>
                            ) : (
                              <Grid.Col
                                span={isLargeTablet ? 12 : 2}
                                style={{
                                  display: "flex",
                                  flexDirection: isLargeTablet
                                    ? isMobile
                                      ? "column"
                                      : "row"
                                    : "column",
                                  alignItems: "flex-start",
                                  gap: "0.5rem",
                                }}
                              >
                                <Button
                                  compact={isLargeTablet ? false : true}
                                  fullWidth
                                  size="xs"
                                  variant="light"
                                  onClick={() => {
                                    setSelectedExercise(exercise);
                                    setSeeExerciseDetail(true);
                                  }}
                                >
                                  Xem chi tiết
                                </Button>
                                <Button
                                  variant="light"
                                  onClick={() => {
                                    setCurrentExercise(exercise);
                                    setIsOpenDeleteModal(true);
                                  }}
                                  compact={isLargeTablet ? false : true}
                                  color="red"
                                  fullWidth
                                  size="xs"
                                >
                                  Xóa bài tập
                                </Button>
                              </Grid.Col>
                            )}
                          </Grid>
                        </Container>

                        {index !== listExercises.length - 1 && <Divider />}
                      </React.Fragment>
                    );
                  })}
                </Box>
              );
            })}
          <Space h={20} />
          <Container
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            {seeMoreLoading && <Loader variant="dots" />}
            {!seeMoreLoading && listExercises.length < total && (
              <Button onClick={() => seeMoreExercises()}>Xem thêm</Button>
            )}
          </Container>
          <Space h={20} />
        </>
      )}
      {/* //TODO: Create Exercise */}

      {createNewExercise === true && (
        <>
          <CourseCreateExercise
            {...props}
            createExerState={setCreateNewExercise}
            setListExercises={setListExercises}
            listLecture={listLecture}
          />
        </>
      )}

      {seeExerciseDetail === true && (
        <>
          <CourseExerciseDetail
            {...props}
            setSeeExerciseDetail={setSeeExerciseDetail}
            exerciseId={selectedExercise?.id}
            exercise={selectedExercise}
            listLecture={listLecture}
            setListExercises={setListExercises}
          />
        </>
      )}
    </>
  );
};

export default CourseExercise;

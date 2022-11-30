import { Box, Checkbox, Divider, Loader, Container, FileButton, Grid, Group, Modal, MultiSelect, Space, Text, Textarea, TextInput, Title } from "@mantine/core";
import { DateRangePicker, DateRangePickerValue, TimeRangeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { CourseStatus, ExerciseStatus, TeacherConstants, TimeZoneOffset, Url } from "../../../../helpers/constants";
import { getCourseStatus } from "../../../../helpers/getCourseStatus";
import { getExerciseStatus } from "../../../../helpers/getExerciseStatus";
import { Course } from "../../../../models/course.model";
import Exercise from "../../../../models/exercise.model";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";
import DeleteExerciseModal from "../Modal/delete.modal";
import 'dayjs/locale/vi';
import { IconPlus } from "@tabler/icons";
import CourseCreateExercise from "./course.create.exercise";
import CourseExerciseDetail from "./course.exercise.detail";

interface IProps {
  exercises?: Exercise[];
  courseId?: number;
  courseSlug?: string;
  course: Course | null;
}

const CourseExercise = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const [authState] = useAuth();
  const [currentExercise, setCurrentExercise] = useState<Exercise>();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [listExercises, setListExercises] = useState(props.exercises === undefined ? [] : props.exercises);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeMoreLoading, setSeeMoreLoading] = useState(false);
  //See detail
  const [seeExerciseDetail, setSeeExerciseDetail] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise>();


  const getExercises = useCallback(async (limit: number, skip: number) => {
    return await API.post(Url.teachers.getExercises, {
      token: authState.token,
      limit: limit,
      skip: skip,
      courseSlug: props.courseSlug
    });
  }, [authState.token, props.courseSlug]);



  const onDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      const responses: any = await API.delete(
        Url.teachers.deleteExercise + currentExercise?.id, { token: authState.token });
      if (responses.success) {
        const updatedListExercises = listExercises?.filter(item => item.id !== currentExercise?.id);
        setListExercises(updatedListExercises);
        setTotal(total - 1);
        setIsOpenDeleteModal(false);
        setIsDeleting(false);
        toast.success("Xóa bài tập thành công.")
      } else {
        setIsOpenDeleteModal(false);
        setIsDeleting(false);
        toast.error("Xóa bài tập thất bại. Vui lòng thử lại.")
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
        } else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
      } else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [authState.token, currentExercise, listExercises]);

  //TODO: Create new exercise
  const [createNewExercise, setCreateNewExercise] = useState(false);


  const seeMoreExercises = useCallback(async () => {
    try {
      setSeeMoreLoading(true);
      const responses = await getExercises(TeacherConstants.limitExercise, listExercises.length);
      setTotal(responses.total);
      setListExercises(listExercises.concat(responses.exercises));
      setSeeMoreLoading(false);
    } catch (error) {
      setSeeMoreLoading(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
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
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
      }
    }
    didMountFunc();
  }, []);


  return (
    <>
      <Modal
        opened={isOpenDeleteModal}
        onClose={() => setIsOpenDeleteModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <DeleteExerciseModal
          loading={isDeleting}
          title="Xóa bài tập"
          message={`Bạn có chắc muốn xóa bài tập ${currentExercise ? "'" + currentExercise.name.toLocaleUpperCase() + "'" : "này"} chứ?`}
          onDelete={onDelete}
        />
      </Modal>
      {createNewExercise === false && seeExerciseDetail === false &&
        <>
          <Text color="#444" transform="uppercase" align="center" weight={600} style={{ fontSize: "2.6rem" }}>
            Danh sách bài tập
          </Text>
          {getCourseStatus(props.course) !== CourseStatus.Closed && (
            <Container my={10} style={{ display: "flex", justifyContent: "center" }}>
              <Button variant="light" onClick={() => setCreateNewExercise(true)}>Tạo bài tập mới</Button>
            </Container>
          )}
          {loading && (
            <Container style={{
              display: "flex",
              justifyContent: "center",
              alignItems: 'center',
              flexGrow: 1,
              height: "200px"
            }}>
              <Loading />
            </Container>
          )}
          {!loading && listExercises && listExercises.length === 0 && (
            <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
              <Text color="dimmed" align="center" weight={600} style={{ fontSize: "1.8rem" }}>
                Chưa có bài tập
              </Text>
            </Container>
          )}
          {!loading && listExercises && listExercises.length > 0 && (
            listExercises.map((item, index) => (
              <React.Fragment key={index}>
                <Container size="xl" p={isLargeTablet ? 0 : 10} my={10}>
                  <Grid>
                    <Grid.Col span={isLargeTablet ? 12 : 10}>
                      <Text weight={600} color="#444">{item.name.toUpperCase()}</Text>
                      <Space h={8} />
                      <Grid>
                        <Grid.Col span={isMobile ? 12 : 4}>
                          <Text color="#444">
                            Ngày diễn ra:
                            <Text component={!isLargeTablet || isMobile ? 'span' : 'p'}> {
                              item.openTime === null
                                ? "--:--   --/--/----"
                                : moment(item.openTime).utcOffset(TimeZoneOffset).format("HH:mm - DD/MM/YYYY")}
                            </Text>
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={isMobile ? 12 : 4}>
                          <Text color="#444">
                            Ngày kết thúc:
                            <Text component={!isLargeTablet || isMobile ? 'span' : 'p'}> {
                              item.endTime === null
                                ? "--:--   --/--/----"
                                : moment(item.endTime).utcOffset(TimeZoneOffset).format("HH:mm - DD/MM/YYYY")
                            }
                            </Text>
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={isMobile ? 12 : 4}>
                          {getExerciseStatus(item.openTime, item.endTime) === ExerciseStatus.Closed && (
                            <Text color="#444">Tình trạng:
                              <Text color="pink" component={!isLargeTablet || isMobile ? 'span' : 'p'}> Đã đóng</Text>
                            </Text>
                          )}
                          {getExerciseStatus(item.openTime, item.endTime) === ExerciseStatus.Opened && (
                            <Text color="#444">Tình trạng:
                              <Text color="green" component={!isLargeTablet || isMobile ? 'span' : 'p'}> Đang mở</Text>
                            </Text>
                          )}
                          {getExerciseStatus(item.openTime, item.endTime) === ExerciseStatus.NotOpen && (
                            <Text color="#444">Tình trạng:
                              <Text color="grape" component={!isLargeTablet || isMobile ? 'span' : 'p'}> Chưa mở</Text>
                            </Text>
                          )}
                        </Grid.Col>
                      </Grid>
                    </Grid.Col>

                    {getExerciseStatus(item.openTime, item.endTime) === ExerciseStatus.Opened ||
                      getCourseStatus(props.course) === CourseStatus.Closed ? (
                      <Grid.Col
                        span={isLargeTablet ? 12 : 2}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}>
                        <Button
                          compact={isLargeTablet ? false : true}
                          fullWidth
                          variant="light"
                          onClick={() => {
                            setSelectedExercise(item);
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
                          flexDirection: isLargeTablet ? (isMobile ? "column" : "row") : "column",
                          alignItems: "flex-start",
                          gap: "0.5rem"
                        }}>
                        <Button
                          compact={isLargeTablet ? false : true}
                          fullWidth
                          size="xs"
                          variant="light"
                          onClick={() => {
                            setSelectedExercise(item);
                            setSeeExerciseDetail(true);
                          }}>
                          Xem chi tiết
                        </Button>
                        <Button
                          variant="light"
                          onClick={() => {
                            setCurrentExercise(item)
                            setIsOpenDeleteModal(true);
                          }}
                          compact={isLargeTablet ? false : true}
                          color="red" fullWidth size="xs">
                          Xóa bài tập
                        </Button>
                      </Grid.Col>
                    )}
                  </Grid>
                </Container>

                {index !== listExercises.length - 1 && (
                  <Divider />
                )}
              </React.Fragment>
            ))
          )}
          <Space h={20} />
          <Container style={{
            display: "flex",
            justifyContent: "center",
            alignItems: 'center',
            flexGrow: 1,
          }}>
            {seeMoreLoading && <Loader variant="dots" />}
            {!seeMoreLoading && listExercises.length < total && <Button
              onClick={() => seeMoreExercises()}
            >Xem thêm</Button>}
          </Container>
          <Space h={20} />
        </>
      }
      {/* //TODO: Create Exercise */}

      {createNewExercise === true &&
        <>
          <CourseCreateExercise {...props} createExerState={setCreateNewExercise} setListExercises={setListExercises} />
        </>
      }

      {seeExerciseDetail === true &&
        <>
          <CourseExerciseDetail {...props} setSeeExerciseDetail={setSeeExerciseDetail} exerciseId={selectedExercise?.id} />
        </>
      }
    </>
  );
}

export default CourseExercise;
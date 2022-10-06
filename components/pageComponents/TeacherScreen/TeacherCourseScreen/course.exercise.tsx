import { Container, Grid, Modal, Space, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { ExerciseStatus, TimeZoneOffset, Url } from "../../../../helpers/constants";
import { getExerciseStatus } from "../../../../helpers/getExerciseStatus";
import Exercise from "../../../../models/exercise.model";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import DeleteExerciseModal from "../Modal/delete.modal";

interface IProps {
  exercises?: Exercise[];
}

const CourseExercise = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const [authState] = useAuth();
  const [currentExercise, setCurrentExercise] = useState<Exercise>();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [listExercises, setListExercises] = useState(props.exercises);


  const onDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      const responses: any = await API.delete(
        Url.teachers.deleteExercise + currentExercise?.id, { token: authState.token });
      if (responses.success) {
        const updatedListExercises = listExercises?.filter(item => item.id !== currentExercise?.id);
        setListExercises(updatedListExercises);
        setIsOpenDeleteModal(false);
        setIsDeleting(false);
        toast.success("Xóa bài tập thành công.")
      } else {
        setIsOpenDeleteModal(false);
        setIsDeleting(false);
        toast.error("Xóa bài tập thất bại. Vui lòng thử lại.")
      }
    } catch (error) {
      setIsOpenDeleteModal(false);
      setIsDeleting(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [authState.token, currentExercise, listExercises]);

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

      {listExercises && listExercises.length === 0 && (
        <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <Text color="dimmed" align="center" weight={600} style={{ fontSize: "1.8rem" }}>
            Chưa có bài tập
          </Text>
        </Container>
      )}

      {listExercises && listExercises.length > 0 && (
        listExercises.map((item, index) => (
          <Container key={index} size="xl" p={isLargeTablet ? 0 : 10} mb={20}>
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

              {getExerciseStatus(item.openTime, item.endTime) === ExerciseStatus.Opened ? (
                <Grid.Col span={isLargeTablet ? 12 : 2}>
                  <Button compact={isLargeTablet ? false : true} fullWidth>
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
                  <Button compact={isLargeTablet ? false : true} fullWidth size="xs">Xem chi tiết</Button>
                  <Button
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
        ))
      )}

      <Space h={80} />

      <Container style={{ display: "flex", justifyContent: "center" }}>
        <Button>Tạo bài tập mới</Button>
      </Container>
    </>
  );
}

export default CourseExercise;
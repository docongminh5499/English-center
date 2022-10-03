import { Container, Grid, Modal, Space, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useCallback, useState } from "react";
import Button from "../../../commons/Button";
import DeleteExerciseModal from "../Modal/delete.modal";

const CourseExercise = () => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const [currentExercise, setCurrentExercise] = useState();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const onDelete = useCallback(() => {
    setIsOpenDeleteModal(false);
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
          title="Xóa bài tập"
          message={`Bạn có chắc muốn xóa bài tập ${currentExercise ? "'<add here>'" : "này"} chứ?`}
          onDelete={onDelete}
        />
      </Modal>

      <Container size="xl" p={isLargeTablet ? 0 : 10}>
        <Grid>
          <Grid.Col span={isLargeTablet ? 12 : 10}>
            <Text weight={600} color="#444">Bài tập 1: SIMPLE PRESENT TENSE</Text>
            <Space h={8} />
            <Grid>
              <Grid.Col span={4}>
                <Text color="#444">Ngày diễn ra:  01/11/2021</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text color="#444">Ngày kết thúc:  01/11/2021</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text color="#444">Tình trạng: đã kết thúc</Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={isLargeTablet ? 12 : 2}>
            <Button compact={isLargeTablet ? false : true} fullWidth>
              Xem chi tiết
            </Button>
          </Grid.Col>
        </Grid>
      </Container>

      <Space h={40} />

      <Container size="xl" p={isLargeTablet ? 0 : 10}>
        <Grid>
          <Grid.Col span={isLargeTablet ? 12 : 10}>
            <Text weight={600} color="#444">Bài tập 2: SIMPLE PRESENT TENSE</Text>
            <Space h={8} />
            <Grid>
              <Grid.Col span={4}>
                <Text color="#444">Ngày diễn ra:  01/11/2021</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text color="#444">Ngày kết thúc:  01/11/2021</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text color="#444">Tình trạng: đã kết thúc</Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>
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
              onClick={() => setIsOpenDeleteModal(true)}
              compact={isLargeTablet ? false : true}
              color="red" fullWidth size="xs">
              Xóa bài tập
            </Button>
          </Grid.Col>
        </Grid>
      </Container>

      <Space h={100} />

      <Container style={{ display: "flex", justifyContent: "center" }}>
        <Button>Tạo bài tập mới</Button>
      </Container>
    </>
  );
}

export default CourseExercise;
import { Container, Grid, Modal, Space, Text } from "@mantine/core";
import { useCallback, useState } from "react";
import Button from "../../../commons/Button";
import DeleteSessionCourseModal from "../Modal/deleteSessionCourse.modal";

const CourseSession = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const onDelete = useCallback(() => {
    setIsOpenModal(false)
  }, []);

  return (
    <>
      <Modal
        opened={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <DeleteSessionCourseModal
          onDelete={onDelete}
        />
      </Modal>

      <Container size="lg">
        <Text weight={600} color="#444">Buổi học 1: Thì hiện tại đơn</Text>
        <Space h={8} />
        <Grid>
          <Grid.Col span={5}>
            <Text color="#444">Ngày diễn ra:  01/11/2021</Text>
            <Space h={8} />
            <Text color="#444">Ca học: 9:00 - 11:00</Text>
          </Grid.Col>
          <Grid.Col span={5}>
            <Text color="#444">Trợ giảng: Nguyễn Văn A</Text>
            <Space h={8} />
            <Text color="#444">Tình trạng: đã kết thúc</Text>
          </Grid.Col>
          <Grid.Col span={2}>
            <Button compact fullWidth>Xem chi tiết</Button>
          </Grid.Col>
        </Grid>
      </Container>

      <Space h={40} />

      <Container size="lg">
        <Text weight={600} color="#444">Buổi học 2: Thì hiện tại đơn</Text>
        <Space h={8} />
        <Grid>
          <Grid.Col span={5}>
            <Text color="#444">Ngày diễn ra:  01/11/2021</Text>
            <Space h={8} />
            <Text color="#444">Ca học: 9:00 - 11:00</Text>
          </Grid.Col>
          <Grid.Col span={5}>
            <Text color="#444">Trợ giảng: Nguyễn Văn A</Text>
            <Space h={8} />
            <Text color="#444">Tình trạng: đã kết thúc</Text>
          </Grid.Col>
          <Grid.Col
            span={2}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.5rem" }}>
            <Button compact fullWidth size="xs">Xem chi tiết</Button>
            <Button compact color="red" fullWidth size="xs" onClick={() => setIsOpenModal(true)}>Xóa buổi học</Button>
          </Grid.Col>
        </Grid>
      </Container>

      <Space h={40} />

      <Container size="lg">
        <Text weight={600} color="#444">Buổi học 2: Thì hiện tại đơn</Text>
        <Space h={8} />
        <Grid>
          <Grid.Col span={5}>
            <Text color="#444">Ngày diễn ra:  01/11/2021</Text>
            <Space h={8} />
            <Text color="#444">Ca học: 9:00 - 11:00</Text>
          </Grid.Col>
          <Grid.Col span={5}>
            <Text color="#444">Trợ giảng: Nguyễn Văn A</Text>
            <Space h={8} />
            <Text color="#444">Tình trạng: chưa bắt đầu</Text>
          </Grid.Col>
          <Grid.Col
            span={2}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.5rem" }}>
            <Button compact color="green" fullWidth size="xs">Bắt đầu</Button>
            <Button compact color="red" fullWidth size="xs">Xóa buổi học</Button>
          </Grid.Col>
        </Grid>
      </Container>

      <Space h={100} />

      <Container style={{ display: "flex", justifyContent: "center" }}>
        <Button>Tạo buổi học mới</Button>
      </Container>
    </>
  );
}

export default CourseSession;
import { Container, Grid, Modal, Space, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useCallback, useState } from "react";
import Button from "../../../commons/Button";
import CreateSessionCourseModal from "../Modal/createSessionCourse.modal";
import DeleteSessionCourseModal from "../Modal/delete.modal";

const CourseSession = () => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const [currentSession, setCurrentSession] = useState();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const onDelete = useCallback(() => {
    setIsOpenModal(false)
  }, []);


  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const onCreate = useCallback((data: any) => {
    console.log(data);
    setIsOpenCreateModal(false);
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
        title="Xóa buổi học"
        message={`Bạn có chắc muốn xóa buổi học ${currentSession ? "'<add here>'" : "này"} chứ?`}
          onDelete={onDelete}
        />
      </Modal>

      <Modal
        opened={isOpenCreateModal}
        onClose={() => setIsOpenCreateModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
          <CreateSessionCourseModal onCreate={onCreate} />
      </Modal>

      {/* <Container size="xl" p={isMobile ? "xs" : "md"}>
        <Text weight={600} color="#444">Buổi học 1: Thì hiện tại đơn</Text>
        <Space h={8} />
        <Grid>
          <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 5}>
            <Text color="#444">Ngày diễn ra:  01/11/2021</Text>
            <Space h={8} />
            <Text color="#444">Ca học: 9:00 - 11:00</Text>
          </Grid.Col>
          <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 5}>
            <Text color="#444">Trợ giảng: Nguyễn Văn A</Text>
            <Space h={8} />
            <Text color="#444">Tình trạng: đã kết thúc</Text>
          </Grid.Col>
          <Grid.Col span={isLargeTablet ? 12 : 2}>
            <Button compact={isLargeTablet ? false : true} fullWidth>Xem chi tiết</Button>
          </Grid.Col>
        </Grid>
      </Container>

      <Space h={40} />

      <Container size="xl" p={isMobile ? "xs" : "md"}>
        <Text weight={600} color="#444">Buổi học 2: Thì hiện tại đơn</Text>
        <Space h={8} />
        <Grid>
          <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 5}>
            <Text color="#444">Ngày diễn ra:  01/11/2021</Text>
            <Space h={8} />
            <Text color="#444">Ca học: 9:00 - 11:00</Text>
          </Grid.Col>
          <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 5}>
            <Text color="#444">Trợ giảng: Nguyễn Văn A</Text>
            <Space h={8} />
            <Text color="#444">Tình trạng: đã kết thúc</Text>
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
            <Button compact={isLargeTablet ? false : true} color="red" fullWidth size="xs" onClick={() => setIsOpenModal(true)}>Xóa buổi học</Button>
          </Grid.Col>
        </Grid>
      </Container>

      <Space h={40} />

      <Container size="xl" p={isMobile ? "xs" : "md"}>
        <Text weight={600} color="#444">Buổi học 2: Thì hiện tại đơn</Text>
        <Space h={8} />
        <Grid>
          <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 5}>
            <Text color="#444">Ngày diễn ra:  01/11/2021</Text>
            <Space h={8} />
            <Text color="#444">Ca học: 9:00 - 11:00</Text>
          </Grid.Col>
          <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 5}>
            <Text color="#444">Trợ giảng: Nguyễn Văn A</Text>
            <Space h={8} />
            <Text color="#444">Tình trạng: chưa bắt đầu</Text>
          </Grid.Col>
          <Grid.Col
            span={isLargeTablet ? 12 : 2}
            style={{
              display: "flex",
              flexDirection: isLargeTablet ? (isMobile ? "column" : "row") : "column",
              alignItems: "flex-start",
              gap: "0.5rem"
            }}>
            <Button compact={isLargeTablet ? false : true} color="green" fullWidth size="xs">Bắt đầu</Button>
            <Button compact={isLargeTablet ? false : true} color="red" fullWidth size="xs" onClick={() => setIsOpenModal(true)}>Xóa buổi học</Button>
          </Grid.Col>
        </Grid>
      </Container> */}

      <Space h={100} />

      <Container style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={() => setIsOpenCreateModal(true)}>Tạo buổi học mới</Button>
      </Container>

      <Space h={40} />
    </>
  );
}

export default CourseSession;
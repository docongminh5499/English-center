import { Avatar, Container, Grid, Group, Input, Modal, SimpleGrid, Space, Text } from "@mantine/core";
import { useInputState, useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import { useCallback, useState } from "react";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";
import StudentParticipateCourse from "../../../../models/studentParticipateCourse.model";
import { useAuth } from "../../../../stores/Auth";
import { useSocket } from "../../../../stores/Socket";
import Button from "../../../commons/Button";
import SendNotificationCourseModal from "../Modal/sendNotificationCourse";


interface IProps {
  courseId?: number;
  studentParticipations?: StudentParticipateCourse[];
}


const CourseStudent = (props: IProps) => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const [authState] = useAuth();
  const [, socketAction] = useSocket();
  const [query, setQuery] = useInputState("");
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [listStudentParticipations, setListStudentParticipations] = useState(props.studentParticipations);


  const queryStudentHandler = useCallback((query: string) => {
    const formattedQuery = query.trim().toLocaleLowerCase();
    if (formattedQuery === "")
      return setListStudentParticipations(props.studentParticipations);
    const queriesStudentParticipations = listStudentParticipations?.filter(item =>
      item.student.user.fullName.toLocaleLowerCase().indexOf(formattedQuery) > -1 ||
      item.student.user.id.toString().toLocaleLowerCase().indexOf(formattedQuery) > -1);
    setListStudentParticipations(queriesStudentParticipations);
  }, [listStudentParticipations]);


  const onSendNotification = useCallback((data: any) => {
    setIsNotificationModalOpen(false);
    socketAction.emit('course_notification', {
      token: authState.token,
      courseId: props.courseId,
      content: data.notification,
    });
  }, [props.courseId, authState.token]);


  return (
    <>
      <Modal
        opened={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <SendNotificationCourseModal
          onSend={onSendNotification}
        />
      </Modal>


      <Container size="xl" p={0}>
        <Text color="#444" transform="uppercase" align="center" weight={600} style={{ fontSize: "2.6rem" }}>
          Danh sách học viên
        </Text>
        <Text color="dimmed" align="center" weight={600} style={{ fontSize: "1.8rem" }}>
          Sĩ số: {props.studentParticipations?.length}
        </Text>

        <Container style={{ display: "flex", justifyContent: "center", alignItems: "center" }} mt={10}>
          <Button color="green" variant="light" onClick={() => setIsNotificationModalOpen(true)}>
            Gửi thông báo tới lớp học
          </Button>
        </Container>

        <Space h={20} />
        <Grid>
          {!isTablet && (<Grid.Col span={3}></Grid.Col>)}
          <Grid.Col span={isTablet ? (isMobile ? 12 : 8) : 4}>
            <Input
              styles={{ input: { color: "#444" } }}
              value={query}
              placeholder="Tìm kiếm theo tên hoặc MSHV"
              onChange={setQuery}
            />
          </Grid.Col>
          <Grid.Col span={isTablet ? (isMobile ? 12 : 4) : 2}>
            <Button fullWidth onClick={() => queryStudentHandler(query)}>Tìm kiếm</Button>
          </Grid.Col>
        </Grid>

        <Space h={20} />

        {listStudentParticipations?.length === 0 && (
          <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
            <Text color="dimmed" align="center" weight={600} style={{ fontSize: "1.8rem" }}>Không có học sinh</Text>
          </Container>

        )}

        {listStudentParticipations && listStudentParticipations?.length > 0 && (
          <SimpleGrid cols={2} p="md" spacing="xl">
            {listStudentParticipations?.map((item, index) => (
              <Group
                key={index}
                onClick={() => console.log("A")}
                style={{
                  cursor: "pointer",
                  flexDirection: isTablet ? "column" : "row"
                }}>
                <Avatar
                  size={60}
                  color="blue"
                  radius='xl'
                  src={getAvatarImageUrl(item.student.user.avatar)}
                />
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: isTablet ? "center" : "flex-start"
                }} >
                  <Text style={{ fontSize: "1.4rem" }} weight={500} color="#444" align="center">
                    {item.student.user.fullName}
                  </Text>
                  <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">MSHV: {item.student.user.id}</Text>
                  <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">
                    Ngày sinh: {moment(item.student.user.dateOfBirth).format("DD/MM/YYYY")}
                  </Text>
                </div>
              </Group>
            ))}
          </SimpleGrid>
        )}
        <Space h={20} />
      </Container>
    </>
  );
}

export default CourseStudent;
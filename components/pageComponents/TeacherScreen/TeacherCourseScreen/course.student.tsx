import { Avatar, Container, Grid, Group, Input, Loader, Modal, SimpleGrid, Space, Text } from "@mantine/core";
import { useInputState, useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { TeacherConstants, Url } from "../../../../helpers/constants";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";
import UserStudent from "../../../../models/userStudent.model";
import { useAuth } from "../../../../stores/Auth";
import { useSocket } from "../../../../stores/Socket";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";
import SendNotificationCourseModal from "../Modal/sendNotificationCourse";


interface IProps {
  courseSlug?: string;
  courseId?: number;
}


const CourseStudent = (props: IProps) => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const [authState] = useAuth();
  const [, socketAction] = useSocket();
  const [query, setQuery] = useInputState("");
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [listStudents, setListStudents] = useState<UserStudent[]>([]);
  const [total, setTotal] = useState(0);
  const [queriedTotal, setQueriedTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeMoreLoading, setSeeMoreLoading] = useState(false);


  const getStudents = useCallback(async (limit: number, skip: number, query: string) => {
    return await API.post(Url.teachers.getStudents, {
      token: authState.token,
      limit: limit,
      skip: skip,
      query: query,
      courseSlug: props.courseSlug
    });
  }, [authState.token, props.courseSlug]);


  const seeMoreStudents = useCallback(async () => {
    try {
      setSeeMoreLoading(true);
      const responses = await getStudents(TeacherConstants.limitStudent, listStudents.length, query);
      setQueriedTotal(responses.total);
      setListStudents(listStudents.concat(responses.students));
      setSeeMoreLoading(false);
    } catch (error) {
      setSeeMoreLoading(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [TeacherConstants.limitStudent, listStudents, query]);



  const queryStudents = useCallback(async () => {
    try {
      setLoading(true);
      const responses = await getStudents(TeacherConstants.limitStudent, 0, query);
      setQueriedTotal(responses.total);
      setListStudents(responses.students);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [TeacherConstants.limitStudent, query])



  const onSendNotification = useCallback((data: any) => {
    setIsNotificationModalOpen(false);
    socketAction.emit('course_notification', {
      token: authState.token,
      courseId: props.courseId,
      content: data.notification,
    });
  }, [props.courseId, authState.token]);


  useEffect(() => {
    const didMountFunc = async () => {
      try {
        setLoading(true);
        const responses = await getStudents(TeacherConstants.limitStudent, 0, query);
        setTotal(responses.total);
        setQueriedTotal(responses.total);
        setListStudents(responses.students);
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
          Sĩ số: {total}
        </Text>

        <Container style={{ display: "flex", justifyContent: "center", alignItems: "center" }} mt={10}>
          <Button
            color="green" variant="light"
            disabled={loading || seeMoreLoading}
            onClick={() => setIsNotificationModalOpen(true)}>
            Gửi thông báo tới lớp học
          </Button>
        </Container>

        <Space h={20} />
        <Grid>
          {!isTablet && (<Grid.Col span={3}></Grid.Col>)}
          <Grid.Col span={isTablet ? (isMobile ? 12 : 8) : 4}>
            <Input
              disabled={loading || seeMoreLoading}
              styles={{ input: { color: "#444" } }}
              value={query}
              placeholder="Tìm kiếm theo tên hoặc MSHV"
              onChange={setQuery}
            />
          </Grid.Col>
          <Grid.Col span={isTablet ? (isMobile ? 12 : 4) : 2}>
            <Button disabled={loading || seeMoreLoading} fullWidth onClick={() => queryStudents()}>
              Tìm kiếm
            </Button>
          </Grid.Col>
        </Grid>

        <Space h={20} />

        {loading && (
          <Container style={{
            display: "flex",
            justifyContent: "center",
            alignItems: 'center',
            flexGrow: 1,
            height: "150px"
          }}>
            <Loading />
          </Container>
        )}

        {!loading && listStudents.length === 0 && (
          <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
            <Text color="dimmed" align="center" weight={600} style={{ fontSize: "1.8rem" }}>Không có học sinh</Text>
          </Container>

        )}

        {!loading && listStudents.length > 0 && (
          <SimpleGrid cols={2} p="md" spacing="xl">
            {listStudents.map((item, index) => (
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
                  src={getAvatarImageUrl(item.user.avatar)}
                />
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: isTablet ? "center" : "flex-start"
                }} >
                  <Text style={{ fontSize: "1.4rem" }} weight={500} color="#444" align="center">
                    {item.user.fullName}
                  </Text>
                  <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">MSHV: {item.user.id}</Text>
                  <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">
                    Ngày sinh: {moment(item.user.dateOfBirth).format("DD/MM/YYYY")}
                  </Text>
                </div>
              </Group>
            ))}
          </SimpleGrid>
        )}
        <Space h={20} />
        <Container style={{
          display: "flex",
          justifyContent: "center",
          alignItems: 'center',
          flexGrow: 1,
        }}>
          {seeMoreLoading && <Loader variant="dots" />}
          {!seeMoreLoading && listStudents.length < queriedTotal && <Button
            onClick={() => seeMoreStudents()}
          >Xem thêm</Button>}
        </Container>
        <Space h={20} />
      </Container>
    </>
  );
}

export default CourseStudent;
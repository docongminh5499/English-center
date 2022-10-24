import { Container, Group, Title, Text, Image, Loader, Avatar, SimpleGrid, Space, Button, Table, ScrollArea, Badge } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import Head from "next/head"
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { CourseStatus, EmployeeConstants, TimeZoneOffset, Url, UserRole } from "../../../../helpers/constants";
import { getCourseStatus } from "../../../../helpers/getCourseStatus";
import { getAvatarImageUrl, getImageUrl } from "../../../../helpers/image.helper";
import { Course } from "../../../../models/course.model";
import StudySession from "../../../../models/studySession.model";
import { useAuth } from "../../../../stores/Auth";
import Loading from "../../../commons/Loading";


interface IProps {
  userRole?: UserRole | null;
  course: Course | null;
}


const EmployeeCourseDetailScreen = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');


  const [authState] = useAuth();
  const [listStudySessions, setListStudySessions] = useState<StudySession[]>([]);
  const [total, setTotal] = useState(0);
  const [seeMoreLoading, setSeeMoreLoading] = useState(true);
  const [didMount, setDidMount] = useState(false);
  const router = useRouter();


  const getStudySessions = useCallback(async (limit: number, skip: number) => {
    return await API.post(Url.employees.getStudySessions, {
      token: authState.token,
      limit: limit,
      skip: skip,
      courseSlug: props.course?.slug
    });
  }, [authState.token, props.course?.slug]);




  const seeMoreExercises = useCallback(async () => {
    try {
      setSeeMoreLoading(true);
      const responses = await getStudySessions(EmployeeConstants.limitStudySession, listStudySessions.length);
      setTotal(responses.total);
      setListStudySessions(listStudySessions.concat(responses.studySessions));
      setSeeMoreLoading(false);
    } catch (error) {
      setSeeMoreLoading(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [EmployeeConstants.limitStudySession, listStudySessions]);




  useEffect(() => {
    const didMountFunc = async () => {
      try {
        const responses = await getStudySessions(EmployeeConstants.limitStudySession, 0);
        setTotal(responses.total);
        setListStudySessions(responses.studySessions);
        setDidMount(true);
        setSeeMoreLoading(false);
      } catch (error) {
        setDidMount(true);
        setSeeMoreLoading(false);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
      }
    }
    if (props.course === null)
      router.replace('/not-found');
    else didMountFunc();
  }, []);


  return (
    <>
      <Head>
        <title>Chi tiết khóa học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!didMount && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Loading />
        </Container>
      )}

      {didMount && (
        <Container size="xl" style={{ width: "100%", minWidth: 0 }}>
          <Title align="center" size="2.6rem" color="#444" transform="uppercase" my={20}>
            Chi tiết khóa học
          </Title>

          <Container
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              width: "100%"
            }} size="xl">
            <SimpleGrid cols={isTablet ? 1 : 2}>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Tên khóa học</Text>
                <Text align="center">{props.course?.name}</Text>
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Chương trình dạy</Text>
                <Text align="center">{props.course?.curriculum.name}</Text>
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Ngày khai giảng</Text>
                <Text align="center">{moment(props.course?.openingDate).utcOffset(TimeZoneOffset).format('DD/MM/YYYY')}</Text>
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Ngày dự kiến kết thúc</Text>
                <Text align="center">{moment(props.course?.expectedClosingDate).utcOffset(TimeZoneOffset).format('DD/MM/YYYY')}</Text>
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Ngày kết thúc</Text>
                <Text align="center">
                  {props.course?.closingDate
                    ? moment(props.course?.closingDate).utcOffset(TimeZoneOffset).format('HH:mm DD-MM-YYYY')
                    : "--:-- --/--/----"}
                </Text>
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Trạng thái khoá học</Text>
                {getCourseStatus(props.course) === CourseStatus.NotOpen && (
                  <Text color="gray" align="center">
                    Sắp diễn ra
                  </Text>
                )}
                {getCourseStatus(props.course) === CourseStatus.Opened && (
                  <Text color="green" align="center">
                    Đang diễn ra
                  </Text>
                )}
                {getCourseStatus(props.course) === CourseStatus.Closed && (
                  <Text color="pink" align="center">
                    Đã kết thúc
                  </Text>
                )}
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Số lượng học viên tối đa</Text>
                <Text align="center">{props.course?.maxNumberOfStudent}</Text>
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Giá tiền</Text>
                <Text align="center">{props.course?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Text>
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Chi nhánh</Text>
                <Container size="xl"
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: isMobile ? "40px" : "60px"
                  }} p={0}>
                  <Text align="center">{props.course?.branch.name}</Text>
                  <Text align="center" color="dimmed" style={{ fontSize: "1.2rem" }}>{props.course?.branch.address}</Text>
                </Container>
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Giáo viên</Text>
                <Group style={{ width: "fit-content", margin: "auto", marginTop: 10 }} noWrap>
                  <Avatar
                    size={isMobile ? 40 : 60}
                    color="blue"
                    radius='xl'
                    src={getAvatarImageUrl(props.course?.teacher.worker.user.avatar)}
                  />
                  <Container style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }} p={0}>
                    <Text style={{ fontSize: "1.4rem" }} weight={500} color="#444" align="center">
                      {props.course?.teacher.worker.user.fullName}
                    </Text>
                    <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">MSGV: {props.course?.teacher.worker.user.id}</Text>
                  </Container>
                </Group>
              </Container>
            </SimpleGrid>

            <Container size="xl" style={{ width: "100%" }} p={0}>
              <Image
                withPlaceholder
                placeholder={
                  <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "300px" }}>
                    <Loader variant="dots" />
                  </Container>
                }
                style={{ maxWidth: "300px", margin: "auto" }}
                radius="md"
                src={getImageUrl(props.course?.image)}
                alt="Hình minh họa chương trình dạy"
              />
            </Container>
            <Container size="xl" style={{ width: "100%" }} p={0}>
              <Text weight={600} align="center" style={{ fontSize: "1.8rem" }} my={20}>Danh sách buổi học</Text>
              <ScrollArea style={{ width: "100%" }}>
                <Table verticalSpacing="xs" highlightOnHover style={{ width: "100%", minWidth: "900px" }}>
                  <thead>
                    <tr>
                      <th>Tên buổi học</th>
                      <th>Ngày diễn ra</th>
                      <th>Giờ học</th>
                      <th>Giáo viên</th>
                      <th>Trợ giảng</th>
                      <th>Phòng học</th>
                      {/* <th></th> */}
                      {/* Trạng thái đã hủy, buttons */}
                    </tr>
                  </thead>
                  <tbody>
                    {listStudySessions.map((studySession: StudySession, index: number) => (
                      <tr key={index}>
                        <td>{studySession.name}</td>
                        <td>{moment(studySession.date).format("DD/MM/YYYY")}</td>
                        <td>{moment(studySession.shifts[0].startTime).format("HH:mm")
                          + "-" + moment(studySession.shifts[studySession.shifts.length - 1].endTime).format("HH:mm")
                        }</td>
                        <td>
                          <Text>{studySession.teacher.worker.user.fullName}</Text>
                          <Text color="dimmed" style={{ fontSize: "1rem" }}>MSGV: {studySession.teacher.worker.user.id}</Text>
                        </td>
                        <td>
                          <Text>{studySession.tutor.worker.user.fullName}</Text>
                          <Text color="dimmed" style={{ fontSize: "1rem" }}>MSTG: {studySession.tutor.worker.user.id}</Text>
                        </td>
                        <td>
                          <Text>{studySession.classroom.name}</Text>
                          <Text color="dimmed" style={{ fontSize: "1rem" }}>{studySession.classroom.branch.name}</Text>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ScrollArea>
            </Container>
          </Container>
          <Space h={20} />
          <Container style={{
            display: "flex",
            justifyContent: "center",
            alignItems: 'center',
            flexGrow: 1,
          }}>
            {seeMoreLoading && <Loader variant="dots" />}
            {!seeMoreLoading && listStudySessions.length < total && <Button
              onClick={() => seeMoreExercises()}
            >Xem thêm</Button>}
          </Container>
          <Space h={20} />
        </Container >
      )}
    </>
  )
}


export default EmployeeCourseDetailScreen;
import { Container, Group, Title, Text, Image, Loader, Avatar, SimpleGrid, Space, Button, Table, ScrollArea, Badge, Modal, ThemeIcon, Pagination, Grid, Input } from "@mantine/core";
import { useInputState, useMediaQuery } from "@mantine/hooks";
import { IconPencil, IconSquarePlus, IconTrash } from "@tabler/icons";
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
import OpenCourseModal from "../Modal/openCourse.modal";
import ModifyStudySessionModal from "../Modal/modifyStudySession.modal";
import CloseCourseModal from "../Modal/closeCourse.modal";
import CreateStudySessionModal from "../Modal/createStudySession.modal";
import RemoveStudySessionModal from "../Modal/modal";
import styles from "./course.module.css";
import UserStudent from "../../../../models/userStudent.model";
import { getGenderName } from "../../../../helpers/getGenderName";


interface IProps {
  userRole?: UserRole | null;
  course: Course | null;
}


const EmployeeCourseDetailScreen = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');


  const [authState] = useAuth();
  const [didMount, setDidMount] = useState(false);
  // Study session state
  const [listStudySessions, setListStudySessions] = useState<StudySession[]>([]);
  const [totalStudySession, setTotalStudySession] = useState(0);
  const [loadingStudySession, setLoadingStudySession] = useState(true);
  const [errorStudySession, setErrorStudySession] = useState(false);
  const [currentPageStudySesion, setCurrentPageStudySession] = useState(1);
  const [maxPageStudySession, setMaxPageStudySession] = useState(1);
  const [queryStudySession, setQueryStudySession] = useInputState("");
  // Student state
  const [listStudents, setListStudents] = useState<UserStudent[]>([]);
  const [totalStudent, setTotalStudent] = useState(0);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [errorStudent, setErrorStudent] = useState(false);
  const [currentPageStudent, setCurrentPageStudent] = useState(1);
  const [maxPageStudent, setMaxPageStudent] = useState(1);
  const [queryStudent, setQueryStudent] = useInputState("");
  // Course state
  const [course, setCourse] = useState(props.course);
  const [isOpenCourseModalOpened, setIsOpenCourseModalOpened] = useState(false);
  const [isCloseCourseModalOpened, setIsCloseCourseModalOpened] = useState(false);
  const [isSendingOpenRequest, setIsSendingOpenRequest] = useState(false);
  const [isSendingCloseRequest, setIsSendingCloseRequest] = useState(false);
  // Modify, create, remove study session
  const [isOpenModifyStudySessionModal, setIsOpenModifyStudySessionModal] = useState(false);
  const [isOpenCreateStudySessionModal, setIsOpenCreateStudySessionModal] = useState(false);
  const [currentStudySession, setCurrentStudySession] = useState<StudySession>();
  const [isOnSendModidySession, setIsOnSendModifySession] = useState(false);
  const [isOnSendCreateSession, setIsOnSendCreateSession] = useState(false);
  const [isOpenRemoveSessionModal, setIsOpenRemoveSessionModal] = useState(false);
  const [isOnSendRemoveSession, setIsOnSendRemoveSession] = useState(false);
  const router = useRouter();


  const getStudySessions = useCallback(async (limit: number, skip: number, query: string) => {
    return await API.post(Url.employees.getStudySessions, {
      token: authState.token,
      limit: limit,
      skip: skip,
      courseSlug: course?.slug,
      query: query
    });
  }, [authState.token, course?.slug]);


  const getStudents = useCallback(async (limit: number, skip: number, query: string) => {
    return await API.post(Url.employees.getStudents, {
      token: authState.token,
      limit: limit,
      skip: skip,
      query: query,
      courseSlug: course?.slug
    });
  }, [authState.token, course?.slug]);



  const queryStudySessions = useCallback(async () => {
    try {
      setLoadingStudySession(true);
      setErrorStudySession(false);
      const responses = await getStudySessions(EmployeeConstants.limitStudySession, 0, queryStudySession);
      setCurrentPageStudySession(1);
      setTotalStudySession(responses.total);
      setMaxPageStudySession(Math.ceil(responses.total / EmployeeConstants.limitStudySession));
      setListStudySessions(responses.studySessions);
      setLoadingStudySession(false);
      setErrorStudySession(false);
    } catch (error) {
      setLoadingStudySession(false);
      setErrorStudySession(true);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [queryStudySession]);




  const queryStudents = useCallback(async () => {
    try {
      setLoadingStudent(true);
      setErrorStudent(false);
      const responses = await getStudents(EmployeeConstants.limitStudent, 0, queryStudent);
      setCurrentPageStudent(1);
      setTotalStudent(responses.total);
      setMaxPageStudent(Math.ceil(responses.total / EmployeeConstants.limitStudent));
      setListStudents(responses.students);
      setLoadingStudent(false);
      setErrorStudent(false);
    } catch (error) {
      setLoadingStudent(false);
      setErrorStudent(true);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [queryStudent]);



  const onClickPaginationPageStudySession = useCallback(async (page: number) => {
    try {
      if (page < 1) return;
      setLoadingStudySession(true);
      setErrorStudySession(false);
      const responses = await getStudySessions(
        EmployeeConstants.limitStudySession,
        (page - 1) * EmployeeConstants.limitStudySession,
        queryStudySession
      );
      setTotalStudySession(responses.total);
      setMaxPageStudySession(Math.ceil(responses.total / EmployeeConstants.limitStudySession));
      setListStudySessions(responses.studySessions);
      setLoadingStudySession(false);
      setCurrentPageStudySession(page);
    } catch (err) {
      setLoadingStudySession(false);
      setCurrentPageStudySession(page);
      setErrorStudySession(true);
    }
  }, [queryStudySession]);



  const onClickPaginationPageStudent = useCallback(async (page: number) => {
    try {
      if (page < 1) return;
      setLoadingStudent(true);
      setErrorStudent(false);
      const responses = await getStudents(
        EmployeeConstants.limitStudent,
        (page - 1) * EmployeeConstants.limitStudent,
        queryStudent
      );
      setTotalStudent(responses.total);
      setMaxPageStudent(Math.ceil(responses.total / EmployeeConstants.limitStudent));
      setListStudents(responses.students);
      setLoadingStudent(false);
      setCurrentPageStudent(page);
    } catch (err) {
      setLoadingStudent(false);
      setCurrentPageStudent(page);
      setErrorStudent(true);
    }
  }, [queryStudent]);



  const onOpenCourse = useCallback(async () => {
    try {
      setIsSendingOpenRequest(true);
      const responses = await API.post(Url.employees.reopenCourse, {
        token: authState.token,
        courseSlug: course?.slug
      });
      if (responses !== null) {
        toast.success("Mở khóa học thành công");
        setCourse(responses);
      } else toast.error("Mở khóa học thất bại. Vui lòng thử lại sau.");
      setIsSendingOpenRequest(false);
      setIsOpenCourseModalOpened(false);
    } catch (error) {
      setIsSendingOpenRequest(false);
      setIsOpenCourseModalOpened(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
    }
  }, [authState.token, course?.slug]);


  const onCloseCourse = useCallback(async () => {
    try {
      setIsSendingCloseRequest(true);
      const responses = await API.post(Url.employees.closeCourse, {
        token: authState.token,
        courseSlug: course?.slug
      });
      if (responses !== null) {
        toast.success("Đóng khóa học thành công");
        setCourse(responses);
      } else toast.error("Đóng khóa học thất bại. Vui lòng thử lại sau.");
      setIsSendingCloseRequest(false);
      setIsCloseCourseModalOpened(false);
    } catch (error) {
      setIsSendingCloseRequest(false);
      setIsCloseCourseModalOpened(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
    }
  }, [authState.token, course?.slug]);



  const onSendModifyStudySession = useCallback(async (data: any) => {
    try {
      setIsOnSendModifySession(true);
      const responses = await API.post(Url.employees.updateStudySession, {
        token: authState.token,
        id: currentStudySession?.id,
        name: data.name,
        date: data.date,
        shiftIds: data.shiftIds,
        tutorId: data.tutorId,
        teacherId: data.teacherId,
        classroom: data.classroom,
        version: currentStudySession?.version,
      });
      if (responses !== null) {
        onClickPaginationPageStudySession(currentPageStudySesion);
        setCourse(responses.course);
        toast.success("Cập nhật buổi học thành công");
      } else toast.error("Cập nhật buổi học thất bại. Vui lòng thử lại sau.");
      setIsOnSendModifySession(false);
      setIsOpenModifyStudySessionModal(false);
    } catch (error) {
      setIsOnSendModifySession(false);
      setIsOpenModifyStudySessionModal(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
    }
  }, [authState.token, currentStudySession?.id, currentStudySession?.version, currentPageStudySesion]);



  const onSendCreateStudySession = useCallback(async (data: any) => {
    try {
      setIsOnSendCreateSession(true);
      const responses = await API.post(Url.employees.addStudySession, {
        token: authState.token,
        name: data.name,
        date: data.date,
        shiftIds: data.shiftIds,
        tutorId: data.tutorId,
        teacherId: data.teacherId,
        classroom: data.classroom,
        courseSlug: props.course?.slug
      });
      if (responses !== null) {
        onClickPaginationPageStudySession(currentPageStudySesion);
        setCourse(responses.course);
        toast.success("Thêm buổi học thành công");
      } else toast.error("Thêm buổi học thất bại. Vui lòng thử lại sau.");
      setIsOnSendCreateSession(false);
      setIsOpenCreateStudySessionModal(false);
    } catch (error) {
      setIsOnSendCreateSession(false);
      setIsOpenCreateStudySessionModal(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
    }
  }, [authState.token, listStudySessions, props.course, currentPageStudySesion]);



  const onSendRemoveSession = useCallback(async () => {
    try {
      setIsOnSendRemoveSession(true);
      const responses: any = await API.post(Url.employees.removeStudySession, {
        token: authState.token,
        studySessionId: currentStudySession?.id,
      });
      if (responses == true) {
        const currentLimit = (currentPageStudySesion - 1) * EmployeeConstants.limitStudySession;
        const updatedTotal = totalStudySession - 1;
        const updatedPage = currentLimit < updatedTotal ? currentPageStudySesion : currentPageStudySesion - 1
        if (updatedPage < 1) {
          setTotalStudySession(1);
          setMaxPageStudySession(1);
          setListStudySessions([]);
        } else onClickPaginationPageStudySession(updatedPage);
        toast.success("Xóa buổi học thành công");
      } else toast.error("Xóa buổi học thất bại. Vui lòng thử lại sau.");
      setIsOnSendRemoveSession(false);
      setIsOpenRemoveSessionModal(false);
    } catch (error) {
      setIsOnSendRemoveSession(false);
      setIsOpenRemoveSessionModal(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
    }
  }, [authState.token, currentStudySession, currentPageStudySesion, totalStudySession]);



  useEffect(() => {
    const didMountFunc = async () => {
      try {
        const [responseStudySessions, responseStudents] = await Promise.all([
          getStudySessions(EmployeeConstants.limitStudySession, 0, queryStudySession),
          getStudents(EmployeeConstants.limitStudent, 0, queryStudent),
        ]);
        setTotalStudySession(responseStudySessions.total);
        setMaxPageStudySession(Math.ceil(responseStudySessions.total / EmployeeConstants.limitStudySession));
        setListStudySessions(responseStudySessions.studySessions);
        setLoadingStudySession(false);
        setErrorStudySession(false);
        setTotalStudent(responseStudents.total);
        setMaxPageStudent(Math.ceil(responseStudents.total / EmployeeConstants.limitStudent));
        setListStudents(responseStudents.students);
        setLoadingStudent(false);
        setErrorStudent(false);
        setDidMount(true);
      } catch (error) {
        setLoadingStudySession(false);
        setErrorStudySession(true);
        setLoadingStudent(false);
        setErrorStudent(true);
        setDidMount(true);
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

      <Modal
        opened={isOpenRemoveSessionModal}
        onClose={() => setIsOpenRemoveSessionModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <RemoveStudySessionModal
          loading={isOnSendRemoveSession}
          title="Xóa buổi học"
          message={`Bạn có chắc muốn xóa buổi học "${currentStudySession?.name}"?`}
          buttonLabel="Xác nhận xóa"
          colorButton="red"
          callBack={onSendRemoveSession}
        />
      </Modal>

      <Modal
        opened={isOpenCourseModalOpened}
        onClose={() => setIsOpenCourseModalOpened(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <OpenCourseModal
          loading={isSendingOpenRequest}
          callBack={onOpenCourse}
        />
      </Modal>

      <Modal
        opened={isCloseCourseModalOpened}
        onClose={() => setIsCloseCourseModalOpened(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <CloseCourseModal
          loading={isSendingCloseRequest}
          callBack={onCloseCourse}
        />
      </Modal>


      <Modal
        opened={isOpenModifyStudySessionModal}
        onClose={() => setIsOpenModifyStudySessionModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <ModifyStudySessionModal
          onSendRequest={onSendModifyStudySession}
          loading={isOnSendModidySession}
          studySession={currentStudySession}
          shiftsPerSession={props.course?.curriculum.shiftsPerSession}
          curriculum={props.course?.curriculum}
          maximumStudentNumber={props.course?.maxNumberOfStudent}
          branchId={props.course?.branch.id}
        />
      </Modal>


      <Modal
        opened={isOpenCreateStudySessionModal}
        onClose={() => setIsOpenCreateStudySessionModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <CreateStudySessionModal
          onSendRequest={onSendCreateStudySession}
          loading={isOnSendCreateSession}
          shiftsPerSession={props.course?.curriculum.shiftsPerSession}
          curriculum={props.course?.curriculum}
          courseSlug={props.course?.slug}
          branchId={props.course?.branch.id}
          openingDate={props.course?.openingDate}
          maximumStudentNumber={props.course?.maxNumberOfStudent}
        />
      </Modal>

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

          {getCourseStatus(course) === CourseStatus.Closed && (
            <Container style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%"
            }} p={0} mb={30}>
              <Button color="green" onClick={() => setIsOpenCourseModalOpened(true)}>
                Mở khóa học
              </Button>
            </Container>
          )}

          {getCourseStatus(course) !== CourseStatus.Closed &&
            moment().diff(moment(course?.expectedClosingDate).utcOffset(TimeZoneOffset)) >= 0 && (
              <Container style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%"
              }} p={0} mb={30}>
                <Button color="red" onClick={() => setIsCloseCourseModalOpened(true)}>
                  Kết thúc khóa học
                </Button>
              </Container>
            )}

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
                <Text align="center">{course?.name}</Text>
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Chương trình dạy</Text>
                <Text align="center">{course?.curriculum.name}</Text>
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Ngày khai giảng</Text>
                <Text align="center">{moment(course?.openingDate).utcOffset(TimeZoneOffset).format('DD/MM/YYYY')}</Text>
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Ngày dự kiến kết thúc</Text>
                <Text align="center">{moment(course?.expectedClosingDate).utcOffset(TimeZoneOffset).format('DD/MM/YYYY')}</Text>
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Ngày kết thúc</Text>
                <Text align="center">
                  {course?.closingDate
                    ? moment(course?.closingDate).utcOffset(TimeZoneOffset).format('HH:mm DD-MM-YYYY')
                    : "--:-- --/--/----"}
                </Text>
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Trạng thái khoá học</Text>
                {getCourseStatus(course) === CourseStatus.NotOpen && (
                  <Text color="gray" align="center">
                    Sắp diễn ra
                  </Text>
                )}
                {getCourseStatus(course) === CourseStatus.Opened && (
                  <Text color="green" align="center">
                    Đang diễn ra
                  </Text>
                )}
                {getCourseStatus(course) === CourseStatus.Closed && (
                  <Text color="pink" align="center">
                    Đã kết thúc
                  </Text>
                )}
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Số lượng học viên tối đa</Text>
                <Text align="center">{course?.maxNumberOfStudent}</Text>
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Giá tiền</Text>
                <Text align="center">{course?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Text>
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
                  <Text align="center">{course?.branch.name}</Text>
                  <Text align="center" color="dimmed" style={{ fontSize: "1.2rem" }}>{course?.branch.address}</Text>
                </Container>
              </Container>
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center">Giáo viên</Text>
                <Group style={{ width: "fit-content", margin: "auto", marginTop: 10 }} noWrap>
                  <Avatar
                    size={isMobile ? 40 : 60}
                    color="blue"
                    radius='xl'
                    src={getAvatarImageUrl(course?.teacher.worker.user.avatar)}
                  />
                  <Container style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }} p={0}>
                    <Text style={{ fontSize: "1.4rem" }} weight={500} color="#444" align="center">
                      {course?.teacher.worker.user.fullName}
                    </Text>
                    <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">MSGV: {course?.teacher.worker.user.id}</Text>
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
                src={getImageUrl(course?.image)}
                alt="Hình minh họa chương trình dạy"
              />
            </Container>
          </Container>
          <Container size="xl" style={{ width: "100%" }} p={0}>
            <Text weight={600} align="center" style={{ fontSize: "2rem" }} mt={20} mb={10} transform="uppercase">
              Danh sách học viên
            </Text>
            <Grid mb={20}>
              {!isTablet && (<Grid.Col span={3}></Grid.Col>)}
              <Grid.Col span={isTablet ? (isMobile ? 12 : 8) : 4}>
                <Input
                  styles={{ input: { color: "#444" } }}
                  value={queryStudent}
                  placeholder="Tìm kiếm theo tên hoặc MSHV"
                  onChange={setQueryStudent}
                />
              </Grid.Col>
              <Grid.Col span={isTablet ? (isMobile ? 12 : 4) : 2}>
                <Button fullWidth onClick={() => queryStudents()} disabled={loadingStudent}>
                  Tìm kiếm
                </Button>
              </Grid.Col>
            </Grid>
            {loadingStudent && (
              <Container style={{
                display: "flex",
                flexDirection: "column",
                height: "400px",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <Loading />
              </Container>
            )}
            {!loadingStudent && errorStudent && (
              <div className={styles.errorContainer}>
                <p>Có lỗi xảy ra, vui lòng thử lại</p>
                <Button
                  color="primary"
                  onClick={() => onClickPaginationPageStudent(currentPageStudent)}>
                  Thử lại
                </Button>
              </div>
            )}
            {!loadingStudent &&
              !errorStudent &&
              listStudents.length == 0 && (
                <div className={styles.emptyResultContainer}>
                  <p>Không có kết quả</p>
                </div>
              )}
            {!loadingStudent &&
              !errorStudent &&
              listStudents.length > 0 && (
                <>
                  <ScrollArea style={{ width: "100%" }}>
                    <Table verticalSpacing="xs" highlightOnHover style={{ width: "100%", minWidth: "900px" }}>
                      <thead>
                        <tr>
                          <th>MSHV</th>
                          <th>Tên học viên</th>
                          <th>Giới tính</th>
                          <th>Ngày sinh</th>
                          <th>Email</th>
                          <th>Số điện thoại</th>
                          <th>
                            <ThemeIcon size="lg" color="green" style={{ cursor: "pointer" }}
                              onClick={() => { }}>
                              <IconSquarePlus size={20} />
                            </ThemeIcon>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {listStudents.map((student: UserStudent, index: number) => (
                          <tr key={index}>
                            <td>{student.user.id}</td>
                            <td>{student.user.fullName}</td>
                            <td>{getGenderName(student.user.sex)}</td>
                            <td>{moment(student.user.dateOfBirth).format("DD/MM/YYYY")}</td>
                            <td>{student.user.email || "Không có thông tin"}</td>
                            <td>{student.user.phone || "Không có thông tin"}</td>
                            <td>
                              <ThemeIcon size="lg" color="red" style={{ cursor: "pointer" }}
                                onClick={() => {

                                }}>
                                <IconTrash size={20} />
                              </ThemeIcon>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </ScrollArea>
                  <Space h={20} />
                  {currentPageStudent > 0 && maxPageStudent > 0 && (
                    <Container style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }} p={0}>
                      <Pagination
                        className={styles.pagination}
                        page={currentPageStudent}
                        total={maxPageStudent}
                        onChange={(choosedPage: number) => onClickPaginationPageStudent(choosedPage)}
                      />
                    </Container>
                  )}
                </>
              )}
          </Container>
          <Space h={40} />
          <Container size="xl" style={{ width: "100%" }} p={0}>
            <Text weight={600} align="center" style={{ fontSize: "2rem" }} mt={20} mb={10} transform="uppercase">
              Danh sách buổi học
            </Text>
            <Grid mb={20}>
              {!isTablet && (<Grid.Col span={3}></Grid.Col>)}
              <Grid.Col span={isTablet ? (isMobile ? 12 : 8) : 4}>
                <Input
                  styles={{ input: { color: "#444" } }}
                  value={queryStudySession}
                  placeholder="Tìm kiếm theo tên"
                  onChange={setQueryStudySession}
                />
              </Grid.Col>
              <Grid.Col span={isTablet ? (isMobile ? 12 : 4) : 2}>
                <Button fullWidth onClick={() => queryStudySessions()} disabled={loadingStudySession}>
                  Tìm kiếm
                </Button>
              </Grid.Col>
            </Grid>
            {loadingStudySession && (
              <Container style={{
                display: "flex",
                flexDirection: "column",
                height: "400px",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <Loading />
              </Container>
            )}
            {!loadingStudySession && errorStudySession && (
              <div className={styles.errorContainer}>
                <p>Có lỗi xảy ra, vui lòng thử lại</p>
                <Button
                  color="primary"
                  onClick={() => onClickPaginationPageStudySession(currentPageStudySesion)}>
                  Thử lại
                </Button>
              </div>
            )}
            {!loadingStudySession &&
              !errorStudySession &&
              listStudySessions.length == 0 && (
                <div className={styles.emptyResultContainer}>
                  <p>Không có kết quả</p>
                </div>
              )}
            {!loadingStudySession &&
              !errorStudySession &&
              listStudySessions.length > 0 && (
                <>
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
                          {getCourseStatus(course) !== CourseStatus.Closed && (
                            <th>
                              <ThemeIcon size="lg" color="green" style={{ cursor: "pointer" }}
                                onClick={() => setIsOpenCreateStudySessionModal(true)}>
                                <IconSquarePlus size={20} />
                              </ThemeIcon>
                            </th>
                          )}
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
                              <Text>{studySession.classroom?.name || "Không có thông tin"}</Text>
                              {studySession.classroom && (
                                <Text color="dimmed" style={{ fontSize: "1rem" }}>{studySession.classroom.branch.name}</Text>
                              )}
                            </td>
                            {getCourseStatus(course) !== CourseStatus.Closed && (
                              <td>
                                <ThemeIcon size="lg" style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setCurrentStudySession(studySession);
                                    setIsOpenModifyStudySessionModal(true);
                                  }}>
                                  <IconPencil size={20} />
                                </ThemeIcon>
                                <ThemeIcon size="lg" color="red" style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setCurrentStudySession(studySession);
                                    setIsOpenRemoveSessionModal(true);
                                  }} ml={10}>
                                  <IconTrash size={20} />
                                </ThemeIcon>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </ScrollArea>
                  <Space h={20} />
                  {currentPageStudySesion > 0 && maxPageStudySession > 0 && (
                    <Container style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }} p={0}>
                      <Pagination
                        className={styles.pagination}
                        page={currentPageStudySesion}
                        total={maxPageStudySession}
                        onChange={(choosedPage: number) => onClickPaginationPageStudySession(choosedPage)}
                      />
                    </Container>
                  )}
                </>
              )}
          </Container>
          <Space h={20} />
        </Container >
      )}
    </>
  )
}


export default EmployeeCourseDetailScreen;
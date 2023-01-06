import { Accordion, Avatar, Container, Group, Loader, Modal, ScrollArea, SimpleGrid, Tabs, Text, Title } from "@mantine/core";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { IconBook, IconBooks, IconChartBar, IconCheck, IconClockHour4, IconCurrentLocation, IconUsers } from "@tabler/icons";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../helpers/api";
import { CourseType, GuestConstants, Url, UserRole } from "../../../helpers/constants";
import { formatCurrency } from "../../../helpers/formatCurrency";
import { getLevelName } from "../../../helpers/getLevelName";
import { getWeekdayFromDate } from "../../../helpers/getWeekdayFromDate";
import { getWeekdayName } from "../../../helpers/getWeekdayName";
import { getAvatarImageUrl, getImageUrl } from "../../../helpers/image.helper";
import { Course } from "../../../models/course.model";
import UserParent from "../../../models/userParent.model";
import UserStudent from "../../../models/userStudent.model";
import { useAuth } from "../../../stores/Auth";
import Button from "../../commons/Button";
import Loading from "../../commons/Loading";
import styles from "./DetailsCourse.module.css";



const diffDays = (date1: Date, date2: Date) => {
  const diffTime: number = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}



interface IProps {
  course: Course | null;
  isAttended: boolean;
  countStudent: number;
}


const index = (props: IProps) => {
  const [authState, authAction] = useAuth();
  const router = useRouter();
  const [didMount, setDidMount] = useState(false);

  // Attnd course
  const [countStudent, setCountStudent] = useState(props.countStudent);
  const [isAttended, setIsAttended] = useState(props.isAttended);
  const [isSendingCheckAttendCourseRequest, setIsSendingCheckAttendCourseRequest] = useState(false);
  const [isSendingAttendCourseRequest, setIsSendingAttendCourseRequest] = useState(false);
  const [isOpenConfirmAttendCourseModal, setIsOpenConfirmAttendCourseModal] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<object | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  // List students
  const [students, setStudents] = useState<{ student: UserStudent, isAttended: boolean }[]>([]);
  const [isSendingFindStudentByParentsRequest, setIsSendingFindStudentByParentsRequest] = useState(false);
  const [isChooseStudentModalOpened, setIsChooseStudentModalOpened] = useState(false);

  // Limit lectures and study sessions
  const [currentLectureCount, setCurrentLectureCount] = useState(GuestConstants.limitLecture);
  const [currentStudySessionCount, setCurrentStudySessionCount] = useState(GuestConstants.limitStudySession);


  const onClickAttendCourseByParent = useCallback(async () => {
    try {
      setIsChooseStudentModalOpened(true);
      setIsSendingFindStudentByParentsRequest(true);
      const userParent: UserParent = await API.get(Url.parents.getPersonalInfo, { token: authState.token });
      const isAttendedData = await Promise.all(userParent.userStudents.map(student => {
        return API.post(Url.guests.checkAttendCourse, {
          token: authState.token,
          courseSlug: props.course?.slug,
          studentId: student.user.id
        });
      }));
      const students = userParent.userStudents.map((student, index) => ({
        student: student,
        isAttended: isAttendedData[index],
      }));
      setStudents(students);
      setIsSendingFindStudentByParentsRequest(false);
    } catch (error) {
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
      setIsChooseStudentModalOpened(false);
      setIsSendingFindStudentByParentsRequest(false);
    }
  }, [authState.token, props.course?.slug]);



  const onOpenConfirmAttendCourseModalByParent = useCallback(async (studentId: number) => {
    try {
      setIsOpenConfirmAttendCourseModal(true);
      setIsSendingAttendCourseRequest(true);
      const responses: any = await API.post(Url.payments.getStudentOrderDetail, {
        token: authState.token,
        courseSlug: props.course?.slug,
        studentId: studentId,
        parentId: authState.userId,
      });
      setOrderDetail(responses.createPaymentJson);
      setAmount(responses.amount);
      setIsSendingAttendCourseRequest(false);
      setCurrentStudentId(studentId.toString());
    } catch (error: any) {
      setIsSendingAttendCourseRequest(false);
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
  }, [authState.token, props.course?.slug, authState.userId]);





  const onOpenConfirmAttendCourseModalByStudent = useCallback(async () => {
    try {
      setIsOpenConfirmAttendCourseModal(true);
      setIsSendingAttendCourseRequest(true);
      const responses: any = await API.post(Url.payments.getStudentOrderDetail, {
        token: authState.token,
        courseSlug: props.course?.slug,
        studentId: authState.userId
      });
      setOrderDetail(responses.createPaymentJson);
      setAmount(responses.amount);
      setIsSendingAttendCourseRequest(false);
      setCurrentStudentId(authState.userId || null);
    } catch (error: any) {
      setIsSendingAttendCourseRequest(false);
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
  }, [authState.token, props.course?.slug, authState.userId]);



  const createOrder = useCallback((data: any, actions: any) => {
    return actions.order.create(orderDetail);
  }, [orderDetail]);



  const onApprove = useCallback((data: any, actions: any) => {
    return actions.order.capture().then(async function (detail: any) {
      try {
        setIsOpenConfirmAttendCourseModal(true);
        setIsSendingAttendCourseRequest(true);
        await API.post(Url.payments.onSuccessParticipateCourse, {
          token: authState.token,
          courseSlug: props.course?.slug,
          studentId: currentStudentId,
          orderId: detail.id,
        });
        setIsOpenConfirmAttendCourseModal(false);
        // Check attendance
        if (authState.role === UserRole.STUDENT) {
          setIsSendingCheckAttendCourseRequest(true)
          const result = await API.post(Url.guests.checkAttendCourse, {
            token: authState.token,
            courseSlug: props.course?.slug,
            studentId: currentStudentId,
          });
          setIsAttended(result);
        }
        // Update amount of student
        const result = await API.post(Url.guests.countStudentAttendCourse, { courseSlug: props.course?.slug });
        setCountStudent(result);
        setIsSendingCheckAttendCourseRequest(false);
      } catch (error: any) {
        setIsSendingCheckAttendCourseRequest(false);
        setIsOpenConfirmAttendCourseModal(false);
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
    })
  }, [authState.token, props.course?.slug, currentStudentId]);



  const onError = useCallback((error: any) => {
    console.log(error)
    setIsSendingAttendCourseRequest(false);
    setIsOpenConfirmAttendCourseModal(false);
  }, []);



  useEffect(() => {
    if (props.course === null)
      router.replace("/not-found");
    else {
      authAction.turnOnGuestUI();
      setDidMount(true);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Chi tiết khóa học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal
        opened={isOpenConfirmAttendCourseModal}
        onClose={() => setIsOpenConfirmAttendCourseModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <Container p={0} style={{
          backgroundColor: "white",
          borderRadius: "5px",
          margin: "0 1rem",
        }}>
          {isSendingAttendCourseRequest && (
            <Container style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}>
              <Loading />
            </Container>
          )}

          {!isSendingAttendCourseRequest && (
            <>
              <Text align="center" transform="uppercase" style={{ fontSize: "1.8rem" }} weight={600}>
                Tham gia khóa học
              </Text>
              <Text align="center">
                {props.course?.curriculum.type === CourseType.SHORT_TERM
                  ? "Đây là khóa học ngắn hạn, bạn sẽ thanh toán toàn bộ khóa học trong lần đầu tiên."
                  : "Đây là khóa học dài hạn, bạn sẽ thanh toán theo từng tháng. Sau đây là khoản tiền tháng đầu tiên."}
              </Text>
              <Text align="center" style={{ fontSize: "3rem" }} weight={700} mb={20} mt={8}>
                {formatCurrency(amount || 0)}
              </Text>
              <Container style={{ display: "flex", justifyContent: "center" }} p={0}>
                <PayPalButtons
                  style={{
                    color: "blue",
                    shape: "pill",
                    label: "pay",
                    tagline: false,
                    layout: "horizontal",
                  }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
              </Container>
            </>
          )}
        </Container>
      </Modal>


      <Modal
        opened={isChooseStudentModalOpened}
        onClose={() => setIsChooseStudentModalOpened(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <Container p={0} style={{
          backgroundColor: "white",
          borderRadius: "5px",
          margin: "0 1rem",
        }}>
          {isSendingFindStudentByParentsRequest && (
            <Container style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}>
              <Loading />
            </Container>
          )}

          {!isSendingFindStudentByParentsRequest && (
            <>
              <Title align="center" transform="uppercase">Chọn học viên</Title>
              {students.length === 0 && (
                <Container style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "400px"
                }} p={10} size="xl">
                  <Text color="#ADB5BD" style={{ fontSize: "2rem" }} weight={600} align="center">
                    Không có học viên liên kết
                  </Text>
                </Container>
              )}

              {students.length > 0 && (
                <ScrollArea style={{ height: 400 }} mt={10}>
                  <SimpleGrid cols={2} p="md" spacing="sm">
                    {students.map((studentInfo, index) => (
                      <Group
                        key={index}
                        style={{
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onClick={() => {
                          if (!studentInfo.isAttended) {
                            setIsChooseStudentModalOpened(false);
                            onOpenConfirmAttendCourseModalByParent(studentInfo.student.user.id);
                          }
                        }}
                        className={studentInfo.isAttended ? styles.disabledCard : styles.teacherCard}>
                        <Avatar
                          size={80}
                          color="blue"
                          radius='xl'
                          src={getAvatarImageUrl(studentInfo.student.user.avatar)}
                        />
                        <Container style={{
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: 1,
                          justifyContent: "center",
                          alignItems: "center"
                        }} p={0}>
                          <Text style={{ fontSize: "1.4rem" }} weight={500}
                            color={studentInfo.isAttended ? "#ADB5BD" : "#444"} align="center">
                            {studentInfo.student.user.fullName}
                          </Text>
                          <Text style={{ fontSize: "1rem" }}
                            color={studentInfo.isAttended ? "#ADB5BD" : "dimmed"} align="center">MSHV: {studentInfo.student.user.id}</Text>
                          {studentInfo.isAttended && (
                            <Container style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#69DB7C",
                              borderRadius: "100px"
                            }} py={5} mt={5}>
                              <IconCheck size={12} color="#2B8A3E" />
                              <Text ml={5} style={{ fontSize: "1rem", color: "#2B8A3E" }} weight={600}>
                                Đã tham gia
                              </Text>
                            </Container>
                          )}
                        </Container>
                      </Group>
                    ))}
                  </SimpleGrid>
                </ScrollArea>
              )}
            </>
          )}
        </Container>
      </Modal>


      {didMount && (
        <div className={styles.wrapPage}>
          <Container size="xl" style={{ width: "100%" }}>
            <div className={styles.contentPage}>
              <div className={styles.contentLeft}>

                {/* INFO AUTHOR */}
                <div className={styles.wrapInfoAuthor}>
                  <div className={styles.infoAuthor}>
                    <div className={styles.wrapAvatar}>
                      <img src={getAvatarImageUrl(props.course?.teacher.worker.user.avatar)} alt="avatar" className={styles.avatarAuthor} />
                    </div>
                    <div className={styles.wrapNameAuthor}>
                      <p className={styles.txtDes}>Giáo viên</p>
                      <p className={styles.txtName}>{props.course?.teacher.worker.user.fullName}</p>
                    </div>
                  </div>
                  <div className={styles.wrapCategory}>
                    <IconChartBar />
                    <div className={styles.wrapNameCatergory}>
                      <p className={styles.txtDes}>Trình độ</p>
                      <p className={styles.txtName}>{getLevelName(props.course?.curriculum.level)}</p>
                    </div>
                  </div>
                </div>

                {/* INFO COURSE */}
                <div className={styles.wrapInfoCourse}>
                  <p className={styles.nameCourse}>
                    {props.course?.name}
                  </p>
                  <div className={styles.listInfo}>
                    <div className={styles.infoItem}>
                      <IconBooks />
                      <p className={styles.txtLabel}>
                        {props.course?.curriculum.lectures.length} bài học
                      </p>
                    </div>
                    <div className={styles.infoItem}>
                      <IconClockHour4 />
                      <p className={styles.txtLabel}>
                        {Math.ceil(diffDays(
                          new Date(props.course?.openingDate || new Date()),
                          new Date(props.course?.expectedClosingDate || new Date())) / 7)} tuần ({moment(props.course?.openingDate).format("DD/MM/YYYY") + " - " + moment(props.course?.expectedClosingDate).format("DD/MM/YYYY")})
                      </p>
                    </div>
                    <div className={styles.infoItem}>
                      <IconUsers />
                      <p className={styles.txtLabel}>
                        {props.course?.maxNumberOfStudent} học sinh
                      </p>
                    </div>
                    <div className={styles.infoItem}>
                      <IconCurrentLocation />
                      <p className={styles.txtLabel}>
                        {props.course?.branch.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION COURSE */}
                <Tabs defaultValue="tab_curriculum" style={{ margin: "20px 0px 0px" }}>
                  <Tabs.List>
                    <Tabs.Tab value="tab_curriculum">Chương trình học</Tabs.Tab>
                    <Tabs.Tab value="tab_instructor">Giáo viên</Tabs.Tab>
                    <Tabs.Tab value="tab_sessions">Lịch học</Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel value="tab_curriculum" className={styles.wrapContentTab}>
                    <div className={styles.contentTabCurriculum}>
                      <p className={styles.title}>
                        {props.course?.curriculum.name}
                      </p>
                      <p className={styles.des}>
                        {props.course?.curriculum.desc}
                      </p>
                      <div className={styles.listCurriculum}>
                        <Accordion variant="separated">
                          {props.course?.curriculum.lectures.slice(0, currentLectureCount).map((lecture, index) => (
                            <Accordion.Item value={"value_" + (index + 1)} key={index}>
                              <Accordion.Control>
                                <div className={styles.titleCurriculumItem}>
                                  <IconBook />
                                  {lecture.name}
                                </div>
                              </Accordion.Control>
                              <Accordion.Panel>
                                <div className={styles.contentRichtext} dangerouslySetInnerHTML={{ __html: lecture.desc || "" }} />
                              </Accordion.Panel>
                            </Accordion.Item>
                          ))}
                          {props.course && props.course.curriculum.lectures.length > currentLectureCount && (
                            <Container mt={30} p={0} style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                              <Button
                                radius={100}
                                onClick={() => setCurrentLectureCount(currentLectureCount + GuestConstants.limitLecture)}
                              >Xem thêm</Button>
                            </Container>
                          )}
                        </Accordion>
                      </div>
                    </div>
                  </Tabs.Panel>
                  <Tabs.Panel value="tab_instructor" className={styles.wrapContentTab}>
                    <div className={styles.tabInstructor}>
                      <div className={styles.instructorItem}>
                        <div className={styles.wrapThumbnail}>
                          <img src={getAvatarImageUrl(props.course?.teacher.worker.user.avatar)} alt="avatar" />
                        </div>
                        <div className={styles.infoInstructor}>
                          <p className={styles.name}>
                            {props.course?.teacher.worker.user.fullName}
                          </p>
                          <Text className={styles.des} weight={600}>Mô tả ngắn</Text>
                          <p className={styles.des}>
                            {props.course?.teacher.shortDesc}
                          </p>
                          <Text className={styles.des} weight={600}>Kinh nghiệm giảng dạy</Text>
                          <p className={styles.des}>
                            {props.course?.teacher.experience}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Tabs.Panel>
                  <Tabs.Panel value="tab_sessions" className={styles.wrapContentTab}>
                    <div className={styles.contentTabCurriculum}>
                      <p className={styles.title}>
                        Danh sách buổi học
                      </p>
                      <div className={styles.listCurriculum}>
                        <Accordion variant="separated">
                          {props.course?.studySessions.slice(0, currentStudySessionCount).map((session, index) => (
                            <Container p={8} my={10} key={index} style={{
                              display: "flex",
                              justifyContent: "space-evenly",
                              alignItems: "center"
                            }}>
                              <Text style={{ fontSize: "1.6rem" }} component="span" weight={600}>Buổi {index + 1}:</Text>
                              <Text
                                style={{ fontSize: "1.6rem", display: "inline-block", minWidth: "100px" }}
                                component="span" align="center">
                                {getWeekdayName(getWeekdayFromDate(moment(session.date).toDate()) || undefined)}
                              </Text>
                              <Text style={{ fontSize: "1.6rem" }} component="span">{moment(session.shifts[0].startTime).format("HH:mm") + " - " + moment(session.shifts[session.shifts.length - 1].endTime).format("HH:mm")}</Text>
                              <Text style={{ fontSize: "1.6rem" }} component="span">{moment(session.date).format("DD/MM/YYYY")}</Text>
                            </Container>
                          ))}
                          {props.course && props.course.studySessions.length > currentStudySessionCount && (
                            <Container mt={30} p={0} style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                              <Button
                                radius={100}
                                onClick={() => setCurrentStudySessionCount(currentStudySessionCount + GuestConstants.limitStudySession)}
                              >Xem thêm</Button>
                            </Container>
                          )}
                        </Accordion>
                      </div>
                    </div>
                  </Tabs.Panel>
                </Tabs>

              </div>
              <div className={styles.contentRight}>
                {/* BOX PRICE */}
                <div className={styles.wrapPice}>
                  <div className={styles.wrapThumbnail}>
                    <img src={getImageUrl(props.course?.image)} alt="banner" />
                  </div>
                  <div className={styles.infoPrice}>
                    <p className={styles.txtPrice}>
                      {formatCurrency(props.course?.price)}
                    </p>
                    {authState.role === UserRole.GUEST &&
                      props.course &&
                      props.course.maxNumberOfStudent > countStudent && (
                        <button type="button" className={styles.buttonBuy}
                          onClick={() => router.push({
                            pathname: "/login",
                            query: { returnUrl: router.asPath },
                          })}>
                          Đăng ký ngay
                        </button>
                      )}
                    {authState.role === UserRole.GUEST &&
                      props.course &&
                      props.course.maxNumberOfStudent <= countStudent && (
                        <button type="button" className={styles.buttonBuySuccess}>
                          Khóa học đã hết chỗ
                        </button>
                      )}
                    {(authState.role === UserRole.STUDENT) && (
                      <>
                        {isSendingCheckAttendCourseRequest && (
                          <Container style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexGrow: 1,
                          }} my={20} p={0}>
                            <Loader />
                          </Container>
                        )}
                        {!isSendingCheckAttendCourseRequest &&
                          !isAttended &&
                          props.course &&
                          props.course.maxNumberOfStudent > countStudent && (
                            <button
                              type="button" className={styles.buttonBuy}
                              onClick={onOpenConfirmAttendCourseModalByStudent}>
                              Tham gia khóa học
                            </button>
                          )}
                        {!isSendingCheckAttendCourseRequest &&
                          !isAttended &&
                          props.course &&
                          props.course.maxNumberOfStudent <= countStudent && (
                            <button type="button" className={styles.buttonBuySuccess}>
                              Khóa học đã hết chỗ
                            </button>
                          )}
                        {!isSendingCheckAttendCourseRequest &&
                          isAttended && (
                            <button type="button" className={styles.buttonBuySuccess}>
                              Đã tham gia khóa học
                            </button>
                          )}
                      </>
                    )}
                    {(authState.role === UserRole.PARENT) &&
                      props.course &&
                      props.course.maxNumberOfStudent > countStudent && (
                        <button
                          type="button" className={styles.buttonBuy}
                          onClick={onClickAttendCourseByParent}>
                          Tham gia khóa học
                        </button>
                      )}
                    {(authState.role === UserRole.PARENT) &&
                      props.course &&
                      props.course.maxNumberOfStudent <= countStudent && (
                        <button type="button" className={styles.buttonBuySuccess}>
                          Khóa học đã hết chỗ
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}
    </>
  )
}

export default index
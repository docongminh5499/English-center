import { Badge, Box, Container, Divider, Grid, Group, Image, Input, List, Loader, Modal, NavLink, Pagination, ScrollArea, Space, Table, Text, ThemeIcon, Title } from "@mantine/core";
import { useInputState, useMediaQuery } from "@mantine/hooks";
import { IconSquarePlus, IconTrash } from "@tabler/icons";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { TeacherConstants, Url } from "../../../../helpers/constants";
import { getCourseType } from "../../../../helpers/getCourseType";
import { getCurriculumLevel } from "../../../../helpers/getCurriculumLevel";
import { getGenderName } from "../../../../helpers/getGenderName";
import { getImageUrl } from "../../../../helpers/image.helper";
import Curriculum from "../../../../models/cirriculum.model";
import UserTeacher from "../../../../models/userTeacher.model";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";
import DeleteModal from "../Modal/delete.modal";
import FindAddPreferedTeacher from "../Modal/findAddPreferedTeacher.modal";
import styles from "./curriculum.module.css";
import Lecture from "../../../../models/lecture.model";
import CurriculumExercise from "../../../../models/curriculumExercise";
import CurriculumCreateExercise from "./curriculum.exercise.create";
import CurriculumExerciseDetail from "./curriculum.exercise.detail";


interface IProps {
  curriculum: Curriculum | null;
  isPreferred: boolean;
}

const TeacherCurriculumDetailScreen = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const [active, setActive] = useState(0);

  const [authState] = useAuth();
  const [didMount, setDidMount] = useState(false);
  const [isPreferred, setIsPreferred] = useState(props.isPreferred);
  const router = useRouter();

  const [currentTeacher, setCurrentTeacher] = useState<UserTeacher | null>(null);
  const [isOpenRemoveTeacherPreferedCurrModal, setIsOpenRemoveTeacherPreferedCurrModal] = useState(false);
  const [isSendingRemoveTeacherPreferedCurrRequest, setIsSendingRemoveTeacherPreferedCurrRequest] = useState(false);

  const [isOpenSearchTeacherModal, setIsOpenSearchTeacherModal] = useState(false);
  const [isSendingAddTeacherPreferedCurrRequest, setIsSendingAddTeacherPreferedCurrRequest] = useState(false);


  const [listTeachers, setListTeachers] = useState<UserTeacher[]>([]);
  const [totalTeacher, setTotalTeacher] = useState(0);
  const [loadingTeacher, setLoadingTeacher] = useState(true);
  const [errorTeacher, setErrorTeacher] = useState(false);
  const [currentPageTeacher, setCurrentPageTeacher] = useState(1);
  const [maxPageTeacher, setMaxPageTeacher] = useState(1);
  const [queryTeacher, setQueryTeacher] = useInputState("");

  const [listExercises, setListExercises] = useState(props.curriculum === undefined || props.curriculum?.exercises === undefined ? [] : props.curriculum?.exercises);
  const [selectedExercise, setSelectedExercise] = useState<CurriculumExercise | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [seeExerciseDetail, setSeeExerciseDetail] = useState(false);
  const [createNewExercise, setCreateNewExercise] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [loaderDelete, setLoaderDelete] = useState(false);

  const getTeachers = useCallback(async (limit: number, skip: number, query: string, curriculumId?: number) => {
    return await API.post(Url.teachers.getTeachersPreferedCurriculum, {
      token: authState.token,
      limit: limit,
      skip: skip,
      query: query,
      curriculumId: curriculumId,
    });
  }, [authState.token]);



  const queryTeachers = useCallback(async () => {
    try {
      setLoadingTeacher(true);
      setErrorTeacher(false);
      const responses = await getTeachers(TeacherConstants.limitTeacher, 0, queryTeacher, props.curriculum?.id);
      setCurrentPageTeacher(1);
      setTotalTeacher(responses.total);
      setMaxPageTeacher(Math.ceil(responses.total / TeacherConstants.limitTeacher));
      setListTeachers(responses.teachers);
      setLoadingTeacher(false);
      setErrorTeacher(false);
    } catch (error) {
      setLoadingTeacher(false);
      setErrorTeacher(true);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [queryTeacher, props.curriculum?.id])



  const onClickPaginationPage = useCallback(async (page: number) => {
    try {
      if (page < 1) return;
      setLoadingTeacher(true);
      setErrorTeacher(false);
      const responses = await getTeachers(
        TeacherConstants.limitTeacher,
        (page - 1) * TeacherConstants.limitTeacher,
        queryTeacher,
        props.curriculum?.id
      );
      setTotalTeacher(responses.total);
      setMaxPageTeacher(Math.ceil(responses.total / TeacherConstants.limitTeacher));
      setListTeachers(responses.teachers);
      setLoadingTeacher(false);
      setCurrentPageTeacher(page);
    } catch (err) {
      setLoadingTeacher(false);
      setCurrentPageTeacher(page);
      setErrorTeacher(true);
    }
  }, [queryTeacher, props.curriculum?.id]);



  const addPreferredCurriculum = useCallback(async (teacher: UserTeacher) => {
    try {
      setIsSendingAddTeacherPreferedCurrRequest(true);
      const responses = await API.post(Url.teachers.addPreferredCurriculums, {
        token: authState.token,
        teacherId: teacher.worker.user.id,
        curriculumId: props.curriculum?.id
      });
      if (responses) {
        onClickPaginationPage(currentPageTeacher);
        if (teacher.worker.user.id.toString() == authState.userId) setIsPreferred(!isPreferred);
        toast.success("Thêm giáo viên thành công.")
      } else toast.error("Thêm giáo viên thất bại.")
      setIsOpenSearchTeacherModal(false);
      setIsSendingAddTeacherPreferedCurrRequest(false);
    } catch (error: any) {
      setIsOpenSearchTeacherModal(false);
      setIsSendingAddTeacherPreferedCurrRequest(false);
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
  }, [props.curriculum?.id, authState.token, isPreferred]);


  const removePreferredCurriculum = useCallback(async () => {
    try {
      setIsSendingRemoveTeacherPreferedCurrRequest(true);
      const responses = await API.post(Url.teachers.removePreferredCurriculums, {
        token: authState.token,
        teacherId: currentTeacher?.worker.user.id,
        curriculumId: props.curriculum?.id
      });
      if (responses) {
        const currentLimit = (currentPageTeacher - 1) * TeacherConstants.limitTeacher;
        const updatedTotal = totalTeacher - 1;
        const updatedPage = currentLimit < updatedTotal ? currentPageTeacher : currentPageTeacher - 1
        if (updatedPage < 1) {
          setTotalTeacher(1);
          setMaxPageTeacher(1);
          setListTeachers([]);
        } else onClickPaginationPage(updatedPage);
        if (currentTeacher?.worker.user.id.toString() == authState.userId) setIsPreferred(!isPreferred);
        toast.success("Xóa giáo viên thành công.")
      } else toast.error("Xóa giáo viên thất bại.")
      setIsSendingRemoveTeacherPreferedCurrRequest(false);
      setIsOpenRemoveTeacherPreferedCurrModal(false);
    } catch (error: any) {
      setIsSendingRemoveTeacherPreferedCurrRequest(false);
      setIsOpenRemoveTeacherPreferedCurrModal(false);
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
  }, [props.curriculum?.id, authState.token, isPreferred, currentTeacher?.worker.user.id]);



  useEffect(() => {
    const didMountFunc = async () => {
      try {
        const responses = await getTeachers(TeacherConstants.limitTeacher, 0, queryTeacher, props.curriculum?.id);
        setTotalTeacher(responses.total);
        setMaxPageTeacher(Math.ceil(responses.total / TeacherConstants.limitTeacher));
        setListTeachers(responses.teachers);
        setLoadingTeacher(false);
        setErrorTeacher(false);
      } catch (error) {
        setLoadingTeacher(false);
        setErrorTeacher(true);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
      } finally {
        setDidMount(true);
      }
    }
    if (props.curriculum === null)
      router.replace('/not-found');
    else if (authState.isManager)
      didMountFunc();
    else setDidMount(true);
  }, []);

  const listLecture =
    props.curriculum === undefined ||  props.curriculum?.lectures === undefined? [] : props.curriculum?.lectures;
  listLecture.sort((a: Lecture, b: Lecture) => {
    return a.order - b.order;
  });
  const groupedExercise = new Map<number, CurriculumExercise[]>();
  for (const lecture of listLecture) {
    groupedExercise.set(lecture.id, []);
  }
  
  for (const exercise of listExercises) {
    const key = exercise.lecture.id;
    if (groupedExercise.has(key)) {
      groupedExercise.get(key)?.push(exercise);
    }
  }
  console.log(props.curriculum);

  const deleteExercise = async ()=>{
    setIsOpenDeleteModal(false);
    setLoaderDelete(true);
    try {
      await API.post(Url.teachers.deleteCurriculumExercise, {
        token: authState.token, 
        exerciseId: selectedExercise?.id,
      });
      const updatedListExercises = listExercises?.filter(
        (item) => item.id !== selectedExercise?.id
      );
      setLoaderDelete(false);
      setListExercises(updatedListExercises);
      toast.success("Xóa bài tập thành công!");
    } catch (error) {
      console.log(error);
      setLoaderDelete(false);
      toast.error("Xóa bài tập thất bại, vui lòng thử lại sau!");
    } finally {
      setLoaderDelete(false);
    }
  }

  return (
    <>
      <Head>
        <title>Chi tiết chương trình học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Modal
        opened={loaderDelete}
        onClose={() => setLoaderDelete(false)}
        centered
        withCloseButton={false}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Group>
          <Loader />
          <Text size={15}>Đang xử lý...</Text>
        </Group>
      </Modal> */}

      <Modal
        opened={isOpenDeleteModal}
        onClose={() => setIsOpenDeleteModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}
        withCloseButton={false}
      >
        <Group  position="center">
          <Text size="xl">Xác nhận xóa bài tập?</Text>
        </Group>
        <Group position="center">
          <Button type="submit" color={"green"} mt="md" onClick={deleteExercise}>
            Xác nhận
          </Button>
          <Button type="submit" color={"red"} mt="md" ml="sm" onClick={()=>setIsOpenDeleteModal(false)}>
            Hủy bỏ  
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={isOpenRemoveTeacherPreferedCurrModal}
        onClose={() => setIsOpenRemoveTeacherPreferedCurrModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <DeleteModal
          title="Xóa giáo viên"
          message={`Bạn có chắc muốn xóa giáo viên "${currentTeacher?.worker.user.fullName}" ra khỏi danh sách chỉ định dạy chương trình học chứ?`}
          onDelete={removePreferredCurriculum}
          loading={isSendingRemoveTeacherPreferedCurrRequest}
        />
      </Modal>

      <Modal
        opened={isOpenSearchTeacherModal}
        onClose={() => setIsOpenSearchTeacherModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <FindAddPreferedTeacher
          onChooseTeacher={addPreferredCurriculum}
          loading={isSendingAddTeacherPreferedCurrRequest}
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

      {didMount && !seeExerciseDetail && !createNewExercise && (
        <Container size="xl" style={{ width: "100%" }}>
          <Title transform="uppercase" color="#444" size="2.6rem" my={20} align="center">
            {props.curriculum?.name}
          </Title>
          <Container style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            {isPreferred && (
              <Badge>Được chỉ định</Badge>
            )}
          </Container>
          <Space h={20} />
          <Text color="#444" align="justify">
            <Text color="#444" weight={600}>Mô tả: </Text>
            {props.curriculum?.desc}
          </Text>
          <Space h={20} />
          <Text color="#444" align="justify">
            <Text color="#444" weight={600} component="span">Loại khóa học: </Text>
            {getCourseType(props.curriculum?.type)}
          </Text>
          <Space h={20} />
          <Text color="#444" align="justify">
            <Text color="#444" weight={600} component="span">Số ca học mỗi buổi: </Text>
            {props.curriculum?.shiftsPerSession} ca học mỗi buổi
          </Text>
          <Space h={20} />
          <Text color="#444" align="justify">
            <Text color="#444" weight={600} component="span">Trình độ: </Text>
            {getCurriculumLevel(props.curriculum?.level)}
          </Text>
          <Space h={20} />
          <Text color="#444" align="justify">
            <Text color="#444" weight={600} component="span">Thể loại: </Text>
            {props.curriculum &&
              props.curriculum.tags &&
              props.curriculum.tags.length > 0 &&
              props.curriculum?.tags.map((tag, index) => (
                <Badge key={index} m={5} color="gray" variant="filled">
                  {tag.name}
                </Badge>
              ))}
            {(!props.curriculum ||
              !props.curriculum.tags ||
              !(props.curriculum.tags.length > 0)) && "Chưa có dữ liệu"}
          </Text>
          <Space h={40} />
          <Container style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Image
              withPlaceholder
              placeholder={
                <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "300px" }}>
                  <Loader variant="dots" />
                </Container>
              }
              style={{ maxWidth: "300px" }}
              radius="md"
              src={getImageUrl(props.curriculum?.image)}
              alt="Hình minh họa chương trình dạy"
            />
          </Container>
          {authState.isManager && (
            <>
              <Space h={40} />
              <Container size="xl" style={{ width: "100%" }} p={0}>
                <Text weight={600} align="center" style={{ fontSize: "2rem" }} mb={10} transform="uppercase">
                  Danh sách giáo viên được chỉ định
                </Text>
                <Grid mb={20}>
                  {!isTablet && (<Grid.Col span={3}></Grid.Col>)}
                  <Grid.Col span={isTablet ? (isMobile ? 12 : 8) : 4}>
                    <Input
                      styles={{ input: { color: "#444" } }}
                      value={queryTeacher}
                      placeholder="Tìm kiếm theo tên hoặc MSHV"
                      onChange={setQueryTeacher}
                    />
                  </Grid.Col>
                  <Grid.Col span={isTablet ? (isMobile ? 12 : 4) : 2}>
                    <Button fullWidth onClick={() => queryTeachers()} disabled={loadingTeacher}>
                      Tìm kiếm
                    </Button>
                  </Grid.Col>
                </Grid>
                {loadingTeacher && (
                  <Container style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "300px",
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                    <Loading />
                  </Container>
                )}
                {!loadingTeacher && errorTeacher && (
                  <div className={styles.errorContainer}>
                    <p>Có lỗi xảy ra, vui lòng thử lại</p>
                    <Button
                      color="primary"
                      onClick={() => onClickPaginationPage(currentPageTeacher)}>
                      Thử lại
                    </Button>
                  </div>
                )}
                {!loadingTeacher &&
                  !errorTeacher &&
                  listTeachers.length == 0 && (
                    <div className={styles.emptyResultContainer}>
                      <p>Không có kết quả</p>
                      <Button color="green" mt={10} onClick={() => setIsOpenSearchTeacherModal(true)}>
                        Thêm giáo viên
                      </Button>
                    </div>
                  )}
                {!loadingTeacher &&
                  !errorTeacher &&
                  listTeachers.length > 0 && (
                    <>
                      <ScrollArea style={{ width: "100%" }}>
                        <Table verticalSpacing="xs" highlightOnHover style={{ width: "100%", minWidth: "900px" }}>
                          <thead>
                            <tr>
                              <th>MSGV</th>
                              <th>Tên giáo viên</th>
                              <th>Giới tính</th>
                              <th>Ngày sinh</th>
                              <th>Email</th>
                              <th>Số điện thoại</th>
                              <th>
                                <ThemeIcon size="lg" color="green" style={{ cursor: "pointer" }}
                                  onClick={() => setIsOpenSearchTeacherModal(true)}>
                                  <IconSquarePlus size={20} />
                                </ThemeIcon>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {listTeachers.map((teacher: UserTeacher, index: number) => (
                              <tr key={index}>
                                <td>{teacher.worker.user.id}</td>
                                <td>{teacher.worker.user.fullName}</td>
                                <td>{getGenderName(teacher.worker.user.sex)}</td>
                                <td>{moment(teacher.worker.user.dateOfBirth).format("DD/MM/YYYY")}</td>
                                <td>{teacher.worker.user.email || "-"}</td>
                                <td>{teacher.worker.user.phone || "-"}</td>
                                <td>
                                  <ThemeIcon size="lg" color="red" style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setCurrentTeacher(teacher);
                                      setIsOpenRemoveTeacherPreferedCurrModal(true);
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
                      {currentPageTeacher > 0 && maxPageTeacher > 0 && (
                        <Container style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center"
                        }} p={0}>
                          <Pagination
                            className={styles.pagination}
                            page={currentPageTeacher}
                            total={maxPageTeacher}
                            onChange={(choosedPage: number) => onClickPaginationPage(choosedPage)}
                          />
                        </Container>
                      )}
                    </>
                  )}
              </Container>
            </>
          )}
          <Space h={40} />
          <Divider />
          <Space h={40} />
          <Container size="xl" p={0}>
            {props.curriculum && (
              <Container size="xl" style={{ display: "flex", flexDirection: isTablet ? "column" : "row" }} p={0}>
                <ScrollArea type="never" style={{ width: isTablet ? "100%" : "175px", minWidth: isTablet ? "0px" : "175px" }}>
                  <Grid style={{ maxHeight: isTablet ? 100 : 500 }}>
                    {props.curriculum.lectures.map((item, index) => (
                      <Grid.Col span={isTablet ? (isMobile ? 4 : 3) : 12} key={index}>
                        <NavLink
                          style={{ borderRadius: 5 }}
                          active={index === active}
                          label={
                            isTablet ? (
                              <Text color={index === active ? "blue" : "#444"} style={{ fontSize: "1.4rem" }} weight={700}>
                                <Text align="center">Bài {item.order}</Text>
                              </Text>
                            ) : (
                              <Text color={index === active ? "blue" : "#444"} style={{ fontSize: "1.4rem" }}>
                                <Text weight={600} component="span">
                                  {"Bài " + item.order + ": "}
                                </Text>
                                {item.name}
                              </Text>
                            )}
                          onClick={() => setActive(index)}
                        />
                      </Grid.Col>
                    ))}
                  </Grid>
                </ScrollArea>
                <Container style={{ flexGrow: 1 }} pl={isTablet ? 0 : 8} pr={0} mt={isTablet ? 16 : 0} mx={0}>
                  {active >= 0 && (
                    <Container
                      px={isMobile ? 0 : 10}
                      size="xl"
                      style={{ color: "#444", textAlign: "justify", width: "100%" }}>
                      <Text color="#444" weight={600}>Mô tả ngắn: </Text>
                      <Container p={0} dangerouslySetInnerHTML={{ __html: props.curriculum.lectures[active].desc || "" }} />
                      <Text color="#444" weight={600} mt={20}>Chi tiết bài học: </Text>
                      <Container p={0} dangerouslySetInnerHTML={{ __html: props.curriculum.lectures[active].detail }} />
                      <Group mt={20}>
                        <Text color="#444" weight={600}>Danh sách bài tập: </Text>
                        {authState.isManager && 
                          <ThemeIcon size="md" color="green" style={{ cursor: "pointer", marginBottom: "0px" }}
                            onClick={() => {
                              setCreateNewExercise(true);
                              setSelectedLecture(props.curriculum?.lectures[active]!);
                            }}>
                            <IconSquarePlus size={20} style={{marginBottom: "0px" }}/>
                          </ThemeIcon>
                        }
                      </Group>
                        {groupedExercise.has(props.curriculum.lectures[active].id) &&
                          groupedExercise.get(props.curriculum.lectures[active].id)?.map((exercise: CurriculumExercise, index: number) => {
                            return (
                              <Box style={{width: "100%"}} key={index}>
                                  <Grid style={{width: "100%"}}>
                                    <Grid.Col span={"auto"} style={{width: "100%"}}>
                                      <Text size={15}>
                                        {exercise.name}
                                      </Text>
                                    </Grid.Col>
                                    <Grid.Col span={2} style={{width: "100%"}}>
                                      <Button
                                        compact={isLargeTablet ? false : true}
                                        fullWidth
                                        variant="light"
                                        onClick={() => {
                                          setSelectedExercise(exercise);
                                          setSeeExerciseDetail(true);
                                        }}
                                      >
                                        Xem chi tiết
                                      </Button>
                                    </Grid.Col>
                                    {authState.isManager && 
                                      <Grid.Col span={2} style={{width: "100%"}}>
                                        <Button
                                          variant="light"
                                          onClick={() => {
                                            setSelectedExercise(exercise);
                                            setIsOpenDeleteModal(true);
                                          }}
                                          compact={isLargeTablet ? false : true}
                                          color="red"
                                          fullWidth
                                          size="xs"
                                        >
                                          Xóa bài tập
                                        </Button>
                                      </Grid.Col>
                                    }
                                  </Grid>
                                </Box>
                            )
                          })
                        }
                    </Container>
                  )}
                </Container>
              </Container>
            )}
          </Container>

          <Space h={40} />
          {authState.isManager && (
            <Container my={20} style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={() => router.push(router.asPath + "/modify")}
              >Chỉnh sửa chương trình dạy</Button>
            </Container>
          )}
        </Container>
      )}

      {seeExerciseDetail && (
        <>
          <CurriculumExerciseDetail 
            {...props}
            setSeeExerciseDetail={setSeeExerciseDetail}
            exerciseId={selectedExercise?.id}
            exercise={selectedExercise}
            listLecture={listLecture}
            setListExercises={setListExercises}
          />
        </>
      )}

      {createNewExercise && (
        <>
          <CurriculumCreateExercise
            {...props}
            createExerState={setCreateNewExercise}
            lecture={selectedLecture}
            curriculum={props.curriculum}
            setListExercises={setListExercises}
          />
        </>
      )}
    </>
  );
}


export default TeacherCurriculumDetailScreen;
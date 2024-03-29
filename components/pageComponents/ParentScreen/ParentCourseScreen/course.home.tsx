import {
  Badge,
  Box,
  Card,
  Checkbox,
  Container,
  Grid,
  Group,
  Image,
  Input,
  MediaQuery,
  Pagination,
  Select,
  SimpleGrid,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { useInputState, useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import {
  CourseStatus,
  StudentConstants,
  TimeZoneOffset,
  Url,
  UserRole,
} from "../../../../helpers/constants";
import { getCourseStatus } from "../../../../helpers/getCourseStatus";
import { getImageUrl } from "../../../../helpers/image.helper";
import { Course } from "../../../../models/course.model";
import Pageable from "../../../../models/pageable.model";
import { useAuth } from "../../../../stores/Auth";
import { useParent } from "../../../../stores/Parent";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";
import SelectStudentModal from "../Modal/selectStudent.modal";
import styles from "./course.module.css";

const ParentCourseScreen = (props: any) => {
  const [authState] = useAuth();
  const [parentState, setParentState] = useParent();
  const [selectStudentModal, setSelectStudentModal] = useState(
    parentState.selectedStudentId == undefined ? true : false
  );
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageable, setPageable] = useState(null);
  const parent = props.parent;

  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
  console.log(parentState);

  console.log("||||||||||||||||||||||||||||||||||||||||||");
  console.log(parent);

  //=====================================================================================================
  const router = useRouter();
  console.log(router);
  const formatCourse = useCallback((courses: any) => {
    const result: any = {};
    (courses || []).forEach((course: any) => {
      const key = moment(course.openingDate)
        .utcOffset(TimeZoneOffset)
        .format("MM-YYYY");
      result[key] = result[key] || [];
      result[key].push(course);
    });
    return result;
  }, []);

  const [error, setError] = useState(props.error || false);
  const [maxPage, setMaxPage] = useState(
    Math.ceil(
      (pageable?.total || 1) / (pageable?.limit || StudentConstants.limitCourse)
    )
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [course, setCourse] = useState<any>(formatCourse(props.courses));
  const isSmallerThan768 = useMediaQuery("(max-width: 768px)");
  console.log("==========================================");
  console.log(course);
  //Get course at first time
  useEffect(() => {
    const didMountFunc = async () => {
      try {
        setLoading(true);
        if (parentState.selectedStudentId == undefined) return;
        const exerciseResponse = await API.get(
          Url.parents.getPageableStudentCourses,
          {
            token: authState.token,
            studentId: parentState.selectedStudentId,
            limit: StudentConstants.limitCourse,
            skip: 0,
          }
        );
        //Set state
        setPageable({
          limit: exerciseResponse.limit,
          skip: exerciseResponse.skip,
          total: exerciseResponse.total,
        });
        setMaxPage(
          Math.ceil(
            (exerciseResponse?.total || 1) /
              (exerciseResponse?.limit || StudentConstants.limitCourse)
          )
        );
        setCourse(formatCourse(exerciseResponse.courses));
      } catch (error) {
        console.log(error);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    didMountFunc();
  }, [parentState.selectedStudentId]);

  // Filter state
  const [name, setName] = useInputState("");
  const [closed, setClosed] = useInputState(false);
  const [open, setOpen] = useInputState(false);
  const [longTerm, setLongTerm] = useInputState(false);
  const [shortTerm, setShortTerm] = useInputState(false);

  const getCourse = useCallback(
    async (
      limit: number,
      skip: number,
      name: string,
      closed: boolean,
      open: boolean,
      longTerm: boolean,
      shortTerm: boolean
    ) => {
      const responses = await API.get(Url.parents.getPageableStudentCourses, {
        token: authState.token,
        studentId: parentState.selectedStudentId,
        limit,
        skip,
        name,
        closed,
        open,
        longTerm,
        shortTerm,
      });
      const result = formatCourse(responses.courses);
      setCourse(result);
      setMaxPage(Math.ceil(responses.total / responses.limit));
    },
    [pageable, parentState.selectedStudentId]
  );

  const onClickPaginationPage = useCallback(
    async (
      page: number,
      name: string,
      closed: boolean,
      open: boolean,
      longTerm: boolean,
      shortTerm: boolean
    ) => {
      try {
        if (page < 1) return;
        setLoading(true);
        setError(false);

        await getCourse(
          StudentConstants.limitCourse,
          (page - 1) * StudentConstants.limitCourse,
          name,
          closed,
          open,
          longTerm,
          shortTerm
        );

        setLoading(false);
        setCurrentPage(page);
      } catch (err) {
        setLoading(false);
        setCurrentPage(page);
        setError(true);
      }
    },
    [pageable]
  );

  return (
    <Box m={"md"} style={{ width: "100%" }}>
      <Head>
        <title>Khóa học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {selectStudentModal && (
        <SelectStudentModal
          students={parent.userStudents}
          setSelectedStudent={setSelectedStudent}
          openedModal={setSelectStudentModal}
        />
      )}
      {!selectStudentModal && (
        <div className={styles.studentCoursePage}>
          <p className={styles.title}>Danh sách khóa học</p>

          <Grid mt="sm" mb="sm">
            <Grid.Col span={6}>
              <Title
                align="right"
                order={3}
                style={{ width: "100%" }}
                mt={"sm"}
              >
                Học viên:
              </Title>
            </Grid.Col>
            <Grid.Col span={6}>
              <Group position="left" align={"center"} mt="sm">
                <Select
                  radius={"md"}
                  size={"md"}
                  placeholder="Chọn học viên muốn bạn theo dõi"
                  defaultValue={parentState.selectedStudentId?.toString()}
                  onChange={(value: string) => {
                    setParentState.setSelectedStudent(parseInt(value));
                  }}
                  data={parent.userStudents.map((userStudent: any) => {
                    return {
                      value: userStudent.user.id.toString(),
                      label: userStudent.user.fullName,
                    };
                  })}
                />
              </Group>
            </Grid.Col>
          </Grid>
          <div className={styles.filterComponent}>
            <Grid>
              <Grid.Col span={isSmallerThan768 ? 12 : 9}>
                <Input
                  styles={{ input: { color: "#444" } }}
                  value={name}
                  placeholder="Tên khóa học"
                  onChange={setName}
                />
                <Space h="xs" />
                <SimpleGrid cols={isSmallerThan768 ? 2 : 4}>
                  <Checkbox
                    styles={{ label: { color: "#444" } }}
                    label="Đang - Sắp diễn ra"
                    checked={open}
                    onChange={setOpen}
                  />
                  <Checkbox
                    styles={{ label: { color: "#444" } }}
                    label="Đã kết thúc"
                    checked={closed}
                    onChange={setClosed}
                  />
                  <Checkbox
                    styles={{ label: { color: "#444" } }}
                    label="Khóa ngắn hạn"
                    checked={shortTerm}
                    onChange={setShortTerm}
                  />
                  <Checkbox
                    styles={{ label: { color: "#444" } }}
                    label="Khóa dài hạn"
                    checked={longTerm}
                    onChange={setLongTerm}
                  />
                </SimpleGrid>
              </Grid.Col>
              <Grid.Col
                span={isSmallerThan768 ? 12 : 3}
                py={isSmallerThan768 ? 8 : 0}
              >
                <Container
                  p={0}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "0.2rem",
                    height: "100%",
                  }}
                >
                  <Button
                    // compact={!isSmallerThan768}
                    onClick={() => {
                      setCurrentPage(1);
                      onClickPaginationPage(
                        1,
                        name,
                        closed,
                        open,
                        longTerm,
                        shortTerm
                      );
                    }}
                  >
                    Lọc khóa học
                  </Button>
                  <Button
                    // compact={!isSmallerThan768}
                    color="gray"
                    onClick={() => {
                      setCurrentPage(1);
                      setName("");
                      setClosed(false);
                      setOpen(false);
                      setLongTerm(false);
                      setShortTerm(false);
                      onClickPaginationPage(1, "", false, false, false, false);
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </Container>
              </Grid.Col>
            </Grid>
          </div>

          <div className={styles.courseList}>
            {loading && (
              <div className={styles.loadingContainer}>
                <Loading />
              </div>
            )}

            {!loading && error && (
              <div className={styles.errorContainer}>
                <p>Có lỗi xảy ra, vui lòng thử lại</p>
                <Button
                  color="primary"
                  onClick={() =>
                    onClickPaginationPage(
                      currentPage,
                      name,
                      closed,
                      open,
                      longTerm,
                      shortTerm
                    )
                  }
                >
                  Thử lại
                </Button>
              </div>
            )}

            {!loading && !error && Object.keys(course).length == 0 && (
              <div className={styles.emptyResultContainer}>
                <p>Không có kết quả</p>
              </div>
            )}

            {!loading &&
              !error &&
              Object.keys(course).length > 0 &&
              Object.keys(course).map((key, sectionIndex) => {
                const [month, year] = key.split("-");
                return (
                  <div
                    className={styles.courseDateBasedSection}
                    key={sectionIndex}
                  >
                    <p className={styles.date}>
                      Tháng {month.padStart(2, "0")} năm {year}
                    </p>
                    <div className={styles.courseContainer}>
                      {course[key].map((courseInfo: Course) => {
                        return (
                          <Card
                            key={courseInfo.id}
                            className={styles.courseCard}
                            shadow="sm"
                            p="lg"
                            radius="md"
                            withBorder
                            onClick={() =>
                              router.push({
                                pathname: `/parent/course/${courseInfo.slug}`,
                                query: {
                                  studentId: parentState.selectedStudentId,
                                },
                              })
                            }
                          >
                            <Card.Section>
                              <Image
                                src={getImageUrl(courseInfo.image)}
                                height={180}
                                alt="image-course"
                              />
                            </Card.Section>
                            <div className={styles.courseInfo}>
                              <Text
                                weight={600}
                                align="center"
                                className={styles.courseName}
                                lineClamp={2}
                              >
                                {courseInfo.name}
                              </Text>
                              <Text
                                style={{ fontSize: "1.2rem" }}
                                color="dimmed"
                                align="center"
                              >
                                Mã lớp:{" "}
                                {courseInfo.id.toString().padStart(6, "0")}
                              </Text>
                              {getCourseStatus(courseInfo) ===
                                CourseStatus.NotOpen && (
                                <Badge color="gray" variant="light">
                                  Sắp diễn ra
                                </Badge>
                              )}

                              {getCourseStatus(courseInfo) ===
                                CourseStatus.Opened && (
                                <Badge color="green" variant="light">
                                  Đang diễn ra
                                </Badge>
                              )}

                              {getCourseStatus(courseInfo) ===
                                CourseStatus.Closed && (
                                <Badge color="pink" variant="light">
                                  Đã kết thúc
                                </Badge>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            {currentPage > 0 && maxPage > 0 && (
              <Pagination
                className={styles.pagination}
                page={currentPage}
                total={maxPage}
                onChange={(choosedPage: number) =>
                  onClickPaginationPage(
                    choosedPage,
                    name,
                    closed,
                    open,
                    longTerm,
                    shortTerm
                  )
                }
              />
            )}
          </div>
        </div>
      )}
    </Box>
  );
};

export default ParentCourseScreen;

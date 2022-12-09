import { Button, Container, Group, Pagination, Select, Space } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../helpers/api";
import { CurriculumLevel, GuestConstants, Url } from "../../../helpers/constants";
import Branch from "../../../models/branch.model";
import { Course } from "../../../models/course.model";
import Tag from "../../../models/tag.model";
import { useAuth } from "../../../stores/Auth";
import Loading from "../../commons/Loading";
import styles from "./allCourse.module.css";
import CourseSale from "./components/CourseSale";



const diffDays = (date1: Date, date2: Date) => {
  const diffTime: number = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}



interface IProps {
  courses: Course[];
  total: number;
  branches: Branch[];
  tags: Tag[];
}


const AllCourseScreen = (props: IProps) => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const [authState, authAction] = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [listCourses, setListCourses] = useState<Course[]>(props.courses);
  const [total, setTotal] = useState(props.total);
  const [maxPage, setMaxPage] = useState(Math.ceil(props.total / GuestConstants.limitCourse));
  const [level, setLevel] = useState<CurriculumLevel | null | "">("");
  const [branch, setBranch] = useState<string | null>("");
  const [tag, setTag] = useState<string | null>("");
  const [didMount, setDidMount] = useState(false);



  const getCourses = useCallback(async (limit: number, skip: number) => {
    return await API.post(Url.guests.getCourses, {
      limit: limit,
      skip: skip,
      branchId: (branch === null || branch === "") ? undefined : parseInt(branch),
      curriculumTag: tag === "" ? undefined : tag,
      level: (level === "" || level === null) ? undefined : level,
    });
  }, [branch, tag, level]);



  const queryCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const responses = await getCourses(GuestConstants.limitCourse, 0);
      setCurrentPage(1);
      setTotal(responses.total);
      setMaxPage(Math.ceil(responses.total / GuestConstants.limitCourse));
      setListCourses(responses.courses);
      setLoading(false);
      setError(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [getCourses])



  const onClickPaginationPage = useCallback(async (page: number) => {
    try {
      if (page < 1) return;
      setLoading(true);
      setError(false);
      const responses = await getCourses(
        GuestConstants.limitCourse,
        (page - 1) * GuestConstants.limitCourse,
      );
      setTotal(responses.total);
      setMaxPage(Math.ceil(responses.total / GuestConstants.limitCourse));
      setListCourses(responses.courses);
      setLoading(false);
      setCurrentPage(page);
    } catch (err) {
      setLoading(false);
      setCurrentPage(page);
      setError(true);
    }
  }, [getCourses]);



  useEffect(() => {
    authAction.turnOnGuestUI();
    setDidMount(true);
  }, []);



  useEffect(() => {
    if (didMount) queryCourses();
  }, [branch, tag, level])



  return (
    <>
      <Head>
        <title>Danh sách khóa học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.wrapPage}>
        <div className={styles.wrapCourse}>
          <Container size="xl" style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "flex-start",
            alignItems: "center"
          }}>
            <p className={styles.desSection}>
              Khóa học
            </p>
            <Group style={{ flexDirection: isTablet ? "column" : "row" }}>
              <Select
                disabled={loading}
                label="Trình độ"
                placeholder="Trình độ"
                data={[
                  { value: "", label: "Tất cả" },
                  { value: CurriculumLevel.Beginer, label: "Sơ cấp" },
                  { value: CurriculumLevel.Intermediate, label: "Trung cấp" },
                  { value: CurriculumLevel.Advance, label: "Cao cấp" }
                ]}
                value={level}
                onChange={value => setLevel(value as any)}
              />
              <Select
                disabled={loading}
                label="Chủ đề"
                placeholder="Chủ đề"
                data={[
                  { value: "", label: "Tất cả" },
                  ...props.tags.map(tag => ({ value: tag.name, label: tag.name }))
                ]}
                value={tag}
                onChange={value => setTag(value as any)}
              />
              <Select
                disabled={loading}
                label="Chi nhánh"
                placeholder="Chi nhánh"
                data={[
                  { value: "", label: "Tất cả" },
                  ...props.branches.map(branch => ({ value: branch.id.toString(), label: branch.name }))
                ]}
                value={branch}
                onChange={value => setBranch(value as any)}
              />
            </Group>
            {loading && (
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

            {!loading && error && (
              <div className={styles.errorContainer}>
                <p>Có lỗi xảy ra, vui lòng thử lại</p>
                <Button
                  color="primary"
                  onClick={() => onClickPaginationPage(currentPage)}>
                  Thử lại
                </Button>
              </div>
            )}

            {!loading &&
              !error &&
              listCourses.length == 0 && (
                <div className={styles.emptyResultContainer}>
                  <p>Không có kết quả</p>
                </div>
              )}

            {!loading &&
              !error &&
              listCourses.length > 0 && (
                <div className={styles.gridCourse}>
                  {listCourses.map((course, index) => (
                    <CourseSale {...course} key={index} />
                  ))}
                </div>
              )}

            <Space h={50} />
            {currentPage > 0 && maxPage > 0 && (
              <Container style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }} p={0}>
                <Pagination
                  className={styles.pagination}
                  page={currentPage}
                  total={maxPage}
                  onChange={(choosedPage: number) => onClickPaginationPage(choosedPage)}
                />
              </Container>
            )}
          </Container>
        </div>
      </div>
    </>
  )
}

export default AllCourseScreen;
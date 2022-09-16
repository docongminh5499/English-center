import moment from "moment";
import Head from "next/head";
import { useCallback, useState } from "react";
import API from "../../../../helpers/api";
import { TeacherConstants, TimeZoneOffset, Url, UserRole } from "../../../../helpers/constants";
import Course from "../../../../models/course.model";
import Pageable from "../../../../models/pageable.model";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";
import { Card, Pagination, Image, Text, Badge, Input, Checkbox, Space } from '@mantine/core';
import styles from "./teacher.module.css";

interface IProps {
  courses?: Partial<Course>[],
  pageable?: Pageable,
  error?: Boolean,
  userRole?: UserRole,
}

const TeacherHomeScreen = (props: IProps) => {

  const formatCourse = useCallback((courses: any) => {
    const result: any = {};
    (courses || []).forEach((course: any) => {
      const key = moment(course.openingDate).utcOffset(TimeZoneOffset).format("MM-YYYY");
      result[key] = result[key] || [];
      result[key].push(course);
    });
    return result;
  }, []);


  const [error, setError] = useState(props.error || false);
  const [loading, setLoading] = useState(false);
  const [maxPage, setMaxPage] = useState(Math.ceil((
    props.pageable?.total || 1) / (props.pageable?.limit || TeacherConstants.limitCourse)));
  const [currentPage, setCurrentPage] = useState(1);
  const [course, setCourse] = useState<any>(formatCourse(props.courses));
  const [authState] = useAuth();


  const getCourse = useCallback(async (limit: number, skip: number) => {
    setError(false);
    const responses = await API.get(Url.teachers.getCourse, {
      token: authState.token,
      limit: limit,
      skip: skip,
    });
    const result = formatCourse(responses.courses);
    setCourse(result);
    setMaxPage(Math.ceil(responses.total / responses.limit));
  }, []);


  const onClickPaginationPage = useCallback(async (page: number) => {
    try {
      if (page < 1) return;
      setLoading(true);
      await getCourse(TeacherConstants.limitCourse, (page - 1) * TeacherConstants.limitCourse);
      setLoading(false);
      setCurrentPage(page);
    } catch (err) {
      setLoading(false);
      setCurrentPage(page);
      setError(true);
    }
  }, []);


  return (
    <>
      <Head>
        <title>Trang chủ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.teacherHomePage}>
        <p className={styles.title}>Danh sách khóa học</p>
        <Space h="md" />
        <div className={styles.filterComponent}>
          <div>
            <Input
              placeholder="Tên khóa học"
            />
          </div>
          <div>
            <Checkbox
              label="Đang diễn ra"
            />
            <Checkbox
              label="Đã kết thúc"
            />
          </div>
          <div>
            <Checkbox
              label="Khóa ngắn hạn"
            />
            <Checkbox
              label="Khóa dài hạn"
            />
          </div>
          <div className={styles.filterButtons}>
            <Button>Lọc khóa học</Button>
            <Button color="gray">Xóa bộ lọc</Button>
          </div>
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
              <Button color="primary" onClick={() => onClickPaginationPage(currentPage)}>Thử lại</Button>
            </div>
          )}

          {!loading &&
            !error &&
            Object.keys(course).map((key, sectionIndex) => {
              const [month, year] = key.split("-");
              return (
                <div className={styles.courseDateBasedSection} key={sectionIndex}>
                  <p className={styles.date}>
                    Tháng {month.padStart(2, "0")} năm {year}
                  </p>
                  <div className={styles.courseContainer}>
                    {course[key].map((courseInfo: Course) => {
                      return (
                        <Card
                          key={courseInfo.id}
                          className={styles.courseCard}
                          shadow="sm" p="lg" radius="md" withBorder
                          onClick={() => console.log("Clicked")}>
                          <Card.Section>
                            <Image
                              src="/assets/images/no_image.png"
                              height={180}
                              alt="image-course"
                            />
                          </Card.Section>
                          <div className={styles.courseInfo}>
                            <Text weight={600} align="center" className={styles.courseName}>
                              {courseInfo.name}
                            </Text>
                            <Text size="sm" color="dimmed" align="center">
                              Mã lớp: {courseInfo.id.toString().padStart(6, "0")}
                            </Text>
                            {moment().utc().diff(moment(courseInfo.closingDate)) > 0 ? (
                              <Badge color="green" variant="light">
                                Đang diễn ra
                              </Badge>
                            ) : (
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

          {currentPage > 0 && (
            <Pagination
              className={styles.pagination}
              page={currentPage}
              total={maxPage}
              onChange={onClickPaginationPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TeacherHomeScreen;

import moment from "moment";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import API from "../../../../helpers/api";
import { TeacherConstants, TimeZoneOffset, Url, UserRole } from "../../../../helpers/constants";
import Course from "../../../../models/course.model";
import Pageable from "../../../../models/pageable.model";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import CourseCard from "../../../commons/CourseCard";
import Layout from "../../../commons/Layout";
import Loading from "../../../commons/Loading";
import Pagination from "../../../commons/Pagination";
import Sidebar from "../../../commons/Sidebar";
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
    courses.forEach((course: any) => {
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
      <Layout displaySidebar={true} userRole={props.userRole}>
        <div className={styles.teacherHomePage}>
          <p className={styles.title}>Danh sách khóa học</p>
          {/* TODO: Filter component */}
          <div className={styles.filterComponent}></div>

          <div className={styles.courseList}>
            {loading && (
              <div className={styles.loadingContainer}>
                <Loading />
              </div>
            )}

            {!loading && error && (
              <div className={styles.errorContainer}>
                <p>Có lỗi xảy ra, vui lòng thử lại</p>
                <Button theme="primary" onClick={() => onClickPaginationPage(currentPage)}>Thử lại</Button>
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
                      {course[key].map((courseInfo: any) => {
                        return (
                          <CourseCard
                            key={courseInfo.id}
                            courseId={courseInfo.id}
                            name={courseInfo.name}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            {currentPage > 0 && (
              <Pagination
                currentPage={currentPage}
                maxPage={maxPage}
                onClick={onClickPaginationPage}
              />
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default TeacherHomeScreen;

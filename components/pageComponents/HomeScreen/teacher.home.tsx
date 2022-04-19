import { useCallback, useEffect, useState } from "react";
import API from "../../../helpers/api";
import { Url } from "../../../helpers/constants";
import { useAuth } from "../../../stores/Auth";
import Button from "../../commons/Button";
import CourseCard from "../../commons/CourseCard";
import Loading from "../../commons/Loading";
import Pagination from "../../commons/Pagination";
import styles from "./teacher.module.css";

const TeacherHome = () => {
  const limit = 4;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [maxPage, setMaxPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [course, setCourse] = useState<any>({});
  const [authState] = useAuth();

  const getCourse = useCallback(async (limit: number, skip: number) => {
    setError(false);
    const result: any = {};
    const responses = await API.get(Url.teachers.getCourse, {
      token: authState.token,
      limit: limit,
      skip: skip,
    });

    responses.courses.forEach((course: any) => {
      const date = new Date(course.openingDate);
      const key = `${date.getMonth()}-${date.getFullYear()}`;
      result[key] = result[key] || [];
      result[key].push(course);
    });
    setCourse(result);
    setMaxPage(Math.ceil(responses.total / responses.limit));
  }, []);

  const onClickPaginationPage = useCallback(async (page: number) => {
    try {
      if (page < 1) return;
      setLoading(true);
      await getCourse(limit, (page - 1) * limit);
      setLoading(false);
      setCurrentPage(page);
    } catch (err) {
      setLoading(false);
      setCurrentPage(page);
      setError(true);
    }
  }, []);

  useEffect(() => {
    async function componentDidMount() {
      try {
        await getCourse(limit, currentPage * limit);
        setLoading(false);
        setCurrentPage(1);
      } catch (err) {
        setLoading(false);
        setCurrentPage(1);
        setError(true);
      }
    }
    componentDidMount();
  }, []);

  return (
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
            <Button theme="primary">Thử lại</Button>
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
  );
};

export default TeacherHome;

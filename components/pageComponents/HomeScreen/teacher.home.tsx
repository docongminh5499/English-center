import CourseCard from "../../commons/CourseCard";
import Pagination from "../../commons/Pagination";
import styles from "./teacher.module.css";

const TeacherHome = () => {
  return (
    <div className={styles.teacherHomePage}>
      <p className={styles.title}>Danh sách khóa học</p>
      {/* TODO: Filter component */}
      <div className={styles.filterComponent}></div>

      <div className={styles.courseList}>
        <div className={styles.courseDateBasedSection}>
          <p className={styles.date}>Tháng 01 năm 2022</p>
          <div className={styles.courseContainer}>
            <CourseCard />
            <CourseCard />
            <CourseCard />
            <CourseCard />
            <CourseCard />
          </div>
        </div>
        <div className={styles.courseDateBasedSection}>
          <p className={styles.date}>Tháng 12 năm 2021</p>
          <div className={styles.courseContainer}>
            <CourseCard />
            <CourseCard />
            <CourseCard />
          </div>
        </div>

        <Pagination
          currentPage={2}
          maxPage={6}
          onClick={(page) => console.log(page)}
        />
      </div>
    </div>
  );
};

export default TeacherHome;

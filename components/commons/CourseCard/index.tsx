import Link from "next/link";
import styles from "./courseCard.module.css";

interface IProps {
  imgSrc?: string;
  name?: string;
  courseId?: string;
}

const CourseCard = (props: IProps) => {
  const {
    imgSrc = "/assets/images/no_image.png",
    name = "Chưa cập nhật",
    courseId = "Chưa cập nhật",
  } = props;
  return (
    <Link href={"#!"} passHref>
      <div className={styles.courseContainer}>
        <div className={styles.imageContainer}>
          <img src={imgSrc} alt={"thumbnail course " + name} />
        </div>
        <div className={styles.courseInfo}>
          <p className={styles.courseName}>{name}</p>
          <p className={styles.courseId}>{courseId}</p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;

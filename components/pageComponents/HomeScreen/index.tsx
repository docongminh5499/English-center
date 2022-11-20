import Head from "next/head";
import { UserRole } from "../../../helpers/constants";
import styles from "./home.module.css";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";
import { useAuth } from "../../../stores/Auth";
import ListCourseScreen from "../ListCourse";
import { Course } from "../../../models/course.model";
import Tag from "../../../models/tag.model";
import Branch from "../../../models/branch.model";
import MaskedComment from "../../../models/maskedComment.model";


interface IProps {
  courses: Course[];
  studentCounts: number;
  courseCounts: number;
  curriculumTags: Tag[];
  branches: Branch[];
  comments: MaskedComment[];
  userRole?: UserRole | null;
}


const HomeScreen = (props: IProps) => {
  const [authState] = useAuth();
  const [didMount, setDidMount] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (authState.loggingOut) return;
    // Redirect depending on their roles
    if (props.userRole === UserRole.TEACHER)
      router.replace("/teacher/course");
    else if (props.userRole === UserRole.EMPLOYEE)
      router.replace("/employee/course");
    else if (props.userRole === UserRole.STUDENT && authState.guestUI === false)
      router.push("/student/timetable");
    else if (props.userRole === UserRole.TUTOR)
      router.push("/tutor/course");
    else if (props.userRole === UserRole.PARENT && authState.guestUI === false)
      router.push("/parent/timetable");
    !didMount && setDidMount(true);
  }, [props.userRole, authState.guestUI]);


  const isShowGuestUI = useCallback((): boolean => {
    if (!didMount) return false;
    if (props.userRole === UserRole.GUEST) return true;
    if ((props.userRole === UserRole.PARENT ||
      props.userRole === UserRole.STUDENT) && authState.guestUI) return true;
    return false;
  }, [didMount, props.userRole, authState.guestUI]);


  return (
    <>
      <Head>
        <title>Trang chủ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!isShowGuestUI() && (<LoadingScreen />)}
      {isShowGuestUI() && (<ListCourseScreen {...props} />)}
    </>
  );
};

export default HomeScreen;

import StudentDetailsScreen from "../../../../../components/pageComponents/TeacherScreen/StudentDetailsScreen";
import { GetServerSideProps } from "next";
import { CookieKey, Url, UserRole } from "../../../../../helpers/constants";
import { CustomNextPage } from "../../../../../interfaces/page.interface";
import { CookieParser } from "../../../../../helpers/cookieParser";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import API from "../../../../../helpers/api";

const StudentDetailCourseScreen: CustomNextPage = (props) => {
  return <StudentDetailsScreen makeUpLessons={[]} student={null} doExercises={[]} attendences={[]} {...props} />;
};

StudentDetailCourseScreen.allowUsers = [
  UserRole.TEACHER,
];
export default StudentDetailCourseScreen;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };

  try {
    const responses = await API.post(Url.teachers.getStudentDetails, {
      token: user.token,
      courseSlug: context.params?.courseSlug,
      studentId: context.params?.studentId
    });
    return {
      props: {
        userRole: user.role || null,
        student: responses.student,
        doExercises: responses.doExercises,
        attendences: responses.attendences,
        makeUpLessons: responses.makeUpLessons
      }
    };
  } catch (error: any) {
    return {
      props: {
        userRole: user.role || null,
        student: null,
        doExercises: [],
        attendences: [],
        makeUpLessons: []
      }
    }
  };
}
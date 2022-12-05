import StudentDetailsScreen from "../../../../../components/pageComponents/TutorScreen/StudentDetailsScreen";
import { GetServerSideProps } from "next";
import { CookieKey, Url, UserRole } from "../../../../../helpers/constants";
import { CustomNextPage } from "../../../../../interfaces/page.interface";
import { CookieParser } from "../../../../../helpers/cookieParser";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import API from "../../../../../helpers/api";

const StudentDetailCourseScreen: CustomNextPage = (props) => {
  return <StudentDetailsScreen student={null} {...props} />;
};

StudentDetailCourseScreen.allowUsers = [
  UserRole.TUTOR,
];
export default StudentDetailCourseScreen;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };

  try {
    const responses = await API.post(Url.tutors.getStudentDetails, {
      token: user.token,
      courseSlug: context.params?.courseSlug,
      studentId: context.params?.studentId
    });
    return {
      props: {
        userRole: user.role || null,
        student: responses.student,
      }
    };
  } catch (error: any) {
    return {
      props: {
        userRole: user.role || null,
        student: null,
      }
    }
  };
}
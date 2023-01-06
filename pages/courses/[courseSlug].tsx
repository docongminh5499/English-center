import { GetServerSideProps } from "next";
import DetailsCourseScreen from "../../components/pageComponents/DetailsCourse";
import API from '../../helpers/api';
import { CookieKey, Url, UserRole } from "../../helpers/constants";
import { CookieParser } from "../../helpers/cookieParser";
import { CustomNextPage } from "../../interfaces/page.interface";

const ListCourse: CustomNextPage = (props) => {
  return <DetailsCourseScreen isAttended={false} course={null} countStudent={0} {...props} />;
};

ListCourse.allowUsers = [
  UserRole.GUEST,
  UserRole.PARENT,
  UserRole.STUDENT,
];
ListCourse.displaySidebar = false;
export default ListCourse;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const [course, isAttended, countStudent] = await Promise.all([
      API.post(Url.guests.getCourseDetail, { courseSlug: context.params?.courseSlug }),
      API.post(Url.guests.checkAttendCourse, {
        token: user.token,
        courseSlug: context.params?.courseSlug,
        studentId: user.userId
      }),
      API.post(Url.guests.countStudentAttendCourse, { courseSlug: context.params?.courseSlug }),
    ]);
    return { props: { userRole: user.role || null, course: course, isAttended: isAttended, countStudent: countStudent } };
  } catch (error: any) {
    return { props: { userRole: user.role || null, course: null, isAttended: false, countStudent: 0 } }
  };
}
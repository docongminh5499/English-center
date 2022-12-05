import { GetServerSideProps } from "next";
import EmployeeModifyCourseScreen from "../../../../components/pageComponents/EmployeeScreen/EmployeeModifyCourseScreen";
import API from "../../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../../helpers/constants";
import { CookieParser } from "../../../../helpers/cookieParser";
import { CustomNextPage } from "../../../../interfaces/page.interface";

const ModifyCourseDetail: CustomNextPage = (props) => {
  return <EmployeeModifyCourseScreen participationCount={0} userEmployee={null} userRole={null} course={null} {...props} />
}

ModifyCourseDetail.allowUsers = [
  UserRole.EMPLOYEE
];
export default ModifyCourseDetail;




export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    let [userEmployee, course, participations] = await Promise.all([
      API.get(Url.employees.getPersonalInformation, { token: user.token }),
      API.get(Url.employees.getCourseDetail + context.params?.courseSlug, { token: user.token }),
      API.post(Url.employees.getStudents, {
        token: user.token, limit: 0, skip: 0, courseSlug: context.params?.courseSlug, query: undefined
      })
    ]);
    if (course.closingDate !== null && course.closingDate !== undefined) course = null;
    if (course.lockTime !== null && course.lockTime !== undefined) course = null;
    return {
      props: {
        userRole: user.role,
        userEmployee: userEmployee,
        course: course,
        participationCount: participations.total,
      }
    };
  } catch (error: any) {
    return {
      props: {
        userRole: user.role || null,
        userEmployee: null,
        course: null,
        participationCount: 0,
      }
    };
  };
}
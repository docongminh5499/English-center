import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import EmployeeCreateCourseScreen from "../../../components/pageComponents/EmployeeScreen/EmployeeCreateCourseScreen";
import API from "../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const EmployeeCreateCoursePage: CustomNextPage = (props) => {
  return <EmployeeCreateCourseScreen curriculums={[]} userEmployee={null} {...props} />;
};

EmployeeCreateCoursePage.allowUsers = [
  UserRole.EMPLOYEE,
];
export default EmployeeCreateCoursePage;



export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const [userEmployee, curriculums] = await Promise.all([
      API.get(Url.employees.getPersonalInformation, { token: user.token }),
      API.get(Url.employees.getCurriculumList, { token: user.token }),
    ]);
    return { props: { userRole: user.role, userEmployee: userEmployee, curriculums: curriculums.curriculums } };
  } catch (error: any) {
    return { props: { userRole: user.role || null, userEmployee: null, curriculums: [] } };
  }
});
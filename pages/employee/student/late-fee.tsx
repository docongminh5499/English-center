import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import EmployeeLateFeeStudentScreen from "../../../components/pageComponents/EmployeeScreen/EmployeeLateFeeStudentScreen";
import API from "../../../helpers/api";
import { CookieKey, EmployeeConstants, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const LateFeeStudentPage: CustomNextPage = (props) => {
  return <EmployeeLateFeeStudentScreen total={null} students={[]} userRole={null} {...props} />;
};

LateFeeStudentPage.allowUsers = [
  UserRole.EMPLOYEE,
];
export default LateFeeStudentPage;


export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const responses = await API.post(Url.employees.getLateFeeStudent, {
      token: user.token,
      skip: 0,
      limit: EmployeeConstants.limitStudent
    });
    return { props: { userRole: user.role, students: responses.students, total: responses.total } };
  } catch (error: any) {
    return { props: { userRole: user.role || null, students: [], total: null } };
  }
}
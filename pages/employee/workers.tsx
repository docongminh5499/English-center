import { GetServerSideProps } from "next";
import EmployeeWorkersScreen from "../../components/pageComponents/EmployeeScreen/EmployeeWorkersScreen";
import API from "../../helpers/api";
import { CookieKey, EmployeeConstants, Url, UserRole } from "../../helpers/constants";
import { CookieParser } from "../../helpers/cookieParser";
import { CustomNextPage } from "../../interfaces/page.interface";


const EmployeeWorkersPage: CustomNextPage = (props) => {
  return <EmployeeWorkersScreen teachers={{
    total: 0,
    teachers: []
  }} branch={null} {...props} />;
};

EmployeeWorkersPage.allowUsers = [
  UserRole.EMPLOYEE,
];
export default EmployeeWorkersPage;


export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const [teachers, userEmployee] = await Promise.all([
      API.post(Url.employees.getTeachersByBranch, { token: user.token, skip: 0, limit: EmployeeConstants.limitTeacher }),
      API.get(Url.employees.getPersonalInformation, { token: user.token }),
    ]);
    return {
      props: {
        userRole: user.role,
        teachers: teachers,
        branch: userEmployee.worker.branch,
      }
    };
  } catch (error: any) {
    return {
      props: {
        userRole: user.role || null,
        teachers: null,
        branch: null
      }
    };
  }
}
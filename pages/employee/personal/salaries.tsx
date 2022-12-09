import { GetServerSideProps } from "next";
import EmployeeSalaryScreen from "../../../components/pageComponents/EmployeeScreen/EmployeeSalaryScreen";
import API from "../../../helpers/api";
import { CookieKey, EmployeeConstants, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const EmployeeSalaryPage: CustomNextPage = (props) => {
  return <EmployeeSalaryScreen salaries={{
    total: 0,
    salaries: []
  }} {...props} />;
};

EmployeeSalaryPage.allowUsers = [
  UserRole.EMPLOYEE,
];
export default EmployeeSalaryPage;


export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const salaries = await API.post(Url.employees.getSalaries, { token: user.token, skip: 0, limit: EmployeeConstants.limitSalary });
    return {
      props: {
        userRole: user.role,
        salaries: salaries,
      }
    };
  } catch (error: any) {
    return {
      props: {
        userRole: user.role || null,
        salaries: null
      }
    };
  }
}
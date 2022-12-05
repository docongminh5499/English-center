import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import TeacherSalaryScreen from "../../../components/pageComponents/TeacherScreen/TeacherSalaryScreen";
import API from "../../../helpers/api";
import { CookieKey, TeacherConstants, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const TeacherSalaryPage: CustomNextPage = (props) => {
  return <TeacherSalaryScreen salaries={{
    total: 0,
    salaries: []
  }} {...props} />;
};

TeacherSalaryPage.allowUsers = [
  UserRole.TEACHER,
];
export default TeacherSalaryPage;


export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const salaries = await API.post(Url.teachers.getSalaries, { token: user.token, skip: 0, limit: TeacherConstants.limitSalary });
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
        salaries: []
      }
    };
  }
}
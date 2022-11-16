import { GetServerSideProps } from "next";
import TeacherPersonalScreen from "../../../components/pageComponents/TeacherScreen/TeacherPersonalScreen";
import { CookieKey, TeacherConstants, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import API from "../../../helpers/api";

const TeacherPersonalInformationPage: CustomNextPage = (props) => {
  return <TeacherPersonalScreen salaries={{
    total: 0,
    salaries: []
  }} userTeacher={null} {...props} />;
};

TeacherPersonalInformationPage.allowUsers = [
  UserRole.TEACHER,
];
export default TeacherPersonalInformationPage;


export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const [userTeacher, salaries] = await Promise.all([
      API.get(Url.teachers.getPersonalInformation, { token: user.token }),
      API.post(Url.teachers.getSalaries, { token: user.token, skip: 0, limit: TeacherConstants.maxTopSalary }),
    ]);
    return {
      props: {
        userRole: user.role,
        userTeacher: userTeacher,
        salaries: salaries,
      }
    };
  } catch (error: any) {
    return {
      props: {
        userRole: user.role || null,
        userTeacher: null,
        salaries: null
      }
    };
  }
})
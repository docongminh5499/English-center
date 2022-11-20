import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import TutorSalaryScreen from "../../../components/pageComponents/TutorScreen/TutorSalaryScreen";
import API from "../../../helpers/api";
import { CookieKey, TutorConstants, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const TutorSalaryPage: CustomNextPage = (props) => {
  return <TutorSalaryScreen salaries={{
    total: 0,
    salaries: []
  }} {...props} />;
};

TutorSalaryPage.allowUsers = [
  UserRole.TUTOR,
];
export default TutorSalaryPage;


export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const salaries = await API.post(Url.tutors.getSalaries, { token: user.token, skip: 0, limit: TutorConstants.limitSalary });
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
})
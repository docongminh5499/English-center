import { GetServerSideProps } from "next";
import { CookieKey, StudentConstants, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import API from "../../../helpers/api";
import StudentPersonalScreen from "../../../components/pageComponents/StudentScreen/StudentPersonalScreen";

const StudentPersonalInformationPage: CustomNextPage = (props) => {
  return <StudentPersonalScreen userStudent={null} {...props} />;
};

StudentPersonalInformationPage.allowUsers = [
  UserRole.STUDENT,
];
export default StudentPersonalInformationPage;


export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    console.log(user)
    const userStudent = await API.get(Url.students.getPersonalInformation,  { token: user.token });
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    const paymentHistory = await API.get(Url.students.getPaymentHistory,  { token: user.token, limit: StudentConstants.limitFee, skip: 0 });
    console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
    return {
      props: {
        userRole: user.role,
        userStudent: userStudent,
        payments: paymentHistory,
      }
    };
  } catch (error: any) {
    console.log(error)
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    return {
      props: {
        userRole: user.role || null,
        userStudent: null,
        payments: null,
      }
    };
  }
}
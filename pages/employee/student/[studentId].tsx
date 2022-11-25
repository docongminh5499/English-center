import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import StudentDetailsScreen from "../../../components/pageComponents/EmployeeScreen/StudentDetailsScreen";
import API from "../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const StudentDetailPage: CustomNextPage = (props) => {
  return <StudentDetailsScreen unpaidFees={[]} student={null} {...props} />;
};

StudentDetailPage.allowUsers = [
  UserRole.EMPLOYEE,
];
export default StudentDetailPage;

export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };

  try {
    const [studentInfo, unpaidFees] = await Promise.all([
      API.post(Url.employees.getStudentDetails, {
        token: user.token,
        studentId: context.params?.studentId
      }),
      API.post(Url.employees.getUnpaidFee, {
        token: user.token,
        studentId: context.params?.studentId
      }),
    ]);

    return {
      props: {
        userRole: user.role || null,
        student: studentInfo.student,
        unpaidFees: unpaidFees,
      }
    };
  } catch (error: any) {
    return {
      props: {
        userRole: user.role || null,
        student: null,
        unpaidFees: [],
      }
    }
  };
})
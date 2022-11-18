import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import EmployeeTransactionScreen from "../../components/pageComponents/EmployeeScreen/EmployeeTransactionScreen";
import API from "../../helpers/api";
import { CookieKey, EmployeeConstants, Url, UserRole } from "../../helpers/constants";
import { CookieParser } from "../../helpers/cookieParser";
import { CustomNextPage } from "../../interfaces/page.interface";

const EmployeeTransactionPage: CustomNextPage = (props) => {
  return <EmployeeTransactionScreen branch={null} fees={{
    total: 0,
    fees: []
  }} {...props} />;
};

EmployeeTransactionPage.allowUsers = [
  UserRole.EMPLOYEE,
];
export default EmployeeTransactionPage;


export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const [fees, userEmployee] = await Promise.all([
      API.post(Url.employees.getFeesByBranch, { token: user.token, skip: 0, limit: EmployeeConstants.limitFee }),
      API.get(Url.employees.getPersonalInformation, { token: user.token }),
    ]);
    return {
      props: {
        userRole: user.role,
        fees: fees,
        branch: userEmployee.worker.branch,
      }
    };
  } catch (error: any) {
    return {
      props: {
        userRole: user.role || null,
        fees: null,
        branch: null
      }
    };
  }
})
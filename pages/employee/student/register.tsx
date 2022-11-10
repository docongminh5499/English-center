import { GetServerSideProps } from "next";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import EmployeeRegisterScreen from "../../../components/pageComponents/EmployeeScreen/EmployeeRegisterScreen";
import { CustomNextPage } from "../../../interfaces/page.interface";
import { CookieKey, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";

const Register: CustomNextPage = (props) => {
  return <EmployeeRegisterScreen {...props} />;
};

Register.allowUsers = [UserRole.EMPLOYEE];
export default Register;

export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  return { props: { userRole: user.role || null } };
})
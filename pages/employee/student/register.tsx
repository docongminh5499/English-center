import { GetServerSideProps } from "next";
import EmployeeRegisterScreen from "../../../components/pageComponents/EmployeeScreen/EmployeeRegisterScreen";
import { CookieKey, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const Register: CustomNextPage = (props) => {
  return <EmployeeRegisterScreen {...props} />;
};

Register.allowUsers = [UserRole.EMPLOYEE];
export default Register;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  return { props: { userRole: user.role || null } };
}
import { GetServerSideProps } from "next";
import RegisterScreen from "../components/pageComponents/RegisterScreen";
import { CookieKey, UserRole } from "../helpers/constants";
import { CookieParser } from "../helpers/cookieParser";
import { CustomNextPage } from "../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";

const Register: CustomNextPage = (props) => {
  return <RegisterScreen {...props} />;
};

Register.allowUsers = [UserRole.GUEST,];
Register.displaySidebar = false;
export default Register;

export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : {};
  return { props: { userRole: user.role || null } };
})
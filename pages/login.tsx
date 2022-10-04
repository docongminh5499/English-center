import { GetServerSideProps } from "next";
import LoginScreen from "../components/pageComponents/LoginScreen";
import { CookieKey, UserRole } from "../helpers/constants";
import { CookieParser } from "../helpers/cookieParser";
import { CustomNextPage } from "../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";

const Login: CustomNextPage = (props) => {
  return <LoginScreen {...props} />;
};

Login.allowUsers = [UserRole.GUEST];
Login.displaySidebar = false;
export default Login;

export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : {};
  return { props: { userRole: user.role || null } };
})

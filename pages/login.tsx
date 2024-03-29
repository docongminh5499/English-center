import { GetServerSideProps } from "next";
import LoginScreen from "../components/pageComponents/LoginScreen";
import { CookieKey, UserRole } from "../helpers/constants";
import { CookieParser } from "../helpers/cookieParser";
import { CustomNextPage } from "../interfaces/page.interface";

const Login: CustomNextPage = (props) => {
  return <LoginScreen {...props} />;
};

Login.allowUsers = [UserRole.GUEST];
Login.displaySidebar = false;
export default Login;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  return { props: { userRole: user.role || null } };
}

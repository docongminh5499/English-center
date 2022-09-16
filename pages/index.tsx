import HomeScreen from "../components/pageComponents/HomeScreen";
import { GetServerSideProps } from "next";
import { CookieKey, UserRole } from "../helpers/constants";
import { CustomNextPage } from "../interfaces/page.interface";
import { CookieParser } from "../helpers/cookieParser";

const Home: CustomNextPage = (props) => {
  return <HomeScreen {...props} />;
};

Home.allowUsers = [
  UserRole.GUEST,
  UserRole.ADMIN,
  UserRole.EMPLOYEE,
  UserRole.PARENT,
  UserRole.STUDENT,
  UserRole.TEACHER,
  UserRole.TUTOR,
];
Home.displaySidebar = false;
export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : {};
  return { props: { userRole: user.role || null } };
}
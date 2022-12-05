import NotFoundScreen from "../components/pageComponents/NotFoundScreen";
import { CustomNextPage } from "../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import { CookieParser } from "../helpers/cookieParser";
import { CookieKey, UserRole } from "../helpers/constants";

const NotFound: CustomNextPage = (props) => {
  return <NotFoundScreen {...props} />;
};

NotFound.displaySidebar = false;
export default NotFound;


export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  return { props: { userRole: user.role || null } };
}
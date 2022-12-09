
import { GetServerSideProps } from "next";
import NotificationScreen from "../components/pageComponents/NotificationScreen";
import { CookieKey, UserRole } from "../helpers/constants";
import { CookieParser } from "../helpers/cookieParser";
import { CustomNextPage } from "../interfaces/page.interface";

const Notification: CustomNextPage = (props) => {
    return <NotificationScreen {...props} />
}

Notification.allowUsers = [
    UserRole.ADMIN,
    UserRole.EMPLOYEE,
    UserRole.PARENT,
    UserRole.STUDENT,
    UserRole.TEACHER,
    UserRole.TUTOR,
];
export default Notification;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    return { props: { userRole: user.role || null } };
}
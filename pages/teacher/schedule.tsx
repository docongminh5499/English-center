import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import TeacherScheduleScreen from "../../components/pageComponents/TeacherScreen/TeacherScheduleScreen";
import { CookieKey, UserRole } from "../../helpers/constants";
import { CookieParser } from "../../helpers/cookieParser";
import { CustomNextPage } from "../../interfaces/page.interface";

const TeacherSchedulePage: CustomNextPage = (props) => {
    return <TeacherScheduleScreen {...props} />;
};

TeacherSchedulePage.allowUsers = [
    UserRole.TEACHER,
];
export default TeacherSchedulePage;


export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    return { props: { userRole: user.role || null } };
})
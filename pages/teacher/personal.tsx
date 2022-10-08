import { GetServerSideProps } from "next";
import TeacherPersonalScreen from "../../components/pageComponents/TeacherScreen/TeacherPersonalScreen";
import { CookieKey, UserRole } from "../../helpers/constants";
import { CookieParser } from "../../helpers/cookieParser";
import { CustomNextPage } from "../../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";

const TeacherPersonalInformationPage: CustomNextPage = (props) => {
    return <TeacherPersonalScreen {...props} />;
};

TeacherPersonalInformationPage.allowUsers = [
    UserRole.TEACHER,
];
export default TeacherPersonalInformationPage;


export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    return { props: { userRole: user.role || null } };
})
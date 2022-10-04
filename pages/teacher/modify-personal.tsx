import TeacherModifyPersonalScreen from "../../components/pageComponents/TeacherScreen/ModifyPersonalScreen";
import { CookieKey, UserRole } from "../../helpers/constants";
import { CustomNextPage } from "../../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import { CookieParser } from "../../helpers/cookieParser";

const TeacherPersonalInformationModifyPage: CustomNextPage = (props) => {
    return <TeacherModifyPersonalScreen {...props} />;
};

TeacherPersonalInformationModifyPage.allowUsers = [
    UserRole.TEACHER,
];
export default TeacherPersonalInformationModifyPage;



export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : {};
    return { props: { userRole: user.role || null } };
})
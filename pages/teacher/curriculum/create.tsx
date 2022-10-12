import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import TeacherCurriculumAddScreen from "../../../components/pageComponents/TeacherScreen/TeacherCurriculumAddScreen";
import { CookieKey, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const CurriculumAddPage: CustomNextPage = (props) => {
    return <TeacherCurriculumAddScreen {...props} />
}

CurriculumAddPage.allowUsers = [
    UserRole.ADMIN,
    UserRole.TEACHER,
];
export default CurriculumAddPage;




export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    return { props: { userRole: user.role || null } }
});
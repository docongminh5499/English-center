import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import TeacherCurriculumModifyScreen from "../../../../components/pageComponents/TeacherScreen/TeacherCurriculumModifyScreen";
import API from "../../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../../helpers/constants";
import { CookieParser } from "../../../../helpers/cookieParser";
import { CustomNextPage } from "../../../../interfaces/page.interface";

const CurriculumModifyPage: CustomNextPage = (props) => {
    return <TeacherCurriculumModifyScreen curriculum={null} {...props} />
}

CurriculumModifyPage.allowUsers = [
    UserRole.ADMIN,
    UserRole.TEACHER,
];
export default CurriculumModifyPage;




export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };

    try {
        const responses = await API.get(Url.teachers.getCurriculum + context.params?.curriculumId, { token: user.token });
        return { props: { userRole: user.role || null, curriculum: responses } };
    } catch (error: any) {
        return { props: { userRole: user.role || null, curriculum: null } }
    };
});
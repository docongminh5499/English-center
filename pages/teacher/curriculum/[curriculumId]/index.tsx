import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import TeacherCurriculumDetailScreen from "../../../../components/pageComponents/TeacherScreen/TeacherCurriculumDetailScreen";
import API from "../../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../../helpers/constants";
import { CookieParser } from "../../../../helpers/cookieParser";
import { CustomNextPage } from "../../../../interfaces/page.interface";

const CurriculumDetailPage: CustomNextPage = (props) => {
    return <TeacherCurriculumDetailScreen  curriculum={null} {...props} />
}

CurriculumDetailPage.allowUsers = [
    UserRole.ADMIN,
    UserRole.TEACHER,
];
export default CurriculumDetailPage;




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
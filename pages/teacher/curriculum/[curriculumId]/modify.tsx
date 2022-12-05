import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import TeacherCurriculumModifyScreen from "../../../../components/pageComponents/TeacherScreen/TeacherCurriculumModifyScreen";
import API from "../../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../../helpers/constants";
import { CookieParser } from "../../../../helpers/cookieParser";
import { CustomNextPage } from "../../../../interfaces/page.interface";

const CurriculumModifyPage: CustomNextPage = (props) => {
    return <TeacherCurriculumModifyScreen tags={[]} curriculum={null} {...props} />
}

CurriculumModifyPage.allowUsers = [
    UserRole.TEACHER,
];
export default CurriculumModifyPage;




export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };

    try {
        const [curriculum, tags] = await Promise.all([
            API.get(Url.teachers.getCurriculum + context.params?.curriculumId, { token: user.token }),
            API.get(Url.teachers.getCurriculumTags, { token: user.token }),
        ])
        return { props: { userRole: user.role || null, curriculum: curriculum, tags: tags } };
    } catch (error: any) {
        return { props: { userRole: user.role || null, curriculum: null, tags: [] } }
    };
}
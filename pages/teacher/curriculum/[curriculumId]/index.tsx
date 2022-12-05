import { GetServerSideProps } from "next";
import TeacherCurriculumDetailScreen from "../../../../components/pageComponents/TeacherScreen/TeacherCurriculumDetailScreen";
import API from "../../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../../helpers/constants";
import { CookieParser } from "../../../../helpers/cookieParser";
import { CustomNextPage } from "../../../../interfaces/page.interface";

const CurriculumDetailPage: CustomNextPage = (props) => {
    return <TeacherCurriculumDetailScreen isPreferred={false} curriculum={null} {...props} />
}

CurriculumDetailPage.allowUsers = [
    UserRole.TEACHER,
];
export default CurriculumDetailPage;




export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };

    try {
        const [curriculum, isPreferred] = await Promise.all([
            API.get(Url.teachers.getCurriculum + context.params?.curriculumId, { token: user.token }),
            API.post(Url.teachers.checkPreferredCurriculums, { token: user.token, curriculumId: context.params?.curriculumId }),
        ]);
        return { props: { userRole: user.role || null, curriculum: curriculum, isPreferred: isPreferred } };
    } catch (error: any) {
        return { props: { userRole: user.role || null, curriculum: null, isPreferred: false } }
    };
}
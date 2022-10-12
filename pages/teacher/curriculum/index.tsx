import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import TeacherCurriculumListScreen from "../../../components/pageComponents/TeacherScreen/TeacherCurriculumListScreen";
import API from "../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const CurriculumListPage: CustomNextPage = (props) => {
    return <TeacherCurriculumListScreen  curriculums={[]} {...props} />
}

CurriculumListPage.allowUsers = [
    UserRole.ADMIN,
    UserRole.TEACHER,
];
export default CurriculumListPage;




export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };

    try {
        const responses = await API.get(Url.teachers.getCurriculumList, { token: user.token });
        return { props: { userRole: user.role || null, curriculums: responses.curriculums } };
    } catch (error: any) {
        return { props: { userRole: user.role || null, curriculums: null } }
    };
});
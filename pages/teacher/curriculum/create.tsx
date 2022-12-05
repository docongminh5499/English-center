import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import TeacherCurriculumAddScreen from "../../../components/pageComponents/TeacherScreen/TeacherCurriculumAddScreen";
import API from "../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const CurriculumAddPage: CustomNextPage = (props) => {
    return <TeacherCurriculumAddScreen tags={[]} {...props} />
}

CurriculumAddPage.allowUsers = [
    UserRole.TEACHER,
];
export default CurriculumAddPage;




export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    try {
        const responses = await API.get(Url.teachers.getCurriculumTags, { token: user.token });
        return { props: { userRole: user.role, tags: responses } };
    } catch (error: any) {
        return { props: { userRole: user.role || null, tags: [] } };
    }
}
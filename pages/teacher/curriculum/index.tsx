import { GetServerSideProps } from "next";
import TeacherCurriculumListScreen from "../../../components/pageComponents/TeacherScreen/TeacherCurriculumListScreen";
import API from "../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const CurriculumListPage: CustomNextPage = (props) => {
    return <TeacherCurriculumListScreen preferredCurriculums={[]} curriculums={[]} {...props} />
}

CurriculumListPage.allowUsers = [
    UserRole.TEACHER,
];
export default CurriculumListPage;




export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };

    try {
        const [curriculums, preferredCurriclumns] = await Promise.all([
            API.get(Url.teachers.getCurriculumList, { token: user.token }),
            API.get(Url.teachers.getPreferredCurriculums, { token: user.token })
        ])
        return {
            props: {
                userRole: user.role || null,
                curriculums: curriculums.curriculums,
                preferredCurriculums: preferredCurriclumns
            }
        };
    } catch (error: any) {
        return {
            props: {
                userRole: user.role || null,
                curriculums: null,
                preferredCurriculums: null
            }
        }
    };
}
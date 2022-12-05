import { GetServerSideProps } from "next";
import TeacherModifyPersonalScreen from "../../components/pageComponents/TeacherScreen/ModifyPersonalScreen";
import API from "../../helpers/api";
import { CookieKey, Url, UserRole } from "../../helpers/constants";
import { CookieParser } from "../../helpers/cookieParser";
import { CustomNextPage } from "../../interfaces/page.interface";

const TeacherPersonalInformationModifyPage: CustomNextPage = (props) => {
    return <TeacherModifyPersonalScreen userTeacher={null} {...props} />;
};

TeacherPersonalInformationModifyPage.allowUsers = [
    UserRole.TEACHER,
];
export default TeacherPersonalInformationModifyPage;



export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    try {
        const responses = await API.get(Url.teachers.getPersonalInformation, { token: user.token });
        return { props: { userRole: user.role, userTeacher: responses } };
    } catch (error: any) {
        return { props: { userRole: user.role || null, userTeacher: null } };
    }
}
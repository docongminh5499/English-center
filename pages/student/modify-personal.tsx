import { CookieKey, Url, UserRole } from "../../helpers/constants";
import { CustomNextPage } from "../../interfaces/page.interface";
import { GetServerSideProps } from "next";
import { CookieParser } from "../../helpers/cookieParser";
import API from "../../helpers/api";
import StudentModifyPersonalScreen from "../../components/pageComponents/StudentScreen/StudentModifyPersonalScreen";

const StudentPersonalInformationModifyPage: CustomNextPage = (props) => {
    return <StudentModifyPersonalScreen userStudent={null} {...props} />;
};

StudentPersonalInformationModifyPage.allowUsers = [
    UserRole.STUDENT,
];
export default StudentPersonalInformationModifyPage;



export const getServerSideProps: GetServerSideProps = (async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    try {
        const userStudent = await API.get(Url.students.getPersonalInformation,  { token: user.token });
        return { props: { userRole: user.role, userStudent: userStudent } };
    } catch (error: any) {
        return { props: { userRole: user.role || null, userStudent: null } };
    }
})
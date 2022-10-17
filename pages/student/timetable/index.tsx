import {CookieKey, Url, UserRole } from "../../../helpers/constants";
import { CustomNextPage } from "../../../interfaces/page.interface";
import StudentHomeScreen from "../../../components/pageComponents/StudentScreen/StudentHomeScreen/student.home";
import { GetServerSideProps } from "next";
import { CookieParser } from "../../../helpers/cookieParser";
import API from "../../../helpers/api";

const StudentHomePage: CustomNextPage = (props) => {
    return <StudentHomeScreen {...props} />;
};

StudentHomePage.allowUsers = [
    UserRole.STUDENT,
];
export default StudentHomePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    try {
        const studentCourses = await API.get(Url.students.getTimetable, {
            token: user.token,
        });
        return { props: { userRole: user.role || null, courses: studentCourses} };
    } catch (error: any) {
        return { props: { userRole: user.role || null, courses: null} }
    };
};
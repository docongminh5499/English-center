import { CustomNextPage } from "../../../interfaces/page.interface";
import StudentCourseContentScreen from "../../../components/pageComponents/StudentScreen/StudentCourseScreen/StudentCourseContentScreen/course.content";
import { GetServerSideProps } from "next";
import { CookieParser } from "../../../helpers/cookieParser";
import API from "../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../helpers/constants";

const StudentCourseContentPage: CustomNextPage = (props) => {
    return <StudentCourseContentScreen course={null} userRole={null} {...props} />;
};

StudentCourseContentPage.allowUsers = [
    UserRole.STUDENT,
];
export default StudentCourseContentPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : {};
    try {
        const responses = await API.get(Url.students.getCourseDetail + context.params?.slug, {
            token: user.token,
        });
        const attendance = await API.get(Url.students.getAttendance + context.params?.slug, {
            token: user.token,
        });
        return { props: { userRole: user.role || null, course: responses, attendance:  attendance} };
    } catch (error: any) {
        return { props: { userRole: user.role || null, course: null, attendance: null } }
    };
};
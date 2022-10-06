import { CookieKey, StudentConstants, Url, UserRole } from "../../../helpers/constants";
import { CustomNextPage } from "../../../interfaces/page.interface";
import StudentCourseScreen from "../../../components/pageComponents/StudentScreen/StudentCourseScreen/course.home";
import { GetServerSideProps } from "next";
import { CookieParser } from "../../../helpers/cookieParser";
import Pageable from "../../../models/pageable.model";
import API from "../../../helpers/api";


const StudentCoursePage: CustomNextPage = (props) => {
    return <StudentCourseScreen {...props} />;
};

StudentCoursePage.allowUsers = [
    UserRole.STUDENT,
];
export default StudentCoursePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : {};

    // Server side rendering for actor teacher
    if (user.role === UserRole.STUDENT) {
        try {
            const responses = await API.get(Url.students.getCourse, {
                token: user.token,
                limit: StudentConstants.limitCourse,
                skip: 0
            });
            const pageable: Pageable = {
                limit: responses.limit,
                skip: responses.skip,
                total: responses.total
            };
            const courses = responses.courses;
            return { props: { userRole: user.role, courses, pageable, error: null } };
        } catch (error: any) {
            return { props: { userRole: user.role, courses: [], pageable: null, error: true } };
        }

    }

    // TODO:  Tutor and admin actor

    // Default property returned for server-side rendering
    return { props: {} };
}
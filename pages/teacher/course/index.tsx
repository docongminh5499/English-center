import { GetServerSideProps } from "next";
import TeacherHomeScreen from "../../../components/pageComponents/TeacherScreen/TeacherHomeScreen/teacher.home";
import API from "../../../helpers/api";
import { CookieKey, TeacherConstants, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";
import Pageable from "../../../models/pageable.model";

const TeacherHomePage: CustomNextPage = (props) => {
    return <TeacherHomeScreen {...props} />;
};

TeacherHomePage.allowUsers = [
    UserRole.TEACHER,
];
export default TeacherHomePage;


export const getServerSideProps: GetServerSideProps = async (context): Promise<any> => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    try {
        const responses = await API.get(Url.teachers.getCourse, {
            token: user.token,
            limit: TeacherConstants.limitCourse,
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
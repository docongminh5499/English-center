import TeacherCourseDetailScreen from "../../../../components/pageComponents/TeacherScreen/TeacherCourseScreen/course.detail";
import { CookieKey, Url, UserRole } from "../../../../helpers/constants";
import { CustomNextPage } from "../../../../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import { CookieParser } from "../../../../helpers/cookieParser";
import API from "../../../../helpers/api";

const CourseDetail: CustomNextPage = (props) => {
    return <TeacherCourseDetailScreen userRole={null} course={null} {...props} />
}

CourseDetail.allowUsers = [
    UserRole.TEACHER,
];
export default CourseDetail;




export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };

    try {
        const responses = await API.get(Url.teachers.getCourseDetail + context.params?.courseSlug, {
            token: user.token,
        });
        return { props: { userRole: user.role || null, course: responses } };
    } catch (error: any) {
        return { props: { userRole: user.role || null, course: null } }
    };
});
import TeacherCourseDetailScreen from "../../../../components/pageComponents/TeacherScreen/TeacherCourseScreen/course.detail";
import { CookieKey, UserRole } from "../../../../helpers/constants";
import { CustomNextPage } from "../../../../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import { CookieParser } from "../../../../helpers/cookieParser";

const CourseDetail: CustomNextPage = (props) => {
    return <TeacherCourseDetailScreen {...props} />
}

CourseDetail.allowUsers = [
    UserRole.ADMIN,
    UserRole.TEACHER,
    UserRole.TUTOR,
];
export default CourseDetail;




export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : {};
    return { props: { userRole: user.role || null } };
})
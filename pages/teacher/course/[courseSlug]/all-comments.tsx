import TeacherCourseCommentScreen from "../../../../components/pageComponents/TeacherScreen/TeacherCourseCommentScreen";
import { CookieKey, Url, UserRole } from "../../../../helpers/constants";
import { CustomNextPage } from "../../../../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import { CookieParser } from "../../../../helpers/cookieParser";
import API from "../../../../helpers/api";

const AllCommentsPage: CustomNextPage = (props) => {
    return <TeacherCourseCommentScreen userRole={null} course={null} {...props} />
}

AllCommentsPage.allowUsers = [
    UserRole.TEACHER,
];
export default AllCommentsPage;



export const getServerSideProps: GetServerSideProps = async (context) => {
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
}
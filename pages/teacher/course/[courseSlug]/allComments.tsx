import TeacherCourseCommentScreen from "../../../../components/pageComponents/TeacherScreen/TeacherCourseCommentScreen";
import { CookieKey, UserRole } from "../../../../helpers/constants";
import { CustomNextPage } from "../../../../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import { CookieParser } from "../../../../helpers/cookieParser";

const AllCommentsPage: CustomNextPage = (props) => {
    return <TeacherCourseCommentScreen {...props} />
}

AllCommentsPage.allowUsers = [
    UserRole.ADMIN,
    UserRole.TEACHER,
    UserRole.TUTOR,
];
export default AllCommentsPage;



export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : {};
    return { props: { userRole: user.role || null } };
})
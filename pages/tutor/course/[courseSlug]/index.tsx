import { GetServerSideProps } from "next";
import TutorCourseDetailScreen from "../../../../components/pageComponents/TutorScreen/TutorCourseDetailScreen/course.detail";
import API from "../../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../../helpers/constants";
import { CookieParser } from "../../../../helpers/cookieParser";
import { CustomNextPage } from "../../../../interfaces/page.interface";

const TutorCouseDetailPage: CustomNextPage = (props) => {
    return <TutorCourseDetailScreen userRole={null} course={null} {...props} />
}

TutorCouseDetailPage.allowUsers = [
    UserRole.TUTOR,
];
export default TutorCouseDetailPage;




export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    try {
        const responses = await API.get(Url.tutors.getCourseDetail + context.params?.courseSlug, {
            token: user.token,
        });
        return { props: { userRole: user.role || null, course: responses } };
    } catch (error: any) {
        return { props: { userRole: user.role || null, course: null } }
    };
}
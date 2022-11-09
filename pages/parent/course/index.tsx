import { GetServerSideProps } from "next";
import ParentCourseScreen from "../../../components/pageComponents/ParentScreen/ParentCourseScreen/course.home";
import API from "../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const ParentCoursePage: CustomNextPage = (props) => {
    return <ParentCourseScreen {...props} />;
};

ParentCoursePage.allowUsers = [
    UserRole.PARENT,
];
export default ParentCoursePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    try {
        const userParent = await API.get(Url.parents.getPersonalInfo, {
            token: user.token,
        });
        return { props: { userRole: user.role || null, parent: userParent} };
    } catch (error: any) {
        return { props: { userRole: user.role || null, parent: null} }
    };
};
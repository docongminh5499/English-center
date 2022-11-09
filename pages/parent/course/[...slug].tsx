import { GetServerSideProps } from "next";
import ParentCourseContentScreen from "../../../components/pageComponents/ParentScreen/ParentCourseScreen/ParentCourseContentScreen/course.content";
import API from "../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const ParentCourseContentPage: CustomNextPage = (props) => {
    return <ParentCourseContentScreen course={null} userRole={null} {...props} />;
};

ParentCourseContentPage.allowUsers = [
    UserRole.PARENT,
];
export default ParentCourseContentPage;
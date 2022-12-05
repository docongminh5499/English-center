import ParentCourseContentScreen from "../../../components/pageComponents/ParentScreen/ParentCourseScreen/ParentCourseContentScreen/course.content";
import { UserRole } from "../../../helpers/constants";
import { CustomNextPage } from "../../../interfaces/page.interface";

const ParentCourseContentPage: CustomNextPage = (props) => {
    return <ParentCourseContentScreen course={null} userRole={null} {...props} />;
};

ParentCourseContentPage.allowUsers = [
    UserRole.PARENT,
];
export default ParentCourseContentPage;
import {  UserRole } from "../../../helpers/constants";
import { CustomNextPage } from "../../../interfaces/page.interface";
import StudentCourseContentScreen from "../../../components/pageComponents/StudentScreen/StudentCourseScreen/StudentCourseContentScreen/course.content";



const StudentCourseContentPage: CustomNextPage = (props) => {
    return <StudentCourseContentScreen {...props} />;
};

StudentCourseContentPage.allowUsers = [
    UserRole.STUDENT,
];
export default StudentCourseContentPage;
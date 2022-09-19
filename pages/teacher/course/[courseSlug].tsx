import TeacherCourseDetailScreen from "../../../components/pageComponents/TeacherScreen/TeacherCourseScreen/course.detail";
import { UserRole } from "../../../helpers/constants";
import { CustomNextPage } from "../../../interfaces/page.interface";

const CourseDetail: CustomNextPage = (props) => {
    return <TeacherCourseDetailScreen {...props} />
}

CourseDetail.allowUsers = [
    UserRole.ADMIN,
    UserRole.TEACHER,
    UserRole.TUTOR,
];
export default CourseDetail;
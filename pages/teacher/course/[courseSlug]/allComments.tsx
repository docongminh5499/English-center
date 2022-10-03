import TeacherCourseCommentScreen from "../../../../components/pageComponents/TeacherScreen/TeacherCourseCommentScreen";
import { UserRole } from "../../../../helpers/constants";
import { CustomNextPage } from "../../../../interfaces/page.interface";

const AllCommentsPage: CustomNextPage = (props) => {
    return <TeacherCourseCommentScreen {...props} />
}

AllCommentsPage.allowUsers = [
    UserRole.ADMIN,
    UserRole.TEACHER,
    UserRole.TUTOR,
];
export default AllCommentsPage;
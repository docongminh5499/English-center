import {UserRole } from "../../../helpers/constants";
import { CustomNextPage } from "../../../interfaces/page.interface";
import StudentHomeScreen from "../../../components/pageComponents/StudentScreen/StudentHomeScreen/student.home";

const StudentHomePage: CustomNextPage = (props) => {
    return <StudentHomeScreen {...props} />;
};

StudentHomePage.allowUsers = [
    UserRole.STUDENT,
];
export default StudentHomePage;
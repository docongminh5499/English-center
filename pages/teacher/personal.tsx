import TeacherPersonalScreen from "../../components/pageComponents/TeacherScreen/TeacherPersonalScreen";
import { UserRole } from "../../helpers/constants";
import { CustomNextPage } from "../../interfaces/page.interface";

const TeacherPersonalInformationPage: CustomNextPage = (props) => {
    return <TeacherPersonalScreen {...props} />;
};

TeacherPersonalInformationPage.allowUsers = [
    UserRole.TEACHER,
];
export default TeacherPersonalInformationPage;
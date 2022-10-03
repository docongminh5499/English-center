import TeacherModifyPersonalScreen from "../../components/pageComponents/TeacherScreen/ModifyPersonalScreen";
import { UserRole } from "../../helpers/constants";
import { CustomNextPage } from "../../interfaces/page.interface";

const TeacherPersonalInformationModifyPage: CustomNextPage = (props) => {
    return <TeacherModifyPersonalScreen {...props} />;
};

TeacherPersonalInformationModifyPage.allowUsers = [
    UserRole.TEACHER,
];
export default TeacherPersonalInformationModifyPage;
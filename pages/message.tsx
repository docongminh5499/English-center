import MessageScreen from "../components/pageComponents/MessageScreen";
import { UserRole } from "../helpers/constants";
import { CustomNextPage } from "../interfaces/page.interface";

const Message: CustomNextPage = (props) => {
    return <MessageScreen {...props} />
}

Message.allowUsers = [
    UserRole.ADMIN,
    UserRole.EMPLOYEE,
    UserRole.PARENT,
    UserRole.STUDENT,
    UserRole.TEACHER,
    UserRole.TUTOR,
];
export default Message;

import NotificationScreen from "../components/pageComponents/NotificationScreen";
import { UserRole } from "../helpers/constants";
import { CustomNextPage } from "../interfaces/page.interface";

const Notification: CustomNextPage = (props) => {
    return <NotificationScreen {...props} />
}

Notification.allowUsers = [
    UserRole.ADMIN,
    UserRole.EMPLOYEE,
    UserRole.PARENT,
    UserRole.STUDENT,
    UserRole.TEACHER,
    UserRole.TUTOR,
];
Notification.displaySidebar = false;
export default Notification;
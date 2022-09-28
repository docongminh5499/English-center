import EmployeeHomeScreen from "../../components/pageComponents/EmployeeScreen/EmployeeHomeScreen/employee.home";
import { UserRole } from "../../helpers/constants";
import { CustomNextPage } from "../../interfaces/page.interface";

const EmployeeHomePage: CustomNextPage = (props) => {
    return <EmployeeHomeScreen {...props} />;
};

EmployeeHomePage.allowUsers = [
    UserRole.ADMIN,
    UserRole.EMPLOYEE,
];
export default EmployeeHomePage;
import RegisterScreen from "../components/pageComponents/RegisterScreen";
import { UserRole } from "../helpers/constants";
import { CustomNextPage } from "../interfaces/page.interface";

const Register: CustomNextPage = (props) =>{
  return <RegisterScreen {...props}/>;
};

Register.allowUsers = [UserRole.GUEST,];
Register.displaySidebar = false;
export default Register;
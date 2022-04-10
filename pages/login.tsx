import LoginScreen from "../components/pageComponents/LoginScreen";
import { UserRole } from "../helpers/constants";
import { CustomNextPage } from "../interfaces/page.interface";

const Login: CustomNextPage = (props) => {
  return <LoginScreen {...props} />;
};

Login.allowUsers = [UserRole.GUEST];
export default Login;

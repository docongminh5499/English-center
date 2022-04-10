import HomeScreen from "../components/pageComponents/HomeScreen";
import { UserRole } from "../helpers/constants";
import { CustomNextPage } from "../interfaces/page.interface";

const Home: CustomNextPage = (props) => {
  return <HomeScreen {...props} />;
};

Home.allowUsers = [
  UserRole.ADMIN,
  UserRole.EMPLOYEE,
  UserRole.PARENT,
  UserRole.STUDENT,
  UserRole.TEACHER,
  UserRole.TUTOR,
];
export default Home;

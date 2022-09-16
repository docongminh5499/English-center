import NotFoundScreen from "../components/pageComponents/NotFoundScreen";
import { CustomNextPage } from "../interfaces/page.interface";

const NotFound: CustomNextPage = (props) => {
  return <NotFoundScreen {...props} />;
};

NotFound.displaySidebar = false;
export default NotFound;

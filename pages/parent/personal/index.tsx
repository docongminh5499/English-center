import { GetServerSideProps } from "next";
import ParentPersonalScreen from "../../../components/pageComponents/ParentScreen/ParentPersonalScreen";
import API from "../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const ParentPersonalInformationPage: CustomNextPage = (props) => {
  return <ParentPersonalScreen userParent={null} {...props} />;
};

ParentPersonalInformationPage.allowUsers = [
  UserRole.PARENT,
];
export default ParentPersonalInformationPage;


export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const userParent = await API.get(Url.parents.getPersonalInfo,  { token: user.token });
    return {
      props: {
        userRole: user.role,
        userParent: userParent,
      }
    };
  } catch (error: any) {
    return {
      props: {
        userRole: user.role || null,
        userParent: null,
      }
    };
  }
}
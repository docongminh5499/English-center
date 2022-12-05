import { GetServerSideProps } from "next";
import ParentModifyPersonalScreen from "../../components/pageComponents/ParentScreen/ParentModifyPersonalScreen";
import API from "../../helpers/api";
import { CookieKey, Url, UserRole } from "../../helpers/constants";
import { CookieParser } from "../../helpers/cookieParser";
import { CustomNextPage } from "../../interfaces/page.interface";

const ParentPersonalInformationModifyPage: CustomNextPage = (props) => {
    return <ParentModifyPersonalScreen userParent={null} {...props} />;
};

ParentPersonalInformationModifyPage.allowUsers = [
    UserRole.PARENT,
];
export default ParentPersonalInformationModifyPage;



export const getServerSideProps: GetServerSideProps = (async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    try {
        const userParent = await API.get(Url.parents.getPersonalInfo,  { token: user.token });
        return { props: { userRole: user.role, userParent: userParent } };
    } catch (error: any) {
        return { props: { userRole: user.role || null, userParent: null } };
    }
})
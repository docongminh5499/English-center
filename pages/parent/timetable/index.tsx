import {CookieKey, Url, UserRole } from "../../../helpers/constants";
import { CustomNextPage } from "../../../interfaces/page.interface";
import { GetServerSideProps } from "next";
import { CookieParser } from "../../../helpers/cookieParser";
import API from "../../../helpers/api";
import ParentHomeScreen from "../../../components/pageComponents/ParentScreen/ParentHomeScreen/parent.home";

const ParentHomePage: CustomNextPage = (props) => {
    return <ParentHomeScreen {...props} />;
};

ParentHomePage.allowUsers = [
    UserRole.PARENT,
];
export default ParentHomePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    try {
        const userParent = await API.get(Url.parents.getPersonalInfo, {
            token: user.token,
        });
        return { props: { userRole: user.role || null, parent: userParent} };
    } catch (error: any) {
        return { props: { userRole: user.role || null, parent: null} }
    };
};
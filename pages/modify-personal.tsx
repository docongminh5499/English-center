import { GetServerSideProps } from "next";
import ModifyPersonalScreen from "../components/pageComponents/ModifyPersonalScreen";
import { CookieKey, UserRole } from "../helpers/constants";
import { CookieParser } from "../helpers/cookieParser";
import { CustomNextPage } from "../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";

const PersonalInformationModiyPage: CustomNextPage = (props) => {
    return <ModifyPersonalScreen {...props} />;
};

PersonalInformationModiyPage.allowUsers = [
    UserRole.ADMIN,
    UserRole.EMPLOYEE,
    UserRole.PARENT,
    UserRole.STUDENT,
    UserRole.TEACHER,
    UserRole.TUTOR,
];
export default PersonalInformationModiyPage;


export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : {};
    return { props: { userRole: user.role || null } };
})
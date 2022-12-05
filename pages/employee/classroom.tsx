import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import EmployeeClassroomScreen from "../../components/pageComponents/EmployeeScreen/EmployeeClassroomScreen";
import { CookieKey, UserRole } from "../../helpers/constants";
import { CookieParser } from "../../helpers/cookieParser";
import { CustomNextPage } from "../../interfaces/page.interface";

const EmployeeClassroomPage: CustomNextPage = (props) => {
    return <EmployeeClassroomScreen {...props} />;
};

EmployeeClassroomPage.allowUsers = [
    UserRole.EMPLOYEE,
];
export default EmployeeClassroomPage;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    return { props: { userRole: user.role || null } };
}
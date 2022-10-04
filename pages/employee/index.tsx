import EmployeeHomeScreen from "../../components/pageComponents/EmployeeScreen/EmployeeHomeScreen/employee.home";
import { CookieKey, UserRole } from "../../helpers/constants";
import { CustomNextPage } from "../../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import { CookieParser } from "../../helpers/cookieParser";


const EmployeeHomePage: CustomNextPage = (props) => {
    return <EmployeeHomeScreen {...props} />;
};

EmployeeHomePage.allowUsers = [
    UserRole.ADMIN,
    UserRole.EMPLOYEE,
];
export default EmployeeHomePage;



export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : {};
    return { props: { userRole: user.role || null } };
})
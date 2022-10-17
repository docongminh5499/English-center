import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import EmployeeCreateCourseScreen from "../../../components/pageComponents/EmployeeScreen/EmployeeCreateCourseScreen";
import { CookieKey, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const EmployeeCreateCoursePage: CustomNextPage = (props) => {
    return <EmployeeCreateCourseScreen {...props} />;
};

EmployeeCreateCoursePage.allowUsers = [
    UserRole.EMPLOYEE,
];
export default EmployeeCreateCoursePage;



export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    return { props: { userRole: user.role || null } };
});
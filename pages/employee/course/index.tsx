import EmployeeHomeScreen from "../../../components/pageComponents/EmployeeScreen/EmployeeHomeScreen/employee.home";
import { CookieKey, EmployeeConstants, Url, UserRole } from "../../../helpers/constants";
import { CustomNextPage } from "../../../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import { CookieParser } from "../../../helpers/cookieParser";
import API from "../../../helpers/api";
import Pageable from "../../../models/pageable.model";


const EmployeeHomePage: CustomNextPage = (props) => {
    return <EmployeeHomeScreen {...props} />;
};

EmployeeHomePage.allowUsers = [
    UserRole.EMPLOYEE,
];
export default EmployeeHomePage;



export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context): Promise<any> => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    try {
        const responses = await API.get(Url.employees.getCourse, {
            token: user.token,
            limit: EmployeeConstants.limitCourse,
            skip: 0
        });
        const pageable: Pageable = {
            limit: responses.limit,
            skip: responses.skip,
            total: responses.total
        };
        const courses = responses.courses;
        return { props: { userRole: user.role, courses, pageable, error: null } };
    } catch (error: any) {
        return { props: { userRole: user.role, courses: [], pageable: null, error: true } };
    }
})
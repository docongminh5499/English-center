import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import EmployeeStudentScreen from "../../../components/pageComponents/EmployeeScreen/EmployeeStudentScreen";
import API from "../../../helpers/api";
import { CookieKey, EmployeeConstants, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";

const EmployeeStudentPage: CustomNextPage = (props) => {
    return <EmployeeStudentScreen total={null} students={[]} userRole={null} {...props} />;
};

EmployeeStudentPage.allowUsers = [
    UserRole.EMPLOYEE,
];
export default EmployeeStudentPage;


export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    try {
        const responses = await API.post(Url.employees.getAllStudents, {
            token: user.token,
            skip: 0,
            limit: EmployeeConstants.limitStudent
        });
        return { props: { userRole: user.role, students: responses.students, total: responses.total } };
    } catch (error: any) {
        return { props: { userRole: user.role || null, students: [], total: null } };
    }
})
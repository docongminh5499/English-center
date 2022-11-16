import { GetServerSideProps } from "next";
import { CookieKey, EmployeeConstants, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import API from "../../../helpers/api";
import EmployeePersonalScreen from "../../../components/pageComponents/EmployeeScreen/EmployeePersonalScreen";


const EmployeePersonalInformationPage: CustomNextPage = (props) => {
    return <EmployeePersonalScreen salaries={{
        total: 0,
        salaries: []
    }} userEmployee={null} {...props} />;
};

EmployeePersonalInformationPage.allowUsers = [
    UserRole.EMPLOYEE,
];
export default EmployeePersonalInformationPage;


export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    try {
        const [userEmployee, salaries] = await Promise.all([
            API.get(Url.employees.getPersonalInformation, { token: user.token }),
            API.post(Url.employees.getSalaries, { token: user.token, skip: 0, limit: EmployeeConstants.maxTopSalary }),
        ]);
        return { props: { userRole: user.role, userEmployee: userEmployee, salaries: salaries } };
    } catch (error: any) {
        return { props: { userRole: user.role || null, userEmployee: null, salaries: null } };
    }
})
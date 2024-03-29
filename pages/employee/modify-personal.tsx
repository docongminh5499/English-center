import { GetServerSideProps } from "next";
import EmployeeModifyPersonalScreen from "../../components/pageComponents/EmployeeScreen/ModifyPersonalScreen";
import API from "../../helpers/api";
import { CookieKey, Url, UserRole } from "../../helpers/constants";
import { CookieParser } from "../../helpers/cookieParser";
import { CustomNextPage } from "../../interfaces/page.interface";


const EmployeePersonalInformationModifyPage: CustomNextPage = (props) => {
    return <EmployeeModifyPersonalScreen userEmployee={null} {...props} />;
};

EmployeePersonalInformationModifyPage.allowUsers = [
    UserRole.EMPLOYEE,
];
export default EmployeePersonalInformationModifyPage;



export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    try {
        const responses = await API.get(Url.employees.getPersonalInformation, { token: user.token });
        return { props: { userRole: user.role, userEmployee: responses } };
    } catch (error: any) {
        return { props: { userRole: user.role || null, userEmployee: null } };
    }
}
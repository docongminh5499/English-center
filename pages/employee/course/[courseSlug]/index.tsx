import { GetServerSideProps } from "next";
import EmployeeCourseDetailScreen from "../../../../components/pageComponents/EmployeeScreen/EmployeeCourseDetailScreen";
import API from "../../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../../helpers/constants";
import { CookieParser } from "../../../../helpers/cookieParser";
import { CustomNextPage } from "../../../../interfaces/page.interface";

const CourseDetail: CustomNextPage = (props) => {
    return <EmployeeCourseDetailScreen userRole={null} course={null} {...props} />
}

CourseDetail.allowUsers = [
    UserRole.EMPLOYEE
];
export default CourseDetail;




export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    try {
        const responses = await API.get(Url.employees.getCourseDetail + context.params?.courseSlug, {
            token: user.token,
        });
        return { props: { userRole: user.role || null, course: responses } };
    } catch (error: any) {
        return { props: { userRole: user.role || null, course: null } }
    };
}
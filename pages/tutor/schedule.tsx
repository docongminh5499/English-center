import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import TutorScheduleScreen from "../../components/pageComponents/TutorScreen/TutorScheduleScreen";
import { CookieKey, UserRole } from "../../helpers/constants";
import { CookieParser } from "../../helpers/cookieParser";
import { CustomNextPage } from "../../interfaces/page.interface";

const TutorSchedulePage: CustomNextPage = (props) => {
    return <TutorScheduleScreen {...props} />;
};

TutorSchedulePage.allowUsers = [
    UserRole.TUTOR,
];
export default TutorSchedulePage;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    return { props: { userRole: user.role || null } };
}
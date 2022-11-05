import { GetServerSideProps } from "next";
import TeacherPersonalScreen from "../../components/pageComponents/TeacherScreen/TeacherPersonalScreen";
import { CookieKey, Url, UserRole } from "../../helpers/constants";
import { CookieParser } from "../../helpers/cookieParser";
import { CustomNextPage } from "../../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import API from "../../helpers/api";
import TutorPersonalScreen from "../../components/pageComponents/TutorScreen/TutorPersonalScreen";

const TutorPersonalInformationPage: CustomNextPage = (props) => {
    return <TutorPersonalScreen userTutor={null} {...props} />;
};

TutorPersonalInformationPage.allowUsers = [
    UserRole.TUTOR,
];
export default TutorPersonalInformationPage;


export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
    const cookies = CookieParser.parse(context.req.headers.cookie);
    const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
    try {
        const responses = await API.get(Url.tutors.getPersonalInformation, { token: user.token });
        return { props: { userRole: user.role, userTutor: responses } };
    } catch (error: any) {
        return { props: { userRole: user.role || null, userTutor: null } };
    }
})
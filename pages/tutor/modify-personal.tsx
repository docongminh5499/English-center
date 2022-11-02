import { CookieKey, Url, UserRole } from "../../helpers/constants";
import { CustomNextPage } from "../../interfaces/page.interface";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import { CookieParser } from "../../helpers/cookieParser";
import API from "../../helpers/api";
import TutorModifyPersonalScreen from "../../components/pageComponents/TutorScreen/ModifyPersonalScreen";

const TutorPersonalInformationModifyPage: CustomNextPage = (props) => {
    return <TutorModifyPersonalScreen userTutor={null} {...props} />;
};

TutorPersonalInformationModifyPage.allowUsers = [
    UserRole.TUTOR,
];
export default TutorPersonalInformationModifyPage;



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
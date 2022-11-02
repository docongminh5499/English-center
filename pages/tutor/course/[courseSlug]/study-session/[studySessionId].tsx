import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import StudySessionDetailScreen from "../../../../../components/pageComponents/TutorScreen/StudySessionDetailScreen";
import API from "../../../../../helpers/api";
import { CookieKey, Url, UserRole } from "../../../../../helpers/constants";
import { CookieParser } from "../../../../../helpers/cookieParser";
import { CustomNextPage } from "../../../../../interfaces/page.interface";

const StudySessionDetailPage: CustomNextPage = (props) => {
  return <StudySessionDetailScreen ownMakeups={[]} userRole={null} studySession={null} attendences={[]} makeups={[]} {...props} />;
};

StudySessionDetailPage.allowUsers = [
  UserRole.TUTOR,
];
export default StudySessionDetailPage;

export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const responses = await API.post(Url.tutors.getStudySessionDetail, {
      token: user.token,
      studySessionId: context.params?.studySessionId
    });
    return {
      props: {
        userRole: user.role || null,
        studySession: responses.studySession,
        attendences: responses.attendences,
        makeups: responses.makeups,
        ownMakeups: responses.ownMakeups,
      }
    };
  } catch (error: any) {
    return {
      props: {
        userRole: user.role || null,
        studySession: null,
        attendences: [],
        makeups: [],
        ownMakeups: [],
      }
    }
  };
})
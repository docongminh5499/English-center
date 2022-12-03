import ModifyStudySessionScreen from "../../../../../../components/pageComponents/TeacherScreen/ModifyStudySessionScreen";
import { GetServerSideProps } from "next";
import { CookieKey, CourseStatus, Url, UserRole } from "../../../../../../helpers/constants";
import { CustomNextPage } from "../../../../../../interfaces/page.interface";
import { CookieParser } from "../../../../../../helpers/cookieParser";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import API from "../../../../../../helpers/api";
import { getCourseStatus } from "../../../../../../helpers/getCourseStatus";

const ModifyStudySessionDetailPage: CustomNextPage = (props) => {
  return <ModifyStudySessionScreen userRole={null} studySession={null} attendences={[]} makeups={[]} ownMakeups={[]} {...props} />;
};

ModifyStudySessionDetailPage.allowUsers = [
  UserRole.TEACHER,
];
export default ModifyStudySessionDetailPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const responses = await API.post(Url.teachers.getStudySessionDetail, {
      token: user.token,
      studySessionId: context.params?.studySessionId
    });
    if (responses.studySession !== null &&
      getCourseStatus(responses.studySession.course) === CourseStatus.Closed) {
      throw "Course is already closed!";
    }
    if (responses.studySession !== null &&
      responses.studySession.teacher.worker.user.id.toString() != user.userId) {
      throw "Not enough permission!";
    }
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
}
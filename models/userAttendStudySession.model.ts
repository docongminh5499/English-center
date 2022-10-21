import StudySession from "./studySession.model";
import UserStudent from "./userStudent.model";

export default interface UserAttendStudySession {
  student: UserStudent;
  studySession: StudySession;
  isAttend: boolean;
  commentOfTeacher: string;
}
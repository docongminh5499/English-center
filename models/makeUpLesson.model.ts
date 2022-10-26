import StudySession from "./studySession.model";
import UserStudent from "./userStudent.model";

export default interface MakeUpLession {
  student: UserStudent;
  studySession: StudySession;           // Buổi được bù
  targetStudySession: StudySession;    // Buổi dùng để bù
  isAttend: boolean;
  commentOfTeacher: string;
  version: number;
}
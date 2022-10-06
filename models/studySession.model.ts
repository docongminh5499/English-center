import { StudySessionState } from "../helpers/constants";

export default interface StudySession {
    id: number;
    name: string;
    date: Date;
    isTeacherAbsent: boolean
    notes: string | null;
    state: StudySessionState;
    isSystemCreated: boolean | null;
    // shifts: Shift[];
    // tutor: UserTutor;
    // teacher: UserTeacher;
    // classroom: Classroom;
}
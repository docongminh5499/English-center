import Classroom from "./classroom";
import { Course } from "./course.model";
import Shift from "./shift.model";
import UserTeacher from "./userTeacher.model";
import UserTutor from "./userTutor";

export default interface StudySession {
    id: number;
    name: string;
    date: Date;
    isTeacherAbsent: boolean
    notes: string | null;
    cancelled: boolean | null;
    course: Course;
    shifts: Shift[];
    tutor: UserTutor;
    teacher: UserTeacher;
    classroom: Classroom;
}
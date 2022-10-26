import Classroom from "./classroom.model";
import { Course } from "./course.model";
import Shift from "./shift.model";
import UserTeacher from "./userTeacher.model";
import UserTutor from "./userTutor.model";

export default interface StudySession {
    id: number;
    name: string;
    date: Date;
    isTeacherAbsent: boolean
    notes: string | null;
    course: Course;
    shifts: Shift[];
    tutor: UserTutor;
    teacher: UserTeacher;
    classroom: Classroom;
    version: number;
}
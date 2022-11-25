import { Course } from "./course.model";
import UserStudent from "./userStudent.model";

export default interface UnpaidDto {
    student: UserStudent;
    course: Course;
    fromDate: Date;
    toDate: Date;
    amount: number;
}
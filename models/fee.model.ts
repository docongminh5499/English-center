import { Course } from "./course.model";
import Transaction from "./transaction.model";
import UserStudent from "./userStudent.model";

export default interface Fee {
    id: number;
    transCode: Transaction;
    userStudent: UserStudent;
    course: Course | null;
}
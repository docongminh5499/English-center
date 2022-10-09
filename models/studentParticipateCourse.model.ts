import UserStudent from "./userStudent.model";

export default interface StudentParticipateCourse {
  student: UserStudent;
  billingDate: Date | null;
}
import UserStudent from "./userStudent.model";

export default interface StudentParticipateCourse {
  student: UserStudent;
  billingDate: Date | null;
  comment: string | null;
  starPoint: number | null;
  isIncognito: boolean | null;
  commentDate: Date | null;
}
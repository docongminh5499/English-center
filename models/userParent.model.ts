import User from "./user.model";
import UserStudent from "./userStudent.model";

export default interface UserParent {
  userStudents: UserStudent[];
  user: User;
}
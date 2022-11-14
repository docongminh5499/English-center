import UserEmployee from "./userEmployee.model";
import UserTeacher from "./userTeacher.model";

export default interface Branch {
    id: number;
    phoneNumber: string;
    address: string;
    name: string;
    userEmployee: UserEmployee;
    userTeacher: UserTeacher;
}
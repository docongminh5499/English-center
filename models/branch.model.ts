import UserEmployee from "./userEmployee.model";

export default interface Branch { 
    id: number;
    phoneNumber: string;
    address: string;
    name: string;
    userEmployee: UserEmployee;
}
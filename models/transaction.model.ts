import { TransactionType } from "../helpers/constants";
import Branch from "./branch.model";
import UserEmployee from "./userEmployee.model";

export default interface Transaction { 
    transCode: string;
    content: string;
    amount: number;
    type: TransactionType;
    payDate: Date;
    userEmployee: UserEmployee;
    branch: Branch;
}
import Transaction from "./transaction.model";
import UserWorker from "./userWorker.model";

export default interface Salary {
    id: number;
    transCode: Transaction;
    worker: UserWorker;
}
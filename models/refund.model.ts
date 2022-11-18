import Fee from "./fee.model";
import Transaction from "./transaction.model";

export default interface Refund {
    id: number;
    transCode: Transaction;
    fee: Fee;
}
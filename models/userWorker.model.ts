import User from "./user.model";

export default interface UserWorker {
    version: number;
    user: User;
    homeTown: string;
    passport: string;
    nation: string;
    coefficients: number;
    salaryDate: Date | null;
    startDate: Date;
    // branch: Branch;
}
import { Gender, UserRole } from "../helpers/constants";

export default interface User {
    id: number;
    email: string | null;
    fullName: string;
    phone: string | null;
    dateOfBirth: Date
    sex: Gender;
    address: string | null;
    avatar: string | null;
    role: UserRole;
}
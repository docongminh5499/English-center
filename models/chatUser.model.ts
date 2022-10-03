import { UserRole } from "../helpers/constants";

export default interface ChatUser {
    userAvatar: string;
    userFullName: string;
    userRole: UserRole;
    userId: number;
    isActive: boolean;
}

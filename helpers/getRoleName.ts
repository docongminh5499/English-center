import { UserRole } from "./constants";

export function getRoleName(role?: UserRole) {
    switch (role) {
        case UserRole.ADMIN:
            return "Quản trị viên";
        case UserRole.TEACHER:
            return "Giáo viên";
        case UserRole.EMPLOYEE:
            return "Nhân viên";
        case UserRole.TUTOR:
            return "Trợ giảng";
        case UserRole.STUDENT:
            return "Học sinh";
        case UserRole.PARENT:
            return "Phụ huynh";
        default:
            return undefined;
    }
}
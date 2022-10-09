import { Gender } from "./constants";

export function getGenderName(gender?: Gender) {
    if (gender === Gender.MALE)
        return "Nam";
    if (gender === Gender.FEMALE)
        return "Nữ";
    return "Không xác định";

}
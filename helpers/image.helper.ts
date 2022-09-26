import { Url } from "./constants"

export const getAvatarImageUrl = (url?: string): string => {
    if (url === undefined || url === null || url.trim() === "")
        return "/assets/images/default_avatar.jpg";
    return Url.baseUrl + url;
}

export const getCourseImageUrl = (url?: string): string => {
    if (url === undefined || url === null || url.trim() === "")
        return "/assets/images/no_image.png";
    return Url.baseUrl + url;
}
import { Url } from "./constants"

export const getAvatarImageUrl = (url?: string | null): string => {
    if (url === undefined || url === null || url.trim() === "")
        return "/assets/images/default_avatar.jpg";
    return Url.baseUrl + url;
}

export const getImageUrl = (url?: string | null): string => {
    if (url === undefined || url === null || url.trim() === "")
        return "/assets/images/no_image.png";
    return Url.baseUrl + url;
}

export const getAudioUrl = (url?: string | null): string => {
    if (url === undefined || url === null || url.trim() === "")
        return "";
    return Url.baseUrl + url;
}


export const getDocumentUrl = (url?: string): string => {
    if (url === undefined || url === null || url.trim() === "")
        return "";
    if (url.indexOf("http") > -1)
        return url;
    return Url.baseUrl + url;
}
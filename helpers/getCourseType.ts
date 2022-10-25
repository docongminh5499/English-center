import { CourseType } from "./constants";

export function getCourseType(type?: CourseType) {
    if (type === CourseType.LONG_TERM) return "Khóa học dài hạn";
    else return "Khóa học ngắn hạn";
}
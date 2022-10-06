import moment from "moment";
import Course from "../models/course.model";
import { CourseStatus } from "./constants";

export function getCourseStatus(course: Course | null): CourseStatus {
    if (course?.closingDate === null) {
        if (moment().utc().diff(moment(course?.openingDate)) < 0) {
            return CourseStatus.NotOpen;
        } else return CourseStatus.Opened;
    } else return CourseStatus.Closed;
}
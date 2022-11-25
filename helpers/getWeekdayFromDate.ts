import moment from "moment";
import { Weekday } from "./constants";

export function getWeekdayFromDate(date: Date) {
    const day = moment(date).toDate().getDay();
    switch (day) {
        case 0:
            return Weekday.Sunday;
        case 1:
            return Weekday.Monday;
        case 2:
            return Weekday.Tuesday;
        case 3:
            return Weekday.Wednesday;
        case 4:
            return Weekday.Thursday;
        case 5:
            return Weekday.Friday;
        case 6:
            return Weekday.Saturday;
        default:
            return null;
    }
}
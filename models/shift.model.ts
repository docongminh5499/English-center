import { Weekday } from "../helpers/constants";

export default interface Shift {
    id: number;
    weekDay: Weekday;
    startTime: Date;
    endTime: Date;
    free: boolean;
}  
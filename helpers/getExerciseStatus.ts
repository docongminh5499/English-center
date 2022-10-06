import moment from "moment";
import { ExerciseStatus, TimeZoneOffset } from "./constants"

export const getExerciseStatus = (openTime?: Date | null, endTime?: Date | null) => {
    if (openTime === undefined || openTime === null)
        return ExerciseStatus.NotOpen;
    if (endTime === undefined || endTime === null)
        return ExerciseStatus.NotOpen;

    if (moment().utc().diff(moment(openTime)) < 0)
        return ExerciseStatus.NotOpen;
    else if (moment().utc().diff(moment(endTime)) < 0)
        return ExerciseStatus.Opened;
    else return ExerciseStatus.Closed;
}
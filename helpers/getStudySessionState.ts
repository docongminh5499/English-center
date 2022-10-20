import moment from "moment";
import StudySession from "../models/studySession.model";
import { StudySessionState, TimeZoneOffset } from "./constants";

export function getStudySessionState(studySession: StudySession): StudySessionState {
    if (studySession.cancelled) return StudySessionState.Cancel;
    const currentDate = moment().toDate();
    const studySessionDate = moment(studySession.date).utcOffset(TimeZoneOffset).toDate();

    if (currentDate.getDate() === studySessionDate.getDate() &&
        currentDate.getMonth() === studySessionDate.getMonth() &&
        currentDate.getFullYear() === studySessionDate.getFullYear())
        return StudySessionState.Start;

    if (moment(currentDate).diff(moment(studySessionDate)) < 0)
        return StudySessionState.Ready;
    else return StudySessionState.Finish;
}
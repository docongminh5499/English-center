import { Gender } from "../../../../helpers/constants";

export interface _User {
    email: string | null;
    fullName: string;
    phone: string | null;
    dateOfBirth: string,
    sex: Gender;
    address: string | null;
    avatar: string | null;
}

interface _StudySession {
    nameStudySession: string,
    shifts : {
        time : string // 10:00 - 12:00
    }
}

export interface _AttendanceStudent {
    studySessionId : Partial<_StudySession>,
    isAbsent : boolean;
    isMakeUpStudy : boolean;
}

export interface _Exercise {
    name : string,
    time : string,
    scores : number
}
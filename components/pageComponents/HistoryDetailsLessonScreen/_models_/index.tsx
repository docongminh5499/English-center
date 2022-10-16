export interface _AttendanceStudent {
    id : number,
    // studySessionId : number,
    // userStudentId : number,
    nameStudent : string,
    pseudoIdStudent : string,
    isAbsent : boolean;
    isMakeUpStudy : boolean;
    note?: string
}

export interface _StudySession {
    nameTeacher: string,
    nameCourse : string,
    nameStudySession: string,
    dateStart: string,
    notes : string,
    shifts : {
        name: string; // Ca 1, Ca 2,...
        time : string // 10:00 - 12:00
    }
}
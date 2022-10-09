import UserWorker from "./userWorker.model";

export default interface UserTeacher {
    slug: string;
    // courses: Course[];
    worker: UserWorker;
    experience: string | null;
    shortDesc: string | null;
    // studySessions: StudySession[];
}
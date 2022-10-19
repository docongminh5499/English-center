import UserWorker from "./userWorker.model";

export default interface UserTutor {
    slug: string;
    worker: UserWorker;
}
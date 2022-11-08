import User from "./user.model";
import UserParent from "./userParent.model";

export default interface UserStudent {
    user: User;
    userParent: UserParent;
    version: number;
}
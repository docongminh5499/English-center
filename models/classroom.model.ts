import { ClassroomFunction } from "../helpers/constants";
import Branch from "./branch.model";

export default interface Classroom {
    name: string;
    branch: Branch;
    function: ClassroomFunction;
    capacity: number;
}
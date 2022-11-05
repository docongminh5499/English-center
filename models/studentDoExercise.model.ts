import Exercise from "./exercise.model";
import UserStudent from "./userStudent.model";

export default interface StudentDoExercise {
    id: number;
    student: UserStudent;
    exercise: Exercise;
    score: number;
    startTime: Date;
    endTime: Date;
}
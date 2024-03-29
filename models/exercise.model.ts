import Lecture from "./lecture.model";


export default interface Exercise {
  id: number;
  name: string;
  openTime: Date | null;
  endTime: Date | null;
  maxTime: number | null;
  lecture: Lecture;
//   questions: Question[];
}
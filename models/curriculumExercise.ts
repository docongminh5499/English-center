import Curriculum from "./cirriculum.model";
import Lecture from "./lecture.model";


export default interface CurriculumExercise {
  id: number;
  name: string;
  maxTime: number | null;
  lecture: Lecture;
  curriculum: Curriculum
//   questions: Question[];
}
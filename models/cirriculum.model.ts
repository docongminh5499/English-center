import { CourseType, CurriculumLevel } from "../helpers/constants"
import CurriculumExercise from "./curriculumExercise"
import Lecture from "./lecture.model"
import Tag from "./tag.model"


export default interface Curriculum {
    version: number,
    id: number,
    name: string,
    desc: string
    image: string,
    type: CourseType,
    latest: boolean,
    lectures: Lecture[],
    shiftsPerSession: number,
    tags: Tag[],
    level: CurriculumLevel
    exercises: CurriculumExercise[],
}

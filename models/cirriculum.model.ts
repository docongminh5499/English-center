import { CourseType } from "../helpers/constants"
import Lecture from "./lecture.model"




export default interface Curriculum {
    version: number,
    id: number,
    name: string,
    desc: string
    image: string,
    type: CourseType,
    latest: boolean,
    lectures: Lecture[],
}
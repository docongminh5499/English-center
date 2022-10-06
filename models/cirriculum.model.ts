import { CourseType } from "../helpers/constants"


interface Lecture {
    version: number,
    id: number,
    name: string,
    desc: string | null,
    detail: string,
    order: number,
}


export default interface Curriculum {
    version: 1,
    id: 2,
    name: string,
    desc: string
    image: string,
    type: CourseType,
    lectures: Lecture[],
}
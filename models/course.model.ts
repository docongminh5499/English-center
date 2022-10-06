import Curriculum from "./cirriculum.model"
import Document from "./document.models"
import Exercise from "./exercise.model"
import StudentParticipateCourse from "./studentParticipateCourse.model"
import StudySession from "./studySession.model"

export default interface Course {
  version: number,
  id: number,
  slug: string,
  name: string,
  maxNumberOfStudent: number,
  price: number,
  openingDate: Date,
  closingDate: Date | null,
  expectedClosingDate: Date,
  image: string,
  documents: Document[],
  studySessions: StudySession[],
  exercises: Exercise[],
  curriculum: Curriculum
  studentPaticipateCourses: StudentParticipateCourse[]
}
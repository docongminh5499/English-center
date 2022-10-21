import Classroom from "../models/classroom.model";
import Shift from "../models/shift.model";
import UserTutor from "../models/userTutor.model";

export default interface TimeTable {
  shifts: Shift[],
  classroom: Classroom,
  tutor: UserTutor,
}

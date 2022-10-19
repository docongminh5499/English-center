import Classroom from "../models/classroom";
import Shift from "../models/shift.model";
import UserTutor from "../models/userTutor";

export default interface TimeTable {
    shifts: Shift[],
    classroom: Classroom,
    tutor: UserTutor,
  }
  
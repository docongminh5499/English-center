export const TimeZoneOffset = new Date().getTimezoneOffset() * (-1);

export enum UserRole {
  GUEST = "guest",
  ADMIN = "admin",
  TEACHER = "teacher",
  EMPLOYEE = "employee",
  TUTOR = "tutor",
  STUDENT = "student",
  PARENT = "parent",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  UNDEFINE = "undefine",
}

export enum CourseType {
  SHORT_TERM = "ShortTerm",
  LONG_TERM = "LongTerm"
}

export enum StudySessionState {
  Ready = "Ready",
  Start = "Start",
  Finish = "Finish",
}

export enum ExerciseStatus {
  NotOpen = "NotOpen",
  Opened = "Opened",
  Closed = "Closed",
}

export enum CourseStatus {
  NotOpen = "NotOpen",
  Opened = "Opened",
  Closed = "Closed",
}

// export enum AttendanceStatus {
//   Attendance = "Attendance",
//   AbsenceWithPermission = "AbsenceWithPermission",
//   AbsenceWithoutPermission = "AbsenceWithoutPermission",
// }

export enum CurriculumLevel {
  Beginer = "Beginer",
  Intermediate = "Intermediate",
  Advance = "Advance",
}

export enum TagsType {
  Question = "question",
  Curriculum = "curriculum"
}

export enum Weekday {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export enum ClassroomFunction {
  MEETING_ROOM = "Phòng họp",
  WAREHOUSE_ROOM = "Phòng vật dụng",
  CLASSROOM = "Phòng học",
}

export enum TransactionType {
  Salary = "Salary",
  Fee = "Fee",
  Refund = "Refund",
}

export const LocalStorageKey = {
  USER: "EnglishCenter-User",
};

export const CookieKey = {
  USER: "EnglishCenter-User"
};

export const TeacherConstants = {
  limitCourse: 12,
  limitStudent: 12,
  limitExercise: 12,
  limitDocument: 12,
  limitComments: 12,
  maxTopComments: 3,
  limitStudySession: 12,
  limitSchedule: 12,
  limitTeacher: 6,
  maxTopSalary: 3,
  limitSalary: 8,
}

export const EmployeeConstants = {
  limitCourse: 12,
  limitStudySession: 6,
  limitClassroom: 6,
  limitStudent: 6,
  limitParent: 6,
  maxTopSalary: 3,
  limitSalary: 8,
  limitSalaryTransaction: 6,
  limitFee: 6,
  limitRefund: 6,
  limitTeacher: 6,
  limitTutor: 6,
  limitEmployee: 6,
}

export const StudentConstants = {
  limitCourse: 12
}

export const TutorConstants = {
  limitCourse: 12,
  limitSchedule: 12,
  limitStudySession: 12,
  limitStudent: 12,
  maxTopSalary: 3,
  limitSalary: 8,
}

export const ChatConstants = {
  limitMessage: 10,
  limitFindContacts: 8,
  limitMessageBox: 10,
}

export const NotificationConstants = {
  limitNotification: 10
}

export const Url = {
  baseUrl: "http://localhost:5000",
  users: {
    signIn: "/api/users/sign-in",
    verify: "/api/users/verify",
    getContacts: "/api/users/message/get-contacts",
    findContacts: "/api/users/message/find-contacts",
    getMessages: "/api/users/message/get-messages",
    getUnreadMessageCount: "/api/users/message/get-unread-messages-count",
    getNotifcation: "/api/users/notification/get-notification",
    getUnreadNotificationCount: "/api/users/notification/get-unread-notification-count",
    signUp: "/api/users/sign-up",
    checkOldEmail: "/api/users/sign-up/check-old-email",
    modifyAccount: "/api/users/modify-account",
  },
  teachers: {
    getCourse: "/api/teachers/courses/get-course",
    getCourseDetail: "/api/teachers/courses/get-course/",
    closeCourse: "/api/teachers/courses/close-course",
    getStudents: "/api/teachers/courses/get-students",
    getStudentDetails: "/api/teachers/courses/get-student-detail",
    getExercises: "/api/teachers/courses/get-exercises",
    deleteExercise: "/api/teachers/courses/delete-exercise/",
    getDocuments: "/api/teachers/courses/get-documents",
    deleteDocument: "/api/teachers/courses/delete-document/",
    createDocument: "/api/teachers/courses/create-document",
    getPersonalInformation: "/api/teachers/personal/get-personal-information",
    modifyPersonalInformation: "/api/teachers/personal/modify-personal-information",
    getCurriculumList: "/api/teachers/curriculum/get-curriculum",
    getCurriculum: "/api/teachers/curriculum/get-curriculum/",
    modifyCurriculum: "/api/teachers/curriculum/modify-curriculum",
    createCurriculum: "/api/teachers/curriculum/create-curriculum",
    deleteCurriculum: "/api/teachers/curriculum/delete-curriculum/",
    getComments: "/api/teachers/courses/get-comments",
    getStudySessions: "/api/teachers/courses/get-study-sessions",
    getStudySessionDetail: "/api/teachers/courses/get-study-session-detail",
    modifyStudySessionDetail: "/api/teachers/courses/modify-study-session-detail",
    getPreferredCurriculums: "/api/teachers/curriculum/get-prefered-curriculums",
    checkPreferredCurriculums: "/api/teachers/curriculum/check-prefered-curriculums",
    addPreferredCurriculums: "/api/teachers/curriculum/add-prefered-curriculums",
    removePreferredCurriculums: "/api/teachers/curriculum/remove-prefered-curriculums",
    getSchedules: "/api/teachers/schedule",
    getCurriculumTags: "/api/teachers/curriculum/get-curriculum-tags",
    requestOffStudySession: "/api/teachers/courses/request-off-study-session",
    getTeachersPreferedCurriculum: "/api/teachers/curriculum/get-teachers-by-prefered-curriculum",
    getTeachersByBranchAndNotPreferedCurriculum: "/api/teachers/curriculum/get-teachers-by-branch-and-not-prefered-curriculum",
    getSalaries: "/api/teachers/personal/get-salaries",
    //Hoc
    createExercise: "/api/teachers/exercise/create-exercise",
    addNewQuestionTag: "/api/teachers/exercise/add-new-question-tag",
    getAllQuestionTag: "/api/teachers/exercise/get-all-question-tag",
    getExerciseById: "/api/teachers/exercise/get-exercise-by-id/",
    getStdExeResult: "/api/teachers/exercise/get-student-exercise-result/",
    modifyExercise: "/api/teachers/exercise/modify-exercise",
  },
  students: {
    getTimetable: "/api/students/timetable",
    getCourse: "/api/students/courses/get-course",
    getCourseDetail: "/api/students/courses/get-course/",
    sendAssessCourse: "/api/students/courses/assess-course",
    getAttendance: "/api/students/courses/attendance-course/",
    getAllExercises: "/api/students/exercise/get-all-exercises/",
    submitExercise: "/api/students/exercise/submit-exercise/",
    getStudentDoExercise: "/api/students/exercise/get-student-do-exercise/",
    getAllDocument: "/api/students/document/get-all-document/",
  },
  parents: {
    getPersonalInfo: "/api/parents/personal/get-personal-infomation",
    getAllStudentCourses: "/api/parents/timetable/get-all-student-courses",
    getPageableStudentCourses: "/api/parents/course/get-pageable-student-courses",
    getCourseDetail: "/api/parents/course/get-course/",
  },

  employees: {
    getPersonalInformation: "/api/employees/personal/get-personal-information",
    modifyPersonalInformation: "/api/employees/personal/modify-personal-information",
    getCurriculumList: "/api/employees/curriculum/get-curriculum",
    getBranches: "/api/employees/courses/get-branches",
    getTeachers: "/api/employees/courses/get-teachers",
    getTeacherFreeShift: "/api/employees/courses/get-teacher-free-shift",
    getAvailableTutors: "/api/employees/courses/get-available-tutors",
    getAvailableClassroom: "/api/employees/courses/get-available-classrooms",
    createCourse: "/api/employees/courses/create-course",
    getCourse: "/api/employees/courses/get-course",
    getCourseDetail: "/api/employees/courses/get-course/",
    reopenCourse: "/api/employees/courses/reopen-course",
    closeCourse: "/api/employees/courses/close-course",
    getStudySessions: "/api/employees/courses/get-study-sessions",
    getShifts: "/api/employees/courses/get-shifts",
    getAvailableTeachersInDate: "/api/employees/courses/get-available-teachers-in-date",
    getAvailableTutorsInDate: "/api/employees/courses/get-available-tutors-in-date",
    getAvailableClassroomInDate: "/api/employees/courses/get-available-classrooms-in-date",
    addStudySession: "/api/employees/courses/add-study-session",
    updateStudySession: "/api/employees/courses/update-study-session",
    removeStudySession: "/api/employees/courses/remove-study-session",
    getAvailableStudentCount: "/api/employees/courses/get-available-student-count",
    removeCourse: "/api/employees/courses/remove-course",
    getClassrooms: "/api/employees/classroom/get-classrooms",
    updateClassroom: "/api/employees/classroom/modify-classroom",
    addClassroom: "/api/employees/classroom/add-classroom",
    removeClassroom: "/api/employees/classroom/remove-classroom",
    getStudents: "/api/employees/courses/get-students",
    getAllStudents: "/api/employees/student/get-students",
    getStudentDetails: "/api/employees/student/get-student-detail",
    getAllParents: "/api/employees/student/get-parents",
    modifyParentForStudent: "/api/employees/student/modify-parent",
    getSalaries: "/api/employees/personal/get-salaries",
    getSalariesByBranch: "/api/employees/transaction/get-salaries",
    getFeesByBranch: "/api/employees/transaction/get-fees",
    getRefundsByBranch: "/api/employees/transaction/get-refunds",
    getTeachersByBranch: "/api/employees/workers/get-teachers",
    getTutorsByBranch: "/api/employees/workers/get-tutors",
    getEmployeesByBranch: "/api/employees/workers/get-employees",
  },
  tutors: {
    getCourse: "/api/tutors/courses/get-course",
    getAllShifts: "/api/tutors/personal/get-all-shifts",
    getFreeShifts: "/api/tutors/personal/get-free-shifts",
    updateFreeShifts: "/api/tutors/personal/update-free-shifts",
    getPersonalInformation: "/api/tutors/personal/get-personal-information",
    modifyPersonalInformation: "/api/tutors/personal/modify-personal-information",
    getSchedules: "/api/tutors/schedule",
    getCourseDetail: "/api/tutors/courses/get-course/",
    getStudents: "/api/tutors/courses/get-students",
    getStudentDetails: "/api/tutors/courses/get-student-detail",
    getStudySessions: "/api/tutors/courses/get-study-sessions",
    getStudySessionDetail: "/api/tutors/courses/get-study-session-detail",
    requestOffStudySession: "/api/tutors/courses/request-off-study-session",
    getSalaries: "/api/tutors/personal/get-salaries",
  }
};

export const SocketBaseUrl = "ws://localhost:5000";
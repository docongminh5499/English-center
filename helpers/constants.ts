export const TimeZoneOffset = new Date().getTimezoneOffset() * (-1);

export const production = true;

export enum UserRole {
  GUEST = "guest",
  ADMIN = "admin",
  TEACHER = "teacher",
  EMPLOYEE = "employee",
  TUTOR = "tutor",
  STUDENT = "student",
  PARENT = "parent",
}

export enum ReportType {
  REVENUE = "revenue",
  SALARY = "salary",
  STUDENT = "student",
  PROFIT = "profit",
  COURSE = "course"
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
  limitCourse: 12,
  limitFee: 12,
}

export const ParentConstants = {
  limitCourse: 12,
  limitFee: 12,
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

export const GuestConstants = {
  topLatestCourse: 6,
  limitCourse: 12,
  limitLecture: 10,
  limitStudySession: 10,
}

export const Url = {
  baseUrl: production ? "https://glass-cedar-237913.as.r.appspot.com" : "http://localhost:5000",
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
    changeExerciseInfo: "/api/teachers/exercise/change-exercise-info",
    sendQuesitonImage: "/api/teachers/exercise/send-question-image",
    sendModifiedQuesitonImage: "/api/teachers/exercise/send-modified-question-image",
    sendQuesitonAudio: "/api/teachers/exercise/send-question-audio",
    sendModifiedQuesitonAudio: "/api/teachers/exercise/send-modified-question-audio",
    deleteQuestionTemporaryKey: "/api/teachers/exercise/delete-question-temporary-key",
    getAllCurriculumExercise: "/api/teachers/exercise/get-all-curriculum-exercise",
    addCurriculumExerciseToCourse: "/api/teachers/exercise/add-curriculum-exercise-to-course",

    createCurriculumExercise: "/api/teachers/curriculum/exercise/create-curriculum-exercise",
    modifyCurriculumExercise: "/api/teachers/curriculum/exercise/modify-curriculum-exercise",
    sendQuesitonStoreImage: "/api/teachers/curriculum/exercise/send-question-store-image",
    sendModifiedQuesitonStoreImage: "/api/teachers/curriculum/exercise/send-modified-question-store-image",
    sendQuesitonStoreAudio: "/api/teachers/curriculum/exercise/send-question-store-audio",
    sendModifiedQuesitonStoreAudio: "/api/teachers/curriculum/exercise/send-modified-question-store-audio",
    deleteQuestionTemporaryKeyForCurriculumExercise: "/api/teachers/curriculum/exercise/delete-question-temporary-key",
    getCurriculumExerciseById: "/api/teachers/curriculum/exercise/get-curriculum-exercise-by-id",
    deleteQuestionStoreTemporaryKey: "/api/teachers/curriculum/exercise/delete-question-store-temporary-key",
    changeCurriculumExerciseInfo: "/api/teachers/curriculum/exercise/change-curriculum-exercise-info",
    deleteCurriculumExercise: "/api/teachers/curriculum/exercise/delete-curriculum-exercise",
  },
  students: {
    getTimetable: "/api/students/timetable",
    getCourse: "/api/students/courses/get-course",
    getCourseDetail: "/api/students/courses/get-course/",
    sendAssessCourse: "/api/students/courses/assess-course",
    getAttendance: "/api/students/courses/attendance-course/",
    getTotalCourseStudySession: "/api/students/courses/get-total-course-study-session/",
    getAllExercises: "/api/students/exercise/get-all-exercises/",
    startDoExercise: "/api/students/exercise/start-do-exercise/",
    submitExercise: "/api/students/exercise/submit-exercise/",
    getStudentDoExercise: "/api/students/exercise/get-student-do-exercise/",
    getAllDocument: "/api/students/document/get-all-document/",

    getMakeupLessionCompatible: "/api/students/timetable/get-makeup-lession-compatible",
    registerMakeupLesion: "/api/students/timetable/register-makeup-lession",
    getMakeupLession: "/api/students/timetable/get-makeup-lession",
    deleteMakeupLession: "/api/students/timetable/delete-makeup-lession",

    getPersonalInformation: "/api/students/personal/get-personal-information",
    getParentList: "/api/students/personal/get-parent-list",
    addParent: "/api/students/personal/add-parent",
    deleteParent: "/api/students/personal/delete-parent",
    modifyPersonalInformation: "/api/students/personal/modify-personal-information",

    getPaymentHistory: "/api/students/personal/get-payment-history",
  },
  parents: {
    getPersonalInfo: "/api/parents/personal/get-personal-infomation",
    getAllStudentCourses: "/api/parents/timetable/get-all-student-courses",
    getPageableStudentCourses: "/api/parents/course/get-pageable-student-courses",
    getCourseDetail: "/api/parents/course/get-course/",
    getTotalCourseStudySession: "/api/parents/course/get-total-course-study-session/",
    getAttendance: "/api/parents/course/attendance-course/",
    getAllExercises: "/api/parents/exercise/get-all-exercises/",
    getStudentDoExercise: "/api/parents/exercise/get-student-do-exercise/",

    modifyPersonalInformation: "/api/parents/personal/modify-personal-information",
    getStudentPaymentHistory: "/api/parents/personal/get-student-payment-history",
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
    modifyCourse: "/api/employees/courses/modify-course",
    getCourse: "/api/employees/courses/get-course",
    getCourseDetail: "/api/employees/courses/get-course/",
    reopenCourse: "/api/employees/courses/reopen-course",
    closeCourse: "/api/employees/courses/close-course",
    lockCourse: "/api/employees/courses/lock-course",
    unLockCourse: "/api/employees/courses/unlock-course",
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
    removeParentFromStudent: "/api/employees/student/remove-parent",
    getSalaries: "/api/employees/personal/get-salaries",
    getSalariesByBranch: "/api/employees/transaction/get-salaries",
    getFeesByBranch: "/api/employees/transaction/get-fees",
    getRefundsByBranch: "/api/employees/transaction/get-refunds",
    getTeachersByBranch: "/api/employees/workers/get-teachers",
    getTutorsByBranch: "/api/employees/workers/get-tutors",
    getEmployeesByBranch: "/api/employees/workers/get-employees",
    checkStudentParticipateCourse: "/api/employees/courses/check-student-participate-course",
    addParticipation: "/api/employees/courses/add-participation",
    removeParticipation: "/api/employees/courses/remove-participation",
    getLeftMoneyAmount: "/api/employees/courses/get-left-money-amount",
    createSalary: "/api/employees/workers/create-salary",
    getLateFeeStudent: "/api/employees/student/get-late-fee-students",
    notifyLateFeeStudent: "/api/employees/student/notify-late-fee-students",
    getUnpaidFee: "/api/employees/student/get-unpaid-fee",
    payFee: "/api/employees/student/pay-fee",

    //Business
    getRevenueReport: "/api/employees/business/get-revenue-report",
    getSalaryReport: "/api/employees/business/get-salary-report",
    getStudentReport: "/api/employees/business/get-student-report",
    getProfitReport: "/api/employees/business/get-profit-report",
    getCourseReport: "/api/employees/business/get-course-report",
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
  },
  guests: {
    getCourses: "/api/guests/get-courses",
    getStudentCount: "/api/guests/get-student-count",
    getCompletedCourseCount: "/api/guests/get-completed-course-count",
    getCurriculumTags: "/api/guests/get-curriculum-tags",
    getBranches: "/api/guests/get-branches",
    getTopComments: "/api/guests/get-top-comments",
    getCourseDetail: "/api/guests/get-course-detail",
    checkAttendCourse: "/api/guests/check-attend-course",
    countStudentAttendCourse: "/api/guests/get-student-attend-course",
  },
  payments: {
    getStudentOrderDetail: "/api/payments/get-student-order-detail",
    onSuccessParticipateCourse: "/api/payments/on-success-student-participate-course",
    studentPayment: "/api/payments/student-payment",
    parentPayment: "/api/payments/parent-payment",
  }
};

export const SocketBaseUrl = production ? "wss://root-smile-370415.as.r.appspot.com" : "ws://localhost:5000";
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

export enum AttendanceStatus {
  Attendance = "Attendance",
  AbsenceWithPermission = "AbsenceWithPermission",
  AbsenceWithoutPermission = "AbsenceWithoutPermission",
}

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
}

export const EmployeeConstants = {
  limitCourse: 12,
  limitStudySession: 12,
}

export const StudentConstants = {
  limitCourse: 12
}

export const TutorConstants = {
  limitCourse: 12,
  limitSchedule: 12,
  limitStudySession: 12,
  limitStudent: 12,
}

export const ChatConstants = {
  limitMessage: 10
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
    getEmployeeByBranch: "/api/teachers/courses/get-employee-by-branch",
    getCurriculumTags: "/api/teachers/curriculum/get-curriculum-tags",
  },
  students: {
    getTimetable: "/api/students/timetable",
    getCourse: "/api/students/courses/get-course",
    getCourseDetail: "/api/students/courses/get-course/",
    sendAssessCourse: "/api/students/courses/assess-course",
    getAttendance: "/api/students/courses/attendance-course/",
  },
  employees: {
    getPersonalInformation: "/api/employees/personal/get-personal-information",
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
    getStudySessions: "/api/tutors/courses/get-study-sessions",
    getStudySessionDetail: "/api/tutors/courses/get-study-session-detail",
    getEmployeeByBranch: "/api/tutors/courses/get-employee-by-branch",
  }
};

export const SocketBaseUrl = "ws://localhost:5000";
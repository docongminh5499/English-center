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
  Cancel = "Cancel",
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
}

export const StudentConstants = {
  limitCourse: 12
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
    getStudents: "/api/teachers/courses/get-students/",
    getExercises: "/api/teachers/courses/get-exercises/",
    deleteExercise: "/api/teachers/courses/delete-exercise/",
    getDocuments: "/api/teachers/courses/get-documents/",
    deleteDocument: "/api/teachers/courses/delete-document/",
    createDocument: "/api/teachers/courses/create-document",
    getPersonalInformation: "/api/teachers/personal/get-personal-information",
    modifyPersonalInformation: "/api/teachers/personal/modify-personal-information",
    getCurriculumList: "/api/teachers/curriculum/get-curriculum",
    getCurriculum: "/api/teachers/curriculum/get-curriculum/",
    modifyCurriculum: "/api/teachers/curriculum/modify-curriculum",
    createCurriculum: "/api/teachers/curriculum/create-curriculum",
    deleteCurriculum: "/api/teachers/curriculum/delete-curriculum/",
    getComments: "/api/teachers/courses/get-comments/",
  },
  students: {
    getTimetable: "/api/students/timetable",
    getCourse: "/api/students/courses/get-course",
    getCourseDetail: "/api/students/courses/get-course/",
    sendAssessCourse: "/api/students/courses/assess-course",
    getAttendance: "/api/students/courses/attendance-course/",
  }
};

export const SocketBaseUrl = "ws://localhost:5000";
export const TimeZoneOffset =  new Date().getTimezoneOffset() * (-1);

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

export const LocalStorageKey = {
  USER: "EnglishCenter-User",
};

export const CookieKey = {
  USER: "EnglishCenter-User"
};

export const TeacherConstants = {
  limitCourse: 12
}

export const ChatConstants = {
  limitMessage: 10
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
    signUp: "/api/users/sign-up",
    checkOldEmail: "/api/users/sign-up/check-old-email",
  },
  teachers: {
    getCourse: "/api/teachers/courses/get-course",
  },
};

export const SocketBaseUrl = "ws://localhost:5000";
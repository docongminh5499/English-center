export enum UserRole {
  GUEST = "guest",
  ADMIN = "admin",
  TEACHER = "teacher",
  EMPLOYEE = "employee",
  TUTOR = "tutor",
  STUDENT = "student",
  PARENT = "parent",
}

export const LocalStorageKey = {
  USER: "EnglishCenter-User",
};

export const Url = {
  baseUrl: 'http://localhost:5000',
  users: {
    signIn: "/api/users/sign-in",
  },
};

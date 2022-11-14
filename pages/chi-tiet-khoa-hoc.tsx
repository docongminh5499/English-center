import React from 'react'
import DetailsCourseScreen from "../components/pageComponents/DetailsCourse";
import { GetServerSideProps } from "next";
import { CookieKey, UserRole } from "../helpers/constants";
import { CustomNextPage } from "../interfaces/page.interface";
import { CookieParser } from "../helpers/cookieParser";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";

const ListCourse: CustomNextPage = (props) => {
  return <DetailsCourseScreen {...props} />;
};

ListCourse.allowUsers = [
  UserRole.GUEST,
  UserRole.ADMIN,
  UserRole.EMPLOYEE,
  UserRole.PARENT,
  UserRole.STUDENT,
  UserRole.TEACHER,
  UserRole.TUTOR,
];
// Home.displaySidebar = false;
ListCourse.displaySidebar = true;
export default ListCourse;

export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  return { props: { userRole: user.role || null } };
})
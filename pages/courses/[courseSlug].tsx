import React from 'react'
import DetailsCourseScreen from "../../components/pageComponents/DetailsCourse";
import { GetServerSideProps } from "next";
import { CookieKey, Url, UserRole } from "../../helpers/constants";
import { CustomNextPage } from "../../interfaces/page.interface";
import { CookieParser } from "../../helpers/cookieParser";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import API from '../../helpers/api';

const ListCourse: CustomNextPage = (props) => {
  return <DetailsCourseScreen isAttended={false} course={null} {...props} />;
};

ListCourse.allowUsers = [
  UserRole.GUEST,
  UserRole.PARENT,
  UserRole.STUDENT,
];
ListCourse.displaySidebar = false;
export default ListCourse;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const [course, isAttended] = await Promise.all([
      API.post(Url.guests.getCourseDetail, { courseSlug: context.params?.courseSlug }),
      API.post(Url.guests.checkAttendCourse, {
        token: user.token,
        courseSlug: context.params?.courseSlug,
        studentId: user.userId
      }),
    ]);
    return { props: { userRole: user.role || null, course: course, isAttended: isAttended } };
  } catch (error: any) {
    return { props: { userRole: user.role || null, course: null, isAttended: false } }
  };
}
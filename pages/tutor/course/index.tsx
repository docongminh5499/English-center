import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import TutorCourseScreen from "../../../components/pageComponents/TutorScreen/TutorCourseScreen";
import API from "../../../helpers/api";
import { CookieKey, TutorConstants, Url, UserRole } from "../../../helpers/constants";
import { CookieParser } from "../../../helpers/cookieParser";
import { CustomNextPage } from "../../../interfaces/page.interface";
import Pageable from "../../../models/pageable.model";

const TutorCoursePage: CustomNextPage = (props) => {
  return <TutorCourseScreen {...props} />
}

TutorCoursePage.allowUsers = [
  UserRole.TUTOR,
];
export default TutorCoursePage;




export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context): Promise<any> => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const responses = await API.get(Url.tutors.getCourse, {
      token: user.token,
      limit: TutorConstants.limitCourse,
      skip: 0
    });
    const pageable: Pageable = {
      limit: responses.limit,
      skip: responses.skip,
      total: responses.total
    };
    const courses = responses.courses;
    return { props: { userRole: user.role, courses, pageable, error: null } };
  } catch (error: any) {
    return { props: { userRole: user.role, courses: [], pageable: null, error: true } };
  }
});
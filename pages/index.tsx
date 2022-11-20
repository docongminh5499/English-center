import HomeScreen from "../components/pageComponents/HomeScreen";
import { GetServerSideProps } from "next";
import { CookieKey, GuestConstants, Url, UserRole } from "../helpers/constants";
import { CustomNextPage } from "../interfaces/page.interface";
import { CookieParser } from "../helpers/cookieParser";
import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import API from "../helpers/api";

const Home: CustomNextPage = (props) => {
  return <HomeScreen studentCounts={0} courseCounts={0} curriculumTags={[]} branches={[]} comments={[]} courses={[]} {...props} />;
};

Home.allowUsers = [
  UserRole.GUEST,
  UserRole.ADMIN,
  UserRole.EMPLOYEE,
  UserRole.PARENT,
  UserRole.STUDENT,
  UserRole.TEACHER,
  UserRole.TUTOR,
];
Home.displaySidebar = false;
export default Home;

export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context): Promise<any> => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const [courses, studentCounts, courseCounts, curriculumTags, branches, comments] = await Promise.all([
      API.post(Url.guests.getCourses, { skip: 0, limit: GuestConstants.topLatestCourse }),
      API.get(Url.guests.getStudentCount),
      API.get(Url.guests.getCompletedCourseCount),
      API.get(Url.guests.getCurriculumTags),
      API.get(Url.guests.getBranches),
      API.get(Url.guests.getTopComments),
    ]);
    return {
      props: {
        userRole: user.role || null,
        courses: courses.courses,
        studentCounts: studentCounts,
        courseCounts: courseCounts,
        curriculumTags: curriculumTags,
        branches: branches,
        comments: comments,
      }
    };
  } catch (error: any) {
    return {
      props: {
        userRole: user.role || null,
        courses: [],
        studentCounts: 0,
        courseCounts: 0,
        curriculumTags: [],
        branches: [],
        comments: [],
      }
    };
  }
})
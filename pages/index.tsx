import { GetServerSideProps } from "next";
import HomeScreen from "../components/pageComponents/HomeScreen";
import API from "../helpers/api";
import { CookieKey, GuestConstants, Url, UserRole } from "../helpers/constants";
import { CookieParser } from "../helpers/cookieParser";
import { CustomNextPage } from "../interfaces/page.interface";

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

export const getServerSideProps: GetServerSideProps = async (context): Promise<any> => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const courses = await API.post(Url.guests.getCourses, { skip: 0, limit: GuestConstants.topLatestCourse });
    return {
      props: {
        userRole: user.role || null,
        courses: courses.courses,
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
}
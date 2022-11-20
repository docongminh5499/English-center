import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { GetServerSideProps } from "next";
import AllCourseScreen from "../../components/pageComponents/AllCourseScreen";
import API from "../../helpers/api";
import { CookieKey, GuestConstants, Url, UserRole } from "../../helpers/constants";
import { CookieParser } from "../../helpers/cookieParser";
import { CustomNextPage } from "../../interfaces/page.interface";

const AllCoursePage: CustomNextPage = (props) => {
	return <AllCourseScreen branches={[]} tags={[]} courses={[]} total={0} {...props} />;
};

AllCoursePage.allowUsers = [
	UserRole.GUEST,
	UserRole.PARENT,
	UserRole.STUDENT,
];
AllCoursePage.displaySidebar = false;
export default AllCoursePage;

export const getServerSideProps: GetServerSideProps = gsspWithNonce(async (context) => {
	const cookies = CookieParser.parse(context.req.headers.cookie);
	const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
	try {
		const [responses, branches, tags] = await Promise.all([
			API.post(Url.guests.getCourses, { skip: 0, limit: GuestConstants.limitCourse }),
			API.get(Url.guests.getBranches),
			API.get(Url.guests.getCurriculumTags),
		]);
		return {
			props: {
				userRole: user.role || null,
				courses: responses.courses,
				total: responses.total,
				branches: branches,
				tags: tags
			}
		};
	} catch (error: any) {
		return {
			props: {
				userRole: user.role || null,
				courses: [],
				total: 0,
				branches: [],
				tags: [],
			}
		}
	};
})
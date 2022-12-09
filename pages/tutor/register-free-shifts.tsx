import { GetServerSideProps } from "next";
import TutorRegisterShiftScreen from "../../components/pageComponents/TutorScreen/TutorRegisterShiftScreen";
import API from "../../helpers/api";
import { CookieKey, Url, UserRole } from "../../helpers/constants";
import { CookieParser } from "../../helpers/cookieParser";
import { CustomNextPage } from "../../interfaces/page.interface";

const TutorRegisterFreeShiftPage: CustomNextPage = (props) => {
  return <TutorRegisterShiftScreen allShifts={[]} freeShifts={[]} {...props} />
}

TutorRegisterFreeShiftPage.allowUsers = [
  UserRole.TUTOR,
];
export default TutorRegisterFreeShiftPage;




export const getServerSideProps: GetServerSideProps = async (context): Promise<any> => {
  const cookies = CookieParser.parse(context.req.headers.cookie);
  const user = cookies[CookieKey.USER] ? JSON.parse(cookies[CookieKey.USER]) : { role: UserRole.GUEST };
  try {
    const [allShifts, freeShifts] = await Promise.all([
      API.get(Url.tutors.getAllShifts, { token: user.token }),
      API.get(Url.tutors.getFreeShifts, { token: user.token }),
    ])
    return { props: { userRole: user.role, allShifts: allShifts, freeShifts: freeShifts } };
  } catch (error: any) {
    return { props: { userRole: user.role, allShifts: [], freeShifts: [] } };
  }
}
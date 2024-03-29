import { Container, Space } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserRole } from "../../../../helpers/constants";
import UserStudent from "../../../../models/userStudent.model";
import Loading from "../../../commons/Loading";
import InfoUser from './components/InfoUser';


interface IProps {
  userRole?: UserRole | null;
  student: UserStudent | null;
}

const TempleteScreen = (props: IProps) => {
  const [didMount, setDidMount] = useState(false);
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const router = useRouter();

  useEffect(() => {
    if (props.student === null)
      router.replace('/not-found');
    else setDidMount(true);
  }, []);

  return (
    <>
      <Head>
        <title>Chi tiết học viên</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!didMount && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Loading />
        </Container>
      )}

      {didMount && (
        <Container size="xl" style={{ width: "100%" }} pb={'5rem'} >
          <InfoUser
            title={'Thông tin học sinh'}
            data={props.student?.user}
          />
          <Space h={30} />
          <InfoUser
            title={'Thông tin phụ huynh'}
            data={props.student?.userParent?.user}
          />
          <Space h={10} />
        </Container>
      )}
    </>
  );
};

export default TempleteScreen;

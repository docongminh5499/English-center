import Head from "next/head";
import { Container, Space } from "@mantine/core";
import { Url, UserRole } from "../../../../helpers/constants";
import { useCallback, useEffect, useState } from "react";
import InfoUser from './components/InfoUser'
import UserStudent from "../../../../models/userStudent.model";
import { useRouter } from "next/router";
import Loading from "../../../commons/Loading";
import InfoUserParent from "./components/infoUserParent";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { useAuth } from "../../../../stores/Auth";

interface IProps {
  userRole?: UserRole | null;
  student: UserStudent | null;
}

const StudentDetailScreen = (props: IProps) => {
  const [authState] = useAuth();
  const [didMount, setDidMount] = useState(false);
  const [userParent, setUserParent] = useState(props.student?.userParent);
  const router = useRouter();


  const onChooseParent = useCallback(async (parentId: number) => {
    try {
      const responses = await API.post(Url.employees.modifyParentForStudent, {
        token: authState.token,
        studentId: props.student?.user.id,
        version: props.student?.version,
        parentId: parentId,
      });
      if (responses === null)
        toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại.")
      else {
        setUserParent(responses);
        toast.success("Cập nhật thông tin thành công.");
      }
    } catch (err) {
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [authState.token, props.student?.user.id, props.student?.version]);


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
            title={'Học sinh'}
            data={props.student?.user}
          />
          <Space h={30} />
          <InfoUserParent
            title={'Phụ huynh'}
            data={userParent?.user}
            onChooseParent={onChooseParent}
          />
          <Space h={30} />
        </Container>
      )}
    </>
  );
};

export default StudentDetailScreen;
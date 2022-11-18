import { Container, Group, Input, Title, Text, ScrollArea, SimpleGrid, Avatar, Loader } from "@mantine/core";
import { useInputState, useMediaQuery } from "@mantine/hooks";
import { FormEvent, useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { EmployeeConstants, Url } from "../../../../helpers/constants";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";
import UserStudent from "../../../../models/userStudent.model";
import { useAuth } from "../../../../stores/Auth";
import Loading from "../../../commons/Loading";
import styles from './employeeCreateCourse.module.css';


interface IProps {
  onChooseStudent: (student: UserStudent) => Promise<void>;
  loading: boolean;
}


const FindStudentModal = (props: IProps) => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const viewport = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

  const [authState] = useAuth();
  const [findName, setFindName] = useInputState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [listStudents, setListStudents] = useState<UserStudent[]>([]);
  const [total, setTotal] = useState(0);


  const getStudents = useCallback(async (limit: number, skip: number, query: string) => {
    return await API.post(Url.employees.getAllStudents, {
      token: authState.token,
      limit: limit,
      skip: skip,
      query: query,
      checkQuery: true,
    });
  }, [authState.token]);



  const onSubmitSearchForm = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoadingMore(false);
      setLoading(true);
      setError(false);
      setListStudents([]);
      setTotal(0);
      const responses = await getStudents(EmployeeConstants.limitStudent, 0, findName);
      setListStudents(responses.students);
      setTotal(responses.total);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(true);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại");
    }
  }, [findName]);


  const onScrollPositionChange = useCallback(async (positions: any) => {
    const verticalThreshold = 50;
    if (!isLoadingMore && total > listStudents.length &&
      viewport.current.offsetHeight + viewport.current.scrollTop >= viewport.current.scrollHeight - verticalThreshold) {
      try {
        setIsLoadingMore(true);
        const responses = await getStudents(EmployeeConstants.limitStudent, listStudents.length, findName);
        setListStudents(listStudents.concat(responses.students));
        setTotal(responses.total);
        setIsLoadingMore(false);
      } catch (error) {
        console.log(error);
        setIsLoadingMore(false);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại");
      }
    }
  }, [authState.token, findName, isLoadingMore, total, listStudents, viewport.current]);



  return (
    <Container style={{ width: "100%" }} p={0} size="xl">
      <Title align="center" size="2rem" color="#444" transform="uppercase" mb={20}>
        Tìm học viên
      </Title>
      <Group style={{ flexDirection: !isMobile ? "row" : "column" }}>
        <form onSubmit={onSubmitSearchForm} style={{ width: "100%" }}>
          <Input
            value={findName}
            onChange={setFindName}
            placeholder="Nhập tên hoặc mã số của học viên"
          />
        </form>
      </Group>

      {(loading || props.loading) && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "300px"
        }} p={10} size="xl">
          <Loading />
        </Container>
      )}

      {!loading && !props.loading && error && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "300px"
        }} p={10} size="xl">
          <Text color="#ADB5BD" style={{ fontSize: "2rem" }} weight={600} align="center">
            Hệ thống gặp sự cố, vui lòng thử lại
          </Text>
        </Container>
      )}

      {!loading && !props.loading && !error && listStudents.length === 0 && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "300px"
        }} p={10} size="xl">
          <Text color="#ADB5BD" style={{ fontSize: "2rem" }} weight={600} align="center">
            Không tìm thấy học viên phù hợp
          </Text>
        </Container>
      )}

      {!loading && !props.loading && !error && listStudents.length > 0 && (
        <ScrollArea
          style={{ height: 300 }}
          mt={10}
          viewportRef={viewport}
          onScrollPositionChange={onScrollPositionChange}>
          <SimpleGrid cols={isMobile ? 1 : 2} p="md" spacing="sm">
            {listStudents.map((student, index) => (
              <Group
                key={index}
                noWrap
                onClick={() => props.onChooseStudent(student)}
                style={{ flexDirection: "column" }}
                className={styles.teacherCard}>
                <Avatar
                  size={40}
                  color="blue"
                  radius='xl'
                  src={getAvatarImageUrl(student.user.avatar)}
                />
                <Container style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  justifyContent: "flex-start",
                  alignItems: "center"
                }} p={0}>
                  <Text style={{ fontSize: "1.4rem" }} weight={500} color="#444" align="center">
                    {student.user.fullName}
                  </Text>
                  <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">MSHV: {student.user.id}</Text>
                </Container>
              </Group>
            ))}
            {isLoadingMore && (
              <Container style={{ display: "flex", justifyContent: "center" }} my={20} p={0}>
                <Loader variant='dots' />
              </Container>
            )}
          </SimpleGrid>
        </ScrollArea>
      )}
    </Container>
  );
}



export default FindStudentModal;
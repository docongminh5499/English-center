import { Container, Group, TextInput, Title, Text, ScrollArea, SimpleGrid } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../../../../helpers/api";
import { Url } from "../../../../helpers/constants";
import Classroom from "../../../../models/classroom.model";
import { useAuth } from "../../../../stores/Auth";
import Loading from "../../../commons/Loading";
import styles from './employeeCreateCourse.module.css';


interface IProps {
  studySessionId?: number;
  branchId: number;
  date: Date;
  shiftIds: number[];
  onChooseClassroom: (classroom: Classroom) => void;
}

const SearchClassroomFormModifySession = (props: IProps) => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const [authState] = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);


  const filteredClassrooms = useMemo(() => {
    return classrooms.filter(classroom => classroom.name.toLowerCase().includes(name.toLowerCase()));
  }, [classrooms, classrooms.length, name]);



  const didMountFunction = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const classrooms = await API.post(Url.employees.getAvailableClassroomInDate, {
        token: authState.token,
        branchId: props.branchId,
        date: props.date,
        shiftIds: props.shiftIds,
        studySession: props.studySessionId,
      })
      setClassrooms(classrooms);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }, [authState.token, props.branchId, props.date, props.shiftIds, props.studySessionId]);


  useEffect(() => {
    didMountFunction();
  }, []);


  return (
    <Container style={{ backgroundColor: "#F1F3F5", width: "100%", borderRadius: 5 }} p={6}>
      <Title align="center" size="1.6rem" color="#444" transform="uppercase" my={10}>
        Tìm phòng học
      </Title>
      <Group style={{ flexDirection: !isMobile ? "row" : "column" }}>
        <TextInput
          readOnly={loading || error}
          styles={{
            input: { color: "#444" },
            wrapper: { width: "100%" },
            root: { width: "100%", flex: 1 }
          }}
          value={name}
          placeholder="Tên phòng học"
          onChange={(event) => setName(event.currentTarget.value)}
        />
      </Group>

      {loading && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F1F3F5",
          borderRadius: 5,
          width: "100%",
          height: "200px"
        }} p={10} size="xl">
          <Loading />
        </Container>
      )}

      {!loading && error && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F1F3F5",
          borderRadius: 5,
          width: "100%",
          height: "200px"
        }} p={10} size="xl">
          <Text color="#ADB5BD" style={{ fontSize: "2rem" }} weight={600} align="center">
            Hệ thống gặp sự cố, vui lòng thử lại
          </Text>
        </Container>
      )}

      {!loading && !error && filteredClassrooms.length === 0 && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F1F3F5",
          borderRadius: 5,
          width: "100%",
          height: "200px"
        }} p={10} size="xl">
          <Text color="#ADB5BD" style={{ fontSize: "2rem" }} weight={600} align="center">
            Không tìm thấy phòng học phù hợp
          </Text>
        </Container>
      )}

      {!loading && !error && filteredClassrooms.length > 0 && (
        <ScrollArea style={{ height: 200 }} mt={10}>
          <SimpleGrid cols={2} p="md" spacing="sm">
            {filteredClassrooms.map((classroom, index) => (
              <Group
                key={index}
                onClick={() => props.onChooseClassroom(classroom)}
                style={{ flexDirection: isTablet ? "column" : "row" }}
                className={styles.teacherCard}>
                <Container style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  justifyContent: "flex-start",
                  alignItems: isTablet ? "center" : "flex-start"
                }} p={0}>
                  <Text style={{ fontSize: "1.4rem" }} weight={500} color="#444" align="center">
                    {classroom.name}
                  </Text>
                  <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">Sức chứa: {classroom.capacity}</Text>
                </Container>
              </Group>
            ))}
          </SimpleGrid>
        </ScrollArea>
      )}
    </Container>
  )
}



export default SearchClassroomFormModifySession;
import { Avatar, Container, Group, ScrollArea, Select, SimpleGrid, Text, TextInput, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../../../../helpers/api";
import { Url } from "../../../../helpers/constants";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";
import Branch from "../../../../models/branch.model";
import UserTutor from "../../../../models/userTutor.model";
import { useAuth } from "../../../../stores/Auth";
import Loading from "../../../commons/Loading";
import BranchSelectItem from "../ItemComponent/branchSelectItem";
import styles from './employeeCreateCourse.module.css';


interface IProps {
  branchId: number;
  date: Date;
  shiftIds: number[];
  onChooseTutor: (tutor: UserTutor) => void;
}


const SearchTutorFormCreateSession = (props: IProps) => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const [authState] = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [branchesSelectItem, setBranchesSelectItem] = useState([]);
  const [currentBranchId, setCurrentBranchId] = useState<number | null>(null);
  const [tutors, setTutors] = useState<UserTutor[]>([]);


  const filteredTutors = useMemo(() => {
    return tutors.filter(tutor =>
      tutor.worker.user.fullName.toLowerCase().includes(name.toLowerCase()) ||
      tutor.worker.user.id.toString().includes(name.toLowerCase()))
  }, [tutors, tutors.length, name]);


  const onChangeBranch = useCallback(async () => {
    setLoading(true);
    setError(false);
    setName("");
    try {
      const branchId = currentBranchId === null ? props.branchId : currentBranchId;
      const tutors = await API.post(Url.employees.getAvailableTutorsInDate, {
        token: authState.token,
        branchId: branchId,
        date: props.date,
        shiftIds: props.shiftIds,
        studySession: -1,
      });
      setTutors(tutors);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }, [authState.token, currentBranchId, props.branchId, props.date, props.shiftIds]);



  const didMountFunction = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const branchId = currentBranchId === null ? props.branchId : currentBranchId;
      const [branches, tutors] = await Promise.all([
        API.get(Url.employees.getBranches, { token: authState.token }),
        API.post(Url.employees.getAvailableTutorsInDate, {
          token: authState.token,
          branchId: branchId,
          date: props.date,
          shiftIds: props.shiftIds,
        })
      ]);
      const selectItems: any = [];
      let foundBranch = null;
      branches.forEach((branch: Branch) => {
        selectItems.push({ key: branch.id, label: branch.name, value: branch.id, branch: branch });
        if (branch.id === props.branchId) foundBranch = branch.id;
      });
      setCurrentBranchId(foundBranch);
      setBranchesSelectItem(selectItems);
      setTutors(tutors);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }, [authState.token, currentBranchId, props.branchId, props.date, props.shiftIds]);


  useEffect(() => {
    didMountFunction();
  }, []);


  useEffect(() => {
    onChangeBranch();
  }, [currentBranchId]);


  return (
    <Container style={{ backgroundColor: "#F1F3F5", width: "100%", borderRadius: 5 }} p={6}>
      <Title align="center" size="1.6rem" color="#444" transform="uppercase" my={10}>
        Tìm trợ giảng
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
          placeholder="Tên trợ giảng"
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <Select
          styles={{
            wrapper: { width: "100%" },
            root: { width: "100%", flex: 1 }
          }}
          value={currentBranchId as any}
          onChange={(item: any) => setCurrentBranchId(item)}
          readOnly={loading || error}
          placeholder="Chi nhánh"
          searchable
          nothingFound="Không có chi nhánh phù hợp"
          data={branchesSelectItem}
          maxDropdownHeight={400}
          itemComponent={BranchSelectItem}
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

      {!loading && !error && filteredTutors.length === 0 && (
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
            Không tìm thấy trợ giảng phù hợp
          </Text>
        </Container>
      )}

      {!loading && !error && filteredTutors.length > 0 && (
        <ScrollArea style={{ height: 200 }} mt={10}>
          <SimpleGrid cols={1} p="md" spacing="sm">
            {filteredTutors.map((tutor, index) => (
              <Group
                key={index}
                noWrap
                onClick={() => props.onChooseTutor(tutor)}
                className={styles.teacherCard}>
                <Avatar
                  size={40}
                  color="blue"
                  radius='xl'
                  src={getAvatarImageUrl(tutor.worker.user.avatar)}
                />
                <Container style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  justifyContent: "flex-start",
                  alignItems: "flex-start"
                }} p={0}>
                  <Text style={{ fontSize: "1.4rem" }} weight={500} color="#444" align="center">
                    {tutor.worker.user.fullName}
                  </Text>
                  <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">MSTG: {tutor.worker.user.id}</Text>
                </Container>
              </Group>
            ))}
          </SimpleGrid>
        </ScrollArea>
      )}
    </Container>
  )
}



export default SearchTutorFormCreateSession;
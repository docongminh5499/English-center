import { Avatar, Container, Group, Input, ScrollArea, Select, Title, Text, SimpleGrid } from "@mantine/core"
import { useInputState, useMediaQuery } from "@mantine/hooks";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";
import BranchSelectItem from '../../../commons/BranchSelectItem';
import styles from './employeeCreateCourse.module.css';


const branches = [
  {
    name: "Tên chi nhánh",
    address: "Q10, Thành phố Hồ Chí Minh",
    value: "1"
  }
];

const SearchTeacherForm = () => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const [name, setName] = useInputState("");
  return (
    <Container style={{ backgroundColor: "#F1F3F5", width: "100%", borderRadius: 5 }} p={10} size="xl">
      <Title align="center" size="2rem" color="#444" transform="uppercase" my={20}>
        Tìm giáo viên
      </Title>
      <Group grow>
        <Input
          styles={{ input: { color: "#444" } }}
          value={name}
          placeholder="Tên giáo viên"
          onChange={setName}
        />
        <Select
          placeholder="Chi nhánh"
          searchable
          nothingFound="Không có khóa học phù hợp"
          data={branches}
          maxDropdownHeight={400}
          itemComponent={BranchSelectItem}
          filter={(value, item) => item.name.toLowerCase().includes(value.toLowerCase().trim())}
        />
      </Group>
      <ScrollArea style={{ height: 300 }}>
        <SimpleGrid cols={3} p="md" spacing="sm">
          {Array(8).fill(0).map((_, index) => (
            <Group
              key={index}
              style={{ flexDirection: isTablet ? "column" : "row" }}
              className={styles.teacherCard}>
              <Avatar
                size={60}
                color="blue"
                radius='xl'
                src={getAvatarImageUrl(undefined)}
              />
              <Container style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                justifyContent: "flex-start",
                alignItems: isTablet ? "center" : "flex-start"
              }} p={0}>
                <Text style={{ fontSize: "1.4rem" }} weight={500} color="#444" align="center">
                  Name
                </Text>
                <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">MSGV: 123</Text>
              </Container>
            </Group>
          ))}
        </SimpleGrid>
      </ScrollArea>
    </Container>
  )
}


export default SearchTeacherForm;
import { Avatar, Container, Grid, Group, Input, SimpleGrid, Space, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Button from "../../../commons/Button";

const CourseStudent = () => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  return (
    <Container size="xl" p={0}>
      <Text color="#444" transform="uppercase" align="center" weight={600} style={{ fontSize: "2.6rem" }}>
        Danh sách học viên
      </Text>
      <Text color="dimmed" align="center" weight={600} style={{ fontSize: "1.8rem" }}>
        Sĩ số: 20
      </Text>
      <Space h={20} />
      <Grid>
        {!isTablet && (<Grid.Col span={3}></Grid.Col>)}
        <Grid.Col span={isTablet ? (isMobile ? 12 : 8) : 4}>
          <Input
            styles={{ input: { color: "#444" } }}
            value={undefined}
            placeholder="Tìm kiếm theo tên hoặc MSHV"
            onChange={() => null}
          />
        </Grid.Col>
        <Grid.Col span={isTablet ? (isMobile ? 12 : 4) : 2}>
          <Button fullWidth>Tìm kiếm</Button>
        </Grid.Col>
      </Grid>

      <Space h={20} />

      <SimpleGrid cols={2} p="md" spacing="xl">

        <Group
          onClick={() => console.log("A")}
          style={{
            cursor: "pointer",
            flexDirection: isTablet ? "column" : "row"
          }}>
          <Avatar size={60} color="blue" radius='xl'>A</Avatar>
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: isTablet ? "center" : "flex-start"
          }} >
            <Text style={{ fontSize: "1.4rem" }} weight={500} color="#444" align="center">Đỗ Công Minh Long Name Text</Text>
            <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">MSHV: 1</Text>
            <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">Ngày sinh: 05/04/1999</Text>
          </div>
        </Group>

        <Group
          onClick={() => console.log("B")}
          style={{
            cursor: "pointer",
            flexDirection: isTablet ? "column" : "row"
          }}>
          <Avatar size={60} color="blue" radius='xl'>A</Avatar>
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: isTablet ? "center" : "flex-start"
          }} >
            <Text style={{ fontSize: "1.4rem" }} weight={500} color="#444" align="center">Đỗ Công Minh Long Name Text</Text>
            <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">MSHV: 1</Text>
            <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">Ngày sinh: 05/04/1999</Text>
          </div>
        </Group>

        <Group
          onClick={() => console.log("C")}
          style={{
            cursor: "pointer",
            flexDirection: isTablet ? "column" : "row"
          }}>
          <Avatar size={60} color="blue" radius='xl'>A</Avatar>
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: isTablet ? "center" : "flex-start"
          }} >
            <Text style={{ fontSize: "1.4rem" }} weight={500} color="#444" align="center">Đỗ Công Minh Long Name Text</Text>
            <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">MSHV: 1</Text>
            <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">Ngày sinh: 05/04/1999</Text>
          </div>
        </Group>

      </SimpleGrid>
      <Space h={20} />
    </Container>
  );
}

export default CourseStudent;
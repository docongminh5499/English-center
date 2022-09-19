import { Avatar, Container, Grid, Group, Input, SimpleGrid, Space, Text } from "@mantine/core";
import Button from "../../../commons/Button";

const CourseStudent = () => {
  return (
    <Container size="lg" p={0}>
      <Grid>
        <Grid.Col span={4}>
          <Input
            styles={{ input: { color: "#444" } }}
            value={undefined}
            placeholder="Tìm kiếm theo tên"
            onChange={() => null}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Input
            styles={{ input: { color: "#444" } }}
            value={undefined}
            placeholder="Tìm kiếm theo MSHV"
            onChange={() => null}
          />
        </Grid.Col>
        <Grid.Col span={1}></Grid.Col>
        <Grid.Col span={3}>
          <Button fullWidth>Tìm kiếm</Button>
        </Grid.Col>
      </Grid>

      <Space h={20} />

      <SimpleGrid cols={2} p="md" spacing="xl">
        <Group>
          <Avatar size={60} color="blue" radius='xl'>A</Avatar>
          <div>
            <Text weight={500} color="#444">Đỗ Công Minh</Text>
            <Text size="xs" color="dimmed">MSHV: 1</Text>
            <Text size="xs" color="dimmed">Ngày sinh: 05/04/1999</Text>
          </div>
        </Group>
        <Group>
          <Avatar size={60} color="blue" radius='xl'>A</Avatar>
          <div>
            <Text weight={500} color="#444">Đỗ Công Minh</Text>
            <Text size="xs" color="dimmed">MSHV: 1</Text>
            <Text size="xs" color="dimmed">Ngày sinh: 05/04/1999</Text>
          </div>
        </Group>
        <Group>
          <Avatar size={60} color="blue" radius='xl'>A</Avatar>
          <div>
            <Text weight={500} color="#444">Đỗ Công Minh</Text>
            <Text size="xs" color="dimmed">MSHV: 1</Text>
            <Text size="xs" color="dimmed">Ngày sinh: 05/04/1999</Text>
          </div>
        </Group>
      </SimpleGrid>
    </Container>
  );
}

export default CourseStudent;
import { Container, Grid, Space, Text } from "@mantine/core";
import Button from "../../../commons/Button";

const CourseExercise = () => {
  return (
    <>
      <Container size="lg">
        <Grid>
          <Grid.Col span={10}>
            <Text weight={600} color="#444">Bài tập 1: SIMPLE PRESENT TENSE</Text>
            <Space h={8} />
            <Grid>
              <Grid.Col span={4}>
                <Text color="#444">Ngày diễn ra:  01/11/2021</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text color="#444">Ngày kết thúc:  01/11/2021</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text color="#444">Tình trạng: đã kết thúc</Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={2}>
            <Button compact fullWidth>Xem chi tiết</Button>
          </Grid.Col>
        </Grid>
      </Container>

      <Space h={40} />

      <Container size="lg">
        <Grid>
          <Grid.Col span={10}>
            <Text weight={600} color="#444">Bài tập 2: SIMPLE PRESENT TENSE</Text>
            <Space h={8} />
            <Grid>
              <Grid.Col span={4}>
                <Text color="#444">Ngày diễn ra:  01/11/2021</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text color="#444">Ngày kết thúc:  01/11/2021</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text color="#444">Tình trạng: đã kết thúc</Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col
            span={2}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.5rem" }}>
            <Button compact fullWidth size="xs">Xem chi tiết</Button>
            <Button compact color="red" fullWidth size="xs">Xóa bài tập</Button>
          </Grid.Col>
        </Grid>
      </Container>

      <Space h={100} />

      <Container style={{ display: "flex", justifyContent: "center" }}>
        <Button>Tạo bài tập mới</Button>
      </Container>
    </>
  );
}

export default CourseExercise;
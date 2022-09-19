import { Button, Container, Grid, Space, Stack, Text } from "@mantine/core";
import Comment from "../../../commons/Comment";
import Rating from "../../../commons/Rating";
import RatingProgress from "../../../commons/RatingProgress";

const CourseRating = () => {
  return (
    <Container size="lg">
      <Space h={20} />
      <Grid>
        <Grid.Col span={4} style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem"
        }}>
          <Text style={{ fontSize: "4rem" }} weight={600} align='center' color="#444">
            4.6
          </Text>
          <Rating score={3} size="2.8rem" />
          <Text color="dimmed" align="center">
            (100 bình luận)
          </Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Stack spacing="xs" justify="center">
            <RatingProgress score={5} value={50} />
            <RatingProgress score={4} value={80} />
            <RatingProgress score={3} value={10} />
            <RatingProgress score={2} value={20} />
            <RatingProgress score={1} value={10} />
          </Stack>
        </Grid.Col>
      </Grid>

      <Space h={40} />

      <Stack spacing="xl" justify="center">
        <Comment
          name="Đỗ Công Minh"
          score={3}
          date="17:00 20/08/2022"
          comment="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        />
        <Comment
          name="Đỗ Công Minh"
          score={3}
          date="17:00 20/08/2022"
          comment="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        />
         <Comment
          name="Đỗ Công Minh"
          score={3}
          date="17:00 20/08/2022"
          comment="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        />
      </Stack>

      <Space h={40} />

      <Container style={{ display: "flex", justifyContent: "center" }}>
        <Button>Xem tất cả</Button>
      </Container>
    </Container>
  );
}

export default CourseRating;
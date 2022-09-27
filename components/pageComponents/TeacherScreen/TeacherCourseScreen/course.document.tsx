import { Anchor, Container, Grid, Space, Text } from "@mantine/core";
import Link from "next/link";
import Button from "../../../commons/Button";

const CourseDocument = () => {
  return (
    <>
      <Container size="lg">
        <Grid>
          <Grid.Col span={8}>
            <Text weight={600} color="#444">Tài liệu 1: Book 1,  tác giả: Nguyễn Văn A, 2001</Text>
            <Space h={8} />
            <Link href="#!" passHref>
              <Anchor component="a">Tải về</Anchor>
            </Link>
          </Grid.Col>
          <Grid.Col span={2}>
            <Button compact fullWidth>Sửa tài liệu</Button>
          </Grid.Col>
          <Grid.Col span={2}>
            <Button color="red" compact fullWidth>Xóa tài liệu</Button>
          </Grid.Col>
        </Grid>
      </Container>

      <Space h={100} />


      <Container style={{ display: "flex", justifyContent: "center" }}>
        <Button>Tạo tài liệu mới</Button>
      </Container>
    </>
  );
}

export default CourseDocument;
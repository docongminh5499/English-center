import { Container, Divider, Grid, Group, Image, Loader, Space, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import Button from "../../../commons/Button";


const experienceTeaching = `
<p><b>Từ 2014 - 2018:</b> Maecenas quam metus, elementum rutrum facilisis et, rutrum vitae mi. Curabitur ex arcu, feugiat eu hendrerit ornare, eleifend non felis. Pellentesque mattis ultricies augue, quis condimentum libero placerat sit amet. In non ex quis augue finibus dictum. Donec fermentum sit amet enim at consectetur. Sed id iaculis metus.</p>

<p><b>Từ 2018 - 2020:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut efficitur nisl pellentesque, malesuada ante at, posuere arcu. Sed quis ante ac ante mattis malesuada. Nam imperdiet fringilla velit in euismod. Curabitur mollis urna rhoncus condimentum viverra. Duis nec enim vitae magna sagittis tincidunt. </p>

<p><b>Từ 2020 - nay:</b> Maecenas quam metus, elementum rutrum facilisis et, rutrum vitae mi. Curabitur ex arcu, feugiat eu hendrerit ornare, eleifend non felis. Pellentesque mattis ultricies augue, quis condimentum libero placerat sit amet. In non ex quis augue finibus dictum. Donec fermentum sit amet enim at consectetur. Sed id iaculis metus.</p>`

const shortDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut efficitur nisl pellentesque, malesuada ante at, posuere arcu. Sed quis ante ac ante mattis malesuada. Nam imperdiet fringilla velit in euismod. Curabitur mollis urna rhoncus condimentum viverra. Duis nec enim vitae magna sagittis tincidunt. Maecenas quam metus, elementum rutrum facilisis et, rutrum vitae mi. Curabitur ex arcu, feugiat eu hendrerit ornare, eleifend non felis. Pellentesque mattis ultricies augue, quis condimentum libero placerat sit amet. In non ex quis augue finibus dictum. Donec fermentum sit amet enim at consectetur. Sed id iaculis metus.';


const TeacherPersonalScreen = () => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Tài khoản cá nhân</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container size="xl" style={{ width: "100%" }} p={isMobile ? 8 : 20}>
        <Container style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Image
            withPlaceholder
            placeholder={
              <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "300px" }}>
                <Loader variant="dots" />
              </Container>
            }
            style={{ maxWidth: "300px" }}
            radius="md"
            src="https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            alt="Hình đại diện"
          />
        </Container>
        <Space h={20} />
        <Grid>
          <Grid.Col span={isLargeTablet ? 12 : 5}>
            <Group position="apart">
              <Text weight={600} color="#444" mr={5}>Họ và tên: </Text>
              <Text color="#444">Đỗ Công Minh</Text>
            </Group>
            <Space h={10} />
            <Group position="apart">
              <Text weight={600} color="#444" mr={5}>Giới tính: </Text>
              <Text color="#444">Nam</Text>
            </Group>
            <Space h={10} />
            <Group position="apart">
              <Text weight={600} color="#444" mr={5}>Ngày sinh: </Text>
              <Text color="#444">05/04/1999</Text>
            </Group>
            <Space h={10} />
            <Group position="apart">
              <Text weight={600} color="#444" mr={5}>CMND/CCCD: </Text>
              <Text color="#444">272643602</Text>
            </Group>
            <Space h={10} />
            <Group position="apart">
              <Text weight={600} color="#444" mr={5}>Dân tộc: </Text>
              <Text color="#444">Kinh</Text>
            </Group>
          </Grid.Col>
          {!isLargeTablet && (
            <Grid.Col span={2}></Grid.Col>
          )}
          <Grid.Col span={isLargeTablet ? 12 : 5}>
            <Group position="apart">
              <Text weight={600} color="#444" mr={5}>Nguyên quán: </Text>
              <Text color="#444">Nam Định</Text>
            </Group>
            <Space h={10} />
            <Group position="apart">
              <Text weight={600} color="#444" mr={5}>Địa chỉ: </Text>
              <Text color="#444">102/3E Võ Dõng 1, Gia Kiệm, Thống Nhất, Đồng Nai</Text>
            </Group>
            <Space h={10} />
            <Group position="apart">
              <Text weight={600} color="#444" mr={5}>Email: </Text>
              <Text color="#444">meo123zzz@gmail.com</Text>
            </Group>
            <Space h={10} />
            <Group position="apart">
              <Text weight={600} color="#444" mr={5}>Số điện thoại: </Text>
              <Text color="#444">0000000000</Text>
            </Group>
          </Grid.Col>
        </Grid>

        <Space h={40} />
        <Text color="#444" weight={700} style={{ fontSize: "1.8rem" }}>Kỹ năng chuyên môn</Text>
        <Divider />
        <Container
          p={0}
          pt={10}
          size="xl"
          style={{ color: "#444", textAlign: "justify" }}
          dangerouslySetInnerHTML={{ __html: shortDesc }} />

        <Space h={40} />
        <Text color="#444" weight={700} style={{ fontSize: "1.8rem" }}>Kinh nghiệm giảng dạy</Text>
        <Divider />
        <Container
          p={0}
          pt={10}
          size="xl"
          style={{ color: "#444", textAlign: "justify" }}
          dangerouslySetInnerHTML={{ __html: experienceTeaching }} />

        <Space h={40} />
        <Container p={0} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button onClick={() => router.push("/modify-personal")}>Chỉnh sửa</Button>
        </Container>
        <Space h={40} />
      </Container>
    </>);
}


export default TeacherPersonalScreen;
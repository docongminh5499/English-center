import { Title, Text, Divider, Container, Space } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Head from "next/head";

const NotificationScreen = () => {
  const isMobile = useMediaQuery('(max-width: 480px)');

  return (
    <>
      <Head>
        <title>Thông báo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container p={isMobile ? "xs" : "md"}>
        <Title size="2.6rem" color="#444" transform="uppercase" align="center">
          Thông báo của tôi
        </Title>
        <Space h={20} />
        <Container p={isMobile ? "xs" : "md"}>
          <Text color="#444" align="justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....
          </Text>
          <Space h={10} />
          <Text color="dimmed" style={{ fontSize: "1.2rem" }} align="right">
            16:00  01/01/2022
          </Text>
        </Container>


        <Divider />
        <Container p={isMobile ? "xs" : "md"}>
          <Text color="#444" align="justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....
          </Text>
          <Space h={10} />
          <Text color="dimmed" style={{ fontSize: "1.2rem" }} align="right">
            16:00  01/01/2022
          </Text>
        </Container>


        <Divider />
        <Container p={isMobile ? "xs" : "md"}>
          <Text color="#444" align="justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....
          </Text>
          <Space h={10} />
          <Text color="dimmed" style={{ fontSize: "1.2rem" }} align="right">
            16:00  01/01/2022
          </Text>
        </Container>


        <Divider />
        <Container p={isMobile ? "xs" : "md"}>
          <Text color="#444" align="justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad....
          </Text>
          <Space h={10} />
          <Text color="dimmed" style={{ fontSize: "1.2rem" }} align="right">
            16:00  01/01/2022
          </Text>
        </Container>
      </Container>
    </>
  );
}

export default NotificationScreen;
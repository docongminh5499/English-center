import { Container, Title, Text, Image, Loader, Space, Grid, NavLink, Divider } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getImageUrl } from "../../../../helpers/image.helper";
import Curriculum from "../../../../models/cirriculum.model";
import Button from "../../../commons/Button";


interface IProps {
  curriculum: Curriculum | null
}

const TeacherCurriculumDetailScreen = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const [active, setActive] = useState(0);

  const [didMount, setDidMount] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (props.curriculum === null)
      router.replace('/not-found');
    else setDidMount(true);
  }, []);


  return (
    <>
      <Head>
        <title>Chi tiết chương trình học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {didMount && (
        <Container size="xl" style={{ width: "100%" }}>
          <Title transform="uppercase" color="#444" size="2.6rem" my={20} align="center">
            {props.curriculum?.name}
          </Title>
          <Text color="#444" align="justify">
            {props.curriculum?.desc}
          </Text>
          <Space h={40} />
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
              src={getImageUrl(props.curriculum?.image)}
              alt="Hình minh họa chương trình dạy"
            />
          </Container>
          <Space h={40} />
          <Divider />
          <Space h={40} />
          <Container size="xl" p={0}>
            {props.curriculum && (
              <Container size="xl" style={{ display: "flex", flexDirection: isTablet ? "column" : "row" }} p={0}>
                <Grid style={{ width: isTablet ? "100%" : "175px", minWidth: isTablet ? "0px" : "175px" }}>
                  {props.curriculum.lectures.map((item, index) => (
                    <Grid.Col span={isTablet ? (isMobile ? 4 : 3) : 12} key={index}>
                      <NavLink
                        style={{ borderRadius: 5 }}
                        active={index === active}
                        label={
                          isTablet ? (
                            <Text color={index === active ? "blue" : "#444"} style={{ fontSize: "1.4rem" }} weight={700}>
                              <Text align="center">Bài {item.order}</Text>
                            </Text>
                          ) : (
                            <Text color={index === active ? "blue" : "#444"} style={{ fontSize: "1.4rem" }}>
                              <Text weight={600} component="span">
                                {"Bài " + item.order + ": "}
                              </Text>
                              {item.name}
                            </Text>
                          )}
                        onClick={() => setActive(index)}
                      />
                    </Grid.Col>
                  ))}
                </Grid>
                <Container style={{ flexGrow: 1 }} pl={isTablet ? 0 : 8} pr={0} mt={isTablet ? 16 : 0} mx={0}>
                  {active >= 0 && (
                    <Container
                      px={isMobile ? 0 : 10}
                      size="xl"
                      style={{ color: "#444", textAlign: "justify", width: "100%" }}
                      dangerouslySetInnerHTML={{ __html: props.curriculum.lectures[active].detail }} />
                  )}
                </Container>
              </Container>
            )}
          </Container>

          <Space h={40} />
          <Container my={20} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={() => router.push(router.asPath + "/modify")}
            >Chỉnh sửa chương trình dạy</Button>
          </Container>
        </Container>
      )}
    </>
  );
}


export default TeacherCurriculumDetailScreen;
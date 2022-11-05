import { Container, Title, Text, Image, Loader, Space, Grid, NavLink, Divider, Badge } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { Url } from "../../../../helpers/constants";
import { getCourseType } from "../../../../helpers/getCourseType";
import { getCurriculumLevel } from "../../../../helpers/getCurriculumLevel";
import { getImageUrl } from "../../../../helpers/image.helper";
import Curriculum from "../../../../models/cirriculum.model";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";


interface IProps {
  curriculum: Curriculum | null;
  isPreferred: boolean;
}

const TeacherCurriculumDetailScreen = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const [active, setActive] = useState(0);

  const [authState] = useAuth();
  const [didMount, setDidMount] = useState(false);
  const [isPreferred, setIsPreferred] = useState(props.isPreferred);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (props.curriculum === null)
      router.replace('/not-found');
    else setDidMount(true);
  }, []);



  const addPreferredCurriculum = useCallback(async () => {
    try {
      setLoading(true);
      const responses = await API.post(Url.teachers.addPreferredCurriculums,
        { token: authState.token, curriculumId: props.curriculum?.id });
      if (responses) {
        setIsPreferred(!isPreferred);
        toast.success("Thêm đăng ký thành công.")
      } else toast.error("Thêm đăng ký thất bại.")
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [props.curriculum?.id, authState.token, isPreferred]);


  const removePreferredCurriculum = useCallback(async () => {
    try {
      setLoading(true);
      const responses = await API.post(Url.teachers.removePreferredCurriculums,
        { token: authState.token, curriculumId: props.curriculum?.id });
      if (responses) {
        toast.success("Hủy đăng ký thành công.")
        setIsPreferred(!isPreferred);
      } else toast.error("Hủy đăng ký thất bại.")
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [props.curriculum?.id, authState.token, isPreferred]);



  return (
    <>
      <Head>
        <title>Chi tiết chương trình học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!didMount && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Loading />
        </Container>
      )}

      {didMount && (
        <Container size="xl" style={{ width: "100%" }}>
          <Title transform="uppercase" color="#444" size="2.6rem" my={20} align="center">
            {props.curriculum?.name}
          </Title>
          <Container style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            {isPreferred && (
              <Button color="red" loading={loading} onClick={() => removePreferredCurriculum()}>
                Hủy đăng ký
              </Button>
            )}
            {!isPreferred && (
              <Button loading={loading} onClick={() => addPreferredCurriculum()}>
                Đăng ký
              </Button>
            )}
          </Container>
          <Space h={20} />
          <Text color="#444" align="justify">
            <Text color="#444" weight={600}>Mô tả: </Text>
            {props.curriculum?.desc}
          </Text>
          <Space h={20} />
          <Text color="#444" align="justify">
            <Text color="#444" weight={600} component="span">Loại khóa học: </Text>
            {getCourseType(props.curriculum?.type)}
          </Text>
          <Space h={20} />
          <Text color="#444" align="justify">
            <Text color="#444" weight={600} component="span">Số ca học mỗi buổi: </Text>
            {props.curriculum?.shiftsPerSession} ca học mỗi buổi
          </Text>
          <Space h={20} />
          <Text color="#444" align="justify">
            <Text color="#444" weight={600} component="span">Trình độ: </Text>
            {getCurriculumLevel(props.curriculum?.level)}
          </Text>
          <Space h={20} />
          <Text color="#444" align="justify">
            <Text color="#444" weight={600} component="span">Thể loại: </Text>
            {props.curriculum &&
              props.curriculum.tags &&
              props.curriculum.tags.length > 0 &&
              props.curriculum?.tags.map((tag, index) => (
                <Badge key={index} m={5} color="gray" variant="filled">
                  {tag.name}
                </Badge>
              ))}
            {(!props.curriculum ||
              !props.curriculum.tags ||
              !(props.curriculum.tags.length > 0)) && "Chưa có dữ liệu"}
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
                      style={{ color: "#444", textAlign: "justify", width: "100%" }}>
                      <Text color="#444" weight={600}>Mô tả ngắn: </Text>
                      <Container p={0} dangerouslySetInnerHTML={{ __html: props.curriculum.lectures[active].desc || "" }} />
                      <Text color="#444" weight={600} mt={20}>Chi tiết bài học: </Text>
                      <Container p={0} dangerouslySetInnerHTML={{ __html: props.curriculum.lectures[active].detail }} />
                    </Container>
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
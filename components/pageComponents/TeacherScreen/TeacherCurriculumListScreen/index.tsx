import { Badge, Card, Container, Image, Modal, SimpleGrid, Space, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconSchool } from "@tabler/icons";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { CourseType, Url } from "../../../../helpers/constants";
import { getImageUrl } from "../../../../helpers/image.helper";
import Curriculum from "../../../../models/cirriculum.model";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";
import DeleteCurriculumModal from "../Modal/delete.modal";
import styles from "./curriculum.module.css";


interface IProps {
  curriculums: Curriculum[];
  preferredCurriculums: Curriculum[];
}

const TeacherCurriculumListScreen = (props: IProps) => {
  const isLargeDesktop = useMediaQuery('(max-width: 1400px)');
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const router = useRouter();
  const [authState] = useAuth();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentCurriculum, setCurrentCurriculum] = useState<Curriculum>();
  const [shortTermCurriculums, setShortTermCurriculums] = useState<Curriculum[]>();
  const [longTermCurriculums, setLongTermCurriculums] = useState<Curriculum[]>();
  const [didMount, setDidMount] = useState(false);
  const [preferredCurriculums, setPreferredCurriculums] = useState(props.preferredCurriculums);


  const onDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      const responses: any = await API.delete(
        Url.teachers.deleteCurriculum + currentCurriculum?.id, { token: authState.token });
      if (responses.success) {
        const shortTerms: Curriculum[] =
          shortTermCurriculums?.filter(c => c.id !== currentCurriculum?.id) || [];
        const longTerms: Curriculum[] =
          longTermCurriculums?.filter(c => c.id !== currentCurriculum?.id) || [];
        setLongTermCurriculums(longTerms);
        setShortTermCurriculums(shortTerms);
        setIsOpenDeleteModal(false);
        setIsDeleting(false);
        toast.success("Xóa chương trình dạy thành công.")
      } else {
        setIsOpenDeleteModal(false);
        setIsDeleting(false);
        toast.error("Xóa chương trình dạy thất bại. Vui lòng thử lại.")
      }
    } catch (error: any) {
      setIsOpenDeleteModal(false);
      setIsDeleting(false);
      if (error.status < 500) {
        if (error.data.message && typeof error.data.message === "string")
          toast.error(error.data.message);
        else if (error.data.message && Array.isArray(error.data.message)) {
          const messages: any[] = Array.from(error.data.message);
          if (messages.length > 0 && typeof messages[0] === "string")
            toast.error(messages[0]);
          else if (messages.length > 0 && Array.isArray(messages))
            toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại");
          else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
        } else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
      } else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [Url, Url.teachers, currentCurriculum, authState.token, shortTermCurriculums, longTermCurriculums])


  useEffect(() => {
    const shortTerms: Curriculum[] = [];
    const longTerms: Curriculum[] = [];

    props.curriculums.forEach(cur => {
      if (cur.type === CourseType.LONG_TERM)
        longTerms.push(cur);
      else if (cur.type === CourseType.SHORT_TERM)
        shortTerms.push(cur);
    })
    setLongTermCurriculums(longTerms);
    setShortTermCurriculums(shortTerms);

    setDidMount(true);
  }, []);



  return (
    <>
      <Head>
        <title>Danh sách chương trình học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal
        opened={isOpenDeleteModal}
        onClose={() => setIsOpenDeleteModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <DeleteCurriculumModal
          loading={isDeleting}
          title="Xóa chương trình dạy"
          message={`Bạn có chắc muốn xóa chương trình dạy ${currentCurriculum ? "'" + currentCurriculum.name.toUpperCase() + "'" : "này"} chứ?`}
          onDelete={onDelete}
        />
      </Modal>

      <Container size="xl"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1
        }}>

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

        {shortTermCurriculums?.length === 0 && longTermCurriculums?.length === 0 && (
          <Container style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center"
          }}>
            <IconSchool color="#CED4DA" size={100} />
            <Text color="#CED4DA" style={{ fontSize: "2.6rem" }} weight={600}>
              Không có chương trình dạy
            </Text>
          </Container>
        )}

        {shortTermCurriculums && shortTermCurriculums.length > 0 && (
          <>
            <Title transform="uppercase" color="#444" size="2.6rem" my={20} align="center">
              Chương trình dạy ngắn hạn
            </Title>
            <SimpleGrid
              spacing="xl"
              cols={isLargeDesktop ? (isLargeTablet ? (isTablet ? (isMobile ? 2 : 3) : 4) : 5) : 6}>
              {shortTermCurriculums.map((curriculum, index) => (
                <Card
                  key={index}
                  shadow="sm" p="lg" radius="md" withBorder
                  className={styles.curriculumCard}
                  onClick={() => {
                    router.push("/teacher/curriculum/" + curriculum.id)
                  }}>
                  <Card.Section>
                    <Image
                      src={getImageUrl(curriculum.image)}
                      height={180}
                      alt="curriculum-course"
                    />
                  </Card.Section>
                  <Container style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    flexGrow: 1
                  }} p={0}>
                    <Container p={0} style={{ flexGrow: 1 }}>
                      <Text
                        weight={600}
                        align="center"
                        lineClamp={2}
                        my={5}
                        color="#444" className={styles.curriculumName}>
                        {curriculum.name}
                      </Text>
                    </Container>
                    {preferredCurriculums.find(cur => cur.id === curriculum.id) && (
                      <Container style={{
                        display: "flex",
                        justifyContent: "center"
                      }} p={0} mt={10}>
                        <Badge>
                          <Text style={{ fontSize: "1.1rem" }}>Được chỉ định</Text>
                        </Badge>
                      </Container>
                    )}
                    {authState.isManager && (
                      <Container
                        p={0} mt={10}
                        style={{
                          display: "flex",
                          flexDirection: isTablet ? "column" : "row",
                          width: "100%",
                          gap: "0.5rem"
                        }}>
                        <Button compact fullWidth
                          onClick={(e?: any) => {
                            e?.stopPropagation()
                            router.push("/teacher/curriculum/" + curriculum.id + "/modify")
                          }}>Sửa</Button>
                        <Button color="red" compact fullWidth
                          onClick={(e?: any) => {
                            e?.stopPropagation()
                            setCurrentCurriculum(curriculum);
                            setIsOpenDeleteModal(true);
                          }}>
                          Xóa
                        </Button>
                      </Container>
                    )}
                  </Container>
                </Card>
              ))}
            </SimpleGrid>
            <Space h={40} />
          </>
        )}

        {longTermCurriculums && longTermCurriculums.length > 0 && (
          <>
            <Title transform="uppercase" color="#444" size="2.6rem" my={20} align="center">
              Chương trình dạy dài hạn
            </Title>
            <SimpleGrid
              spacing="xl"
              cols={isLargeDesktop ? (isLargeTablet ? (isTablet ? (isMobile ? 2 : 3) : 4) : 5) : 6}>
              {longTermCurriculums.map((curriculum, index) => (
                <Card
                  key={index}
                  shadow="sm" p="lg" radius="md" withBorder
                  className={styles.curriculumCard}
                  onClick={() => {
                    router.push("/teacher/curriculum/" + curriculum.id)
                  }}>
                  <Card.Section>
                    <Image
                      src={getImageUrl(curriculum.image)}
                      height={180}
                      alt="curriculum-course"
                    />
                  </Card.Section>
                  <Container style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    flexGrow: 1
                  }} p={0}>
                    <Container p={0} style={{ flexGrow: 1 }}>
                      <Text
                        weight={600}
                        align="center"
                        lineClamp={2}
                        my={5}
                        color="#444" className={styles.curriculumName}>
                        {curriculum.name}
                      </Text>
                    </Container>
                    {preferredCurriculums.find(cur => cur.id === curriculum.id) && (
                      <Container style={{
                        display: "flex",
                        justifyContent: "center"
                      }} p={0} mt={10}>
                        <Badge>
                          <Text style={{ fontSize: "1.1rem" }}>Được chỉ định</Text>
                        </Badge>
                      </Container>
                    )}
                    {authState.isManager && (
                      <Container
                        p={0} mt={10}
                        style={{
                          display: "flex",
                          width: "100%",
                          flexDirection: isTablet ? "column" : "row",
                          gap: "0.5rem"
                        }}>
                        <Button compact fullWidth
                          onClick={(e?: any) => {
                            e?.stopPropagation()
                            router.push("/teacher/curriculum/" + curriculum.id + "/modify")
                          }}>Sửa</Button>
                        <Button color="red" compact fullWidth
                          onClick={(e?: any) => {
                            e?.stopPropagation()
                            setCurrentCurriculum(curriculum);
                            setIsOpenDeleteModal(true);
                          }}>
                          Xóa
                        </Button>
                      </Container>
                    )}
                  </Container>
                </Card>
              ))}
            </SimpleGrid>
            <Space h={40} />
          </>
        )}
        {authState.isManager && (
          <Container my={20}>
            <Button onClick={() => router.push("/teacher/curriculum/create")}>
              Tạo chương trình dạy mới
            </Button>
          </Container>
        )}

      </Container>
    </>
  );
}


export default TeacherCurriculumListScreen;
import { Anchor, Container, Grid, Modal, Space, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { useCallback, useState } from "react";
import Button from "../../../commons/Button";
import CreateDocumentModal from "../Modal/createDocument.modal";
import DeleteExerciseModal from "../Modal/delete.modal";

const CourseDocument = () => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState();
  const onDelete = useCallback(() => {
    setIsOpenDeleteModal(false);
  }, []);
  const onCreate = useCallback((data: any) => {
    console.log(data);
    setIsOpenCreateModal(false);
  }, []);


  return (
    <>
      <Modal
        opened={isOpenDeleteModal}
        onClose={() => setIsOpenDeleteModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <DeleteExerciseModal
          title="Xóa tài liệu"
          message={`Bạn có chắc muốn xóa tài liệu ${currentDocument ? "'<add here>'" : "này"} chứ?`}
          onDelete={onDelete}
        />
      </Modal>

      <Modal
        opened={isOpenCreateModal}
        onClose={() => setIsOpenCreateModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <CreateDocumentModal
          onCreate={onCreate}
        />
      </Modal>

      <Container size="xl" p={isMobile ? 0 : 10}>
        <Grid>
          <Grid.Col span={isLargeTablet ? 12 : 8} style={{ display: "flex", alignItems: "center" }}>
            <Text weight={600} color="#444">
              Tài liệu 1: Book 1 Long title here Long title here Long title here here Long title here Long title here,  tác giả: Nguyễn Văn A, 2001
              <Link href="#!" passHref>
                <Anchor component="a" ml={20}>Tải về</Anchor>
              </Link>
            </Text>
          </Grid.Col>
          <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button fullWidth>Sửa tài liệu</Button>
          </Grid.Col>
          <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button onClick={() => setIsOpenDeleteModal(true)} color="red" fullWidth>Xóa tài liệu</Button>
          </Grid.Col>

          <Grid.Col span={12}>
            <Space h={10} />
          </Grid.Col>

          <Grid.Col span={isLargeTablet ? 12 : 8} style={{ display: "flex", alignItems: "center" }}>
            <Text weight={600} color="#444">
              Tài liệu 1: Book 1, tác giả: Nguyễn Văn A, 2001
              <Link href="#!" passHref>
                <Anchor component="a" ml={20}>Tải về</Anchor>
              </Link>
            </Text>
          </Grid.Col>
          <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button fullWidth>Sửa tài liệu</Button>
          </Grid.Col>
          <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button onClick={() => setIsOpenDeleteModal(true)} color="red" fullWidth>Xóa tài liệu</Button>
          </Grid.Col>
        </Grid>
      </Container>

      <Space h={100} />


      <Container style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={() => setIsOpenCreateModal(true)}>Tạo tài liệu mới</Button>
      </Container>
    </>
  );
}

export default CourseDocument;
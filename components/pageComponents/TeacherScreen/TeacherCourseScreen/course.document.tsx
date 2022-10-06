import { Anchor, Container, Grid, Modal, Space, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import Button from "../../../commons/Button";
import CreateDocumentModal from "../Modal/createDocument.modal";
import DeleteExerciseModal from "../Modal/delete.modal";
import Document from "../../../../models/document.models";
import { getDocumentUrl } from "../../../../helpers/image.helper";

interface IProps {
  documents?: Document[]
}


const CourseDocument = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document>();
  const [listDocuments, setListDocuments] = useState(props.documents);

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
          loading={isDeleting}
          title="Xóa tài liệu"
          message={`Bạn có chắc muốn xóa tài liệu ${currentDocument ? "'" + currentDocument.name.toLocaleUpperCase() + "'" : "này"} chứ?`}
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


      {listDocuments && listDocuments.length === 0 && (
        <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <Text color="dimmed" align="center" weight={600} style={{ fontSize: "1.8rem" }}>
            Chưa có bài tập
          </Text>
        </Container>
      )}


      {listDocuments && listDocuments.length > 0 && (
        <Container size="xl" p={isMobile ? 0 : 10}>
          <Grid>
            {listDocuments.map((item, index) => (
              <React.Fragment key={index}>
                <Grid.Col span={isLargeTablet ? 12 : 8} style={{ display: "flex", alignItems: "center" }}>
                  <Text weight={600} color="#444">
                    {item.name.toLocaleUpperCase()} {item.author && "- Tác giả: " + item.author}{item.author && ", " + item.pubYear}
                    {item.src && (
                      <Link href={getDocumentUrl(item.src)} passHref>
                        <Anchor target="_blank" component="a" ml={20}>Tải về</Anchor>
                      </Link>
                    )}
                  </Text>
                </Grid.Col>
                <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Button fullWidth>Sửa tài liệu</Button>
                </Grid.Col>
                <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Button onClick={() => {
                    setCurrentDocument(item);
                    setIsOpenDeleteModal(true);
                  }} color="red" fullWidth>Xóa tài liệu</Button>
                </Grid.Col>

                <Grid.Col span={12}>
                  <Space h={10} />
                </Grid.Col>
              </React.Fragment>
            ))}

          </Grid>
        </Container>

      )}
      <Space h={100} />


      <Container style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={() => setIsOpenCreateModal(true)}>Tạo tài liệu mới</Button>
      </Container>
    </>
  );
}

export default CourseDocument;
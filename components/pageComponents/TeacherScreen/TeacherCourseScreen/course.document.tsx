import { Anchor, Container, Grid, Modal, Space, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import Button from "../../../commons/Button";
import CreateDocumentModal from "../Modal/createDocument.modal";
import DeleteExerciseModal from "../Modal/delete.modal";
import Document from "../../../../models/document.models";
import { getDocumentUrl } from "../../../../helpers/image.helper";
import API from "../../../../helpers/api";
import { Url } from "../../../../helpers/constants";
import { useAuth } from "../../../../stores/Auth";
import { toast } from "react-toastify";
import axios from "axios";

interface IProps {
  courseSlug?: string;
  documents?: Document[]
}


const CourseDocument = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 480px)');



  const [authState] = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document>();
  const [listDocuments, setListDocuments] = useState(props.documents);



  const onDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      const responses: any = await API.delete(
        Url.teachers.deleteDocument + currentDocument?.id, { token: authState.token });
      if (responses.success) {
        const updatedListExercises = listDocuments?.filter(item => item.id !== currentDocument?.id);
        setListDocuments(updatedListExercises);
        setIsOpenDeleteModal(false);
        setIsDeleting(false);
        toast.success("Xóa tài liệu thành công.")
      } else {
        setIsOpenDeleteModal(false);
        setIsDeleting(false);
        toast.error("Xóa tài liệu thất bại. Vui lòng thử lại.")
      }
    } catch (error) {
      setIsOpenDeleteModal(false);
      setIsDeleting(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [authState.token, currentDocument, listDocuments]);



  const onCreate = useCallback(async (data: any) => {
    try {
      setIsCreating(true);

      const formData = new FormData();
      formData.append("documentName", data['documentName']);
      formData.append("documentAuthor", data['documentAuthor']);
      formData.append("documentYear", data['documentYear']);
      formData.append("documentType", data['documentType']);
      formData.append("documentLink", data['documentLink']);
      formData.append("documentFile", data['documentFile']);
      formData.append("courseSlug", props.courseSlug || "");

      const responses: any = await API.post(
        Url.teachers.createDocument, formData, {
        headers: {
          'x-access-token': authState.token || "",
          'content-type': 'multipart/form-data'
        },
      });
      if (responses.document === null) {
        toast.error("Thêm tài liệu thất bại. Vui lòng thử lại.");
      } else {
        const updatedListDocuments = (listDocuments || []).concat(responses.document);
        updatedListDocuments.sort((prev, nex) => prev.name.localeCompare(nex.name));
        setListDocuments(updatedListDocuments);
        toast.success("Thêm tài liệu thành công.");
      }
      setIsCreating(false);
      setIsOpenCreateModal(false);
    } catch (error) {
      setIsCreating(false);
      setIsOpenCreateModal(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [authState.token, listDocuments, props.courseSlug]);


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
          loading={isCreating}
          onCreate={onCreate}
        />
      </Modal>


      {listDocuments && listDocuments.length === 0 && (
        <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <Text color="dimmed" align="center" weight={600} style={{ fontSize: "1.8rem" }}>
            Chưa có tài liệu
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
                    {item.name.toLocaleUpperCase()} {item.author && "- Tác giả: " + item.author}{item.pubYear && ", " + item.pubYear}
                  </Text>
                </Grid.Col>
                <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {item.src && (
                    <a href={getDocumentUrl(item.src)} target="_blank" style={{ color: "white", width: "100%" }}>
                      <Button fullWidth>
                        Xem tài liệu
                      </Button>
                    </a>
                  )}
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
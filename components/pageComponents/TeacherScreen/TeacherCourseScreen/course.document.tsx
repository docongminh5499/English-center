import { Anchor, Container, Divider, Grid, Loader, Modal, Space, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../../../commons/Button";
import CreateDocumentModal from "../Modal/createDocument.modal";
import DeleteExerciseModal from "../Modal/delete.modal";
import Document from "../../../../models/document.models";
import { getDocumentUrl } from "../../../../helpers/image.helper";
import API from "../../../../helpers/api";
import { CourseStatus, TeacherConstants, Url } from "../../../../helpers/constants";
import { useAuth } from "../../../../stores/Auth";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../../../commons/Loading";
import { Course } from "../../../../models/course.model";
import { getCourseStatus } from "../../../../helpers/getCourseStatus";

interface IProps {
  courseSlug?: string;
  course: Course | null;
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
  const [listDocuments, setListDocuments] = useState<Document[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeMoreLoading, setSeeMoreLoading] = useState(false);


  const getDocuments = useCallback(async (limit: number, skip: number) => {
    return await API.post(Url.teachers.getDocuments, {
      token: authState.token,
      limit: limit,
      skip: skip,
      courseSlug: props.courseSlug
    });
  }, [authState.token, props.courseSlug]);


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
        setTotal(total - 1);
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
        setTotal(total + 1);
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



  const seeMoreDocuments = useCallback(async () => {
    try {
      setSeeMoreLoading(true);
      const responses = await getDocuments(TeacherConstants.limitDocument, listDocuments.length);
      setTotal(responses.total);
      setListDocuments(listDocuments.concat(responses.documents));
      setSeeMoreLoading(false);
    } catch (error) {
      setSeeMoreLoading(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [TeacherConstants.limitStudent, listDocuments]);


  useEffect(() => {
    const didMountFunc = async () => {
      try {
        setLoading(true);
        const responses = await getDocuments(TeacherConstants.limitDocument, 0);
        setTotal(responses.total);
        setListDocuments(responses.documents);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
      }
    }
    didMountFunc();
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
          loading={isCreating}
          onCreate={onCreate}
        />
      </Modal>

      <Text color="#444" transform="uppercase" align="center" weight={600} style={{ fontSize: "2.6rem" }}>
        Danh sách tài liệu
      </Text>

      {getCourseStatus(props.course) !== CourseStatus.Closed && (
        <Container my={10} style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="light" onClick={() => setIsOpenCreateModal(true)}>Tạo tài liệu mới</Button>
        </Container>
      )}

      {loading && (
        <Container style={{
          display: "flex",
          justifyContent: "center",
          alignItems: 'center',
          flexGrow: 1,
          height: "200px"
        }}>
          <Loading />
        </Container>
      )}


      {!loading && listDocuments && listDocuments.length === 0 && (
        <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <Text color="dimmed" align="center" weight={600} style={{ fontSize: "1.8rem" }}>
            Chưa có tài liệu
          </Text>
        </Container>
      )}


      {!loading && listDocuments && listDocuments.length > 0 && listDocuments.map((item, index) => (
        <React.Fragment key={index}>
          <Container size="xl" p={0} px={isMobile ? 10 : 0}>
            <Grid my={20}>
              <Grid.Col span={isLargeTablet ? 12 : (getCourseStatus(props.course) !== CourseStatus.Closed ? 8 : 10)} p={0} style={{ display: "flex", alignItems: "center" }}>
                <Text weight={600} color="#444" p={8}>
                  {item.name.toLocaleUpperCase()} {item.author && "- Tác giả: " + item.author}{item.pubYear && ", " + item.pubYear}
                </Text>
              </Grid.Col>
              <Grid.Col span={isLargeTablet ? (isMobile ? 12 : (getCourseStatus(props.course) !== CourseStatus.Closed ? 6 : 12)) : 2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {item.src && (
                  <a href={getDocumentUrl(item.src)} target="_blank" style={{ color: "white", width: "100%" }}>
                    <Button fullWidth variant="light">
                      Xem tài liệu
                    </Button>
                  </a>
                )}
              </Grid.Col>

              {getCourseStatus(props.course) !== CourseStatus.Closed && (
                <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Button onClick={() => {
                    setCurrentDocument(item);
                    setIsOpenDeleteModal(true);
                  }} color="red" fullWidth variant="light">Xóa tài liệu</Button>
                </Grid.Col>
              )}
              {index !== listDocuments.length - 1 && (
                <Grid.Col span={12} p={0} mt={20}>
                  <Divider />
                </Grid.Col>
              )}
            </Grid>
          </Container>
        </React.Fragment>
      ))}

      <Space h={20} />
      <Container style={{
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        flexGrow: 1,
      }}>
        {seeMoreLoading && <Loader variant="dots" />}
        {!seeMoreLoading && listDocuments.length < total && <Button
          onClick={() => seeMoreDocuments()}
        >Xem thêm</Button>}
      </Container>
      <Space h={20} />
    </>
  );
}

export default CourseDocument;
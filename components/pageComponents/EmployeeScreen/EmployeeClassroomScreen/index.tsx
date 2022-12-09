import { Container, Grid, Input, Modal, Pagination, ScrollArea, Space, Table, Text, Title } from "@mantine/core";
import { useInputState, useMediaQuery } from "@mantine/hooks";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { EmployeeConstants, Url } from "../../../../helpers/constants";
import Branch from "../../../../models/branch.model";
import Classroom from "../../../../models/classroom.model";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";
import CreateClassroomModal from "../Modal/createClassroom.modal";
import RemoveClassroomModal from "../Modal/modal";
import ModifyClassroomModal from "../Modal/modifyClassroom.modal";
import styles from "./classroom.module.css";

const EmployeeClassroomScreen = () => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const [authState] = useAuth();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [listClassrooms, setListClassrooms] = useState<Classroom[]>([]);
  const [total, setTotal] = useState(0);
  const [maxPage, setMaxPage] = useState(1);
  const [currentClassroom, setCurrentClassroom] = useState<Classroom | null>(null);
  const [isOpenModifyClassroomModal, setIsOpenModifyClassroomModal] = useState(false);
  const [isSendingModifyClassroomRequest, setIsSendingModifyClassroomRequest] = useState(false);
  const [isOpenCreateClassroomModal, setIsOpenCreateClassroomModal] = useState(false);
  const [isSendingCreateClassroomRequest, setIsSendingCreateClassroomRequest] = useState(false);
  const [isOpenRemoveClassroomModal, setIsOpenRemoveClassroomModal] = useState(false);
  const [isSendingRemoveClassroomRequest, setIsSendingRemoveClassroomRequest] = useState(false);
  const [query, setQuery] = useInputState("");



  const getClassrooms = useCallback(async (limit: number, skip: number, query: string) => {
    return await API.post(Url.employees.getClassrooms, {
      token: authState.token,
      limit: limit,
      skip: skip,
      query: query,
    });
  }, [authState.token]);



  const queryClassroom = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const responseClassrooms = await getClassrooms(EmployeeConstants.limitClassroom, 0, query);
      setCurrentPage(1);
      setTotal(responseClassrooms.total);
      setMaxPage(Math.ceil(responseClassrooms.total / EmployeeConstants.limitClassroom));
      setListClassrooms(responseClassrooms.classrooms);
      setLoading(false);
      setError(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [query])



  const onClickPaginationPage = useCallback(async (page: number) => {
    try {
      if (page < 1) return;
      setLoading(true);
      setError(false);
      const responseClassrooms = await getClassrooms(
        EmployeeConstants.limitClassroom,
        (page - 1) * EmployeeConstants.limitClassroom,
        query
      );
      setTotal(responseClassrooms.total);
      setMaxPage(Math.ceil(responseClassrooms.total / EmployeeConstants.limitClassroom));
      setListClassrooms(responseClassrooms.classrooms);
      setLoading(false);
      setCurrentPage(page);
    } catch (err) {
      setLoading(false);
      setCurrentPage(page);
      setError(true);
    }
  }, [query]);



  const onSendModifyClassroomRequest = useCallback(async (data: any) => {
    try {
      setIsSendingModifyClassroomRequest(true);
      const responses = await API.post(Url.employees.updateClassroom, {
        token: authState.token,
        name: data.name,
        branchId: branch?.id,
        capacity: data.capacity,
        function: data.function,
        oldName: currentClassroom?.name,
        version: currentClassroom?.version,
      });
      if (responses !== null) {
        onClickPaginationPage(currentPage);
        toast.success("Cập nhật phòng học thành công");
      } else toast.error("Cập nhật phòng học thất bại. Vui lòng thử lại sau.");
      setIsSendingModifyClassroomRequest(false);
      setIsOpenModifyClassroomModal(false);
    } catch (error: any) {
      setIsSendingModifyClassroomRequest(false);
      setIsOpenModifyClassroomModal(false);
      if (error.status < 500) {
        if (error.data.message && typeof error.data.message === "string")
          toast.error(error.data.message);
        else if (error.data.message && Array.isArray(error.data.message)) {
          const messages: any[] = Array.from(error.data.message);
          if (messages.length > 0 && typeof messages[0] === "string")
            toast.error(messages[0]);
          else if (messages.length > 0 && Array.isArray(messages))
            toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại");
          else toast.error("Cập nhật phòng học thất bại. Vui lòng thử lại sau.");
        } else toast.error("Cập nhật phòng học thất bại. Vui lòng thử lại sau.");
      } else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
    }
  }, [authState.token, branch, currentPage, currentClassroom]);



  const onSendCreateClassroomRequest = useCallback(async (data: any) => {
    try {
      setIsSendingCreateClassroomRequest(true);
      const responses = await API.post(Url.employees.addClassroom, {
        token: authState.token,
        name: data.name,
        branchId: branch?.id,
        capacity: data.capacity,
        function: data.function,
      });
      if (responses !== null) {
        onClickPaginationPage(currentPage);
        toast.success("Thêm phòng học thành công");
      } else toast.error("Thêm phòng học thất bại. Vui lòng thử lại sau.");
      setIsSendingCreateClassroomRequest(false);
      setIsOpenCreateClassroomModal(false);
    } catch (error: any) {
      setIsSendingCreateClassroomRequest(false);
      setIsOpenCreateClassroomModal(false);
      if (error.status < 500) {
        if (error.data.message && typeof error.data.message === "string")
          toast.error(error.data.message);
        else if (error.data.message && Array.isArray(error.data.message)) {
          const messages: any[] = Array.from(error.data.message);
          if (messages.length > 0 && typeof messages[0] === "string")
            toast.error(messages[0]);
          else if (messages.length > 0 && Array.isArray(messages))
            toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại");
          else toast.error("Thêm phòng học thất bại. Vui lòng thử lại sau.");
        } else toast.error("Thêm phòng học thất bại. Vui lòng thử lại sau.");
      } else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
    }
  }, [authState.token, branch, currentPage]);


  const onSendRemoveClassroomRequest = useCallback(async () => {
    try {
      setIsSendingRemoveClassroomRequest(true);
      const responses = await API.post(Url.employees.removeClassroom, {
        token: authState.token,
        name: currentClassroom?.name,
        branchId: branch?.id,
      });
      if (responses == true) {
        const currentLimit = (currentPage - 1) * EmployeeConstants.limitClassroom;
        const updatedTotal = total - 1;
        const updatedPage = currentLimit < updatedTotal ? currentPage : currentPage - 1
        if (updatedPage < 1) {
          setTotal(1);
          setMaxPage(1);
          setListClassrooms([]);
        } else onClickPaginationPage(updatedPage);
        toast.success("Xóa phòng học thành công");
      } else toast.error("Xóa phòng học thất bại. Vui lòng thử lại sau.");
      setIsSendingRemoveClassroomRequest(false);
      setIsOpenRemoveClassroomModal(false);
    } catch (error: any) {
      setIsSendingRemoveClassroomRequest(false);
      setIsOpenRemoveClassroomModal(false);
      if (error.status < 500) {
        if (error.data.message && typeof error.data.message === "string")
          toast.error(error.data.message);
        else if (error.data.message && Array.isArray(error.data.message)) {
          const messages: any[] = Array.from(error.data.message);
          if (messages.length > 0 && typeof messages[0] === "string")
            toast.error(messages[0]);
          else if (messages.length > 0 && Array.isArray(messages))
            toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại");
          else toast.error("Xóa phòng học thất bại. Vui lòng thử lại sau.");
        } else toast.error("Xóa phòng học thất bại. Vui lòng thử lại sau.");
      } else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
    }
  }, [authState.token, branch, currentPage, currentClassroom, total]);



  useEffect(() => {
    const didMountFunc = async () => {
      try {
        const [responseClassrooms, responseUserEmployee] = await Promise.all([
          getClassrooms(EmployeeConstants.limitClassroom, 0, query),
          API.get(Url.employees.getPersonalInformation, { token: authState.token }),
        ]);
        setTotal(responseClassrooms.total);
        setMaxPage(Math.ceil(responseClassrooms.total / EmployeeConstants.limitClassroom));
        setListClassrooms(responseClassrooms.classrooms);
        setBranch(responseUserEmployee.worker.branch);
        setLoading(false);
        setError(false);
      } catch (error: any) {
        setLoading(false);
        setError(true);
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
    }
    didMountFunc();
  }, []);



  return (
    <>
      <Head>
        <title>Danh sách phòng học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal
        opened={isOpenModifyClassroomModal}
        onClose={() => setIsOpenModifyClassroomModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <ModifyClassroomModal
          onSendRequest={onSendModifyClassroomRequest}
          loading={isSendingModifyClassroomRequest}
          classroom={currentClassroom}
        />
      </Modal>

      <Modal
        opened={isOpenCreateClassroomModal}
        onClose={() => setIsOpenCreateClassroomModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <CreateClassroomModal
          onSendRequest={onSendCreateClassroomRequest}
          loading={isSendingCreateClassroomRequest}
        />
      </Modal>

      <Modal
        opened={isOpenRemoveClassroomModal}
        onClose={() => setIsOpenRemoveClassroomModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <RemoveClassroomModal
          title="Xóa phòng học"
          message={`Bạn có chắc muốn xóa phòng "${currentClassroom?.name}" chứ?`}
          buttonLabel="Xác nhận xóa"
          colorButton="red"
          callBack={onSendRemoveClassroomRequest}
          loading={isSendingRemoveClassroomRequest}
        />
      </Modal>

      <Container size="md" style={{
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
      }}>
        <Title align="center" size="2.6rem" color="#444" transform="uppercase" mt={20}>
          Danh sách phòng học
        </Title>
        {branch !== null && (
          <Text align="center" color="#444" style={{ fontSize: "1.6rem" }} mb={20} weight={500}>
            {branch.name}
          </Text>
        )}
        <Grid>
          {!isTablet && (<Grid.Col span={3}></Grid.Col>)}
          <Grid.Col span={isTablet ? (isMobile ? 12 : 8) : 4}>
            <Input
              styles={{ input: { color: "#444" } }}
              value={query}
              placeholder="Tìm kiếm theo tên"
              onChange={setQuery}
            />
          </Grid.Col>
          <Grid.Col span={isTablet ? (isMobile ? 12 : 4) : 2}>
            <Button fullWidth onClick={() => queryClassroom()} disabled={loading}>
              Tìm kiếm
            </Button>
          </Grid.Col>
        </Grid>
        {loading && (
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

        {!loading && error && (
          <div className={styles.errorContainer}>
            <p>Có lỗi xảy ra, vui lòng thử lại</p>
            <Button
              color="primary"
              onClick={() => onClickPaginationPage(currentPage)}>
              Thử lại
            </Button>
          </div>
        )}

        {!loading &&
          !error &&
          listClassrooms.length == 0 && (
            <div className={styles.emptyResultContainer}>
              <p>Không có kết quả</p>
              <Button color="green" mt={10} onClick={() => setIsOpenCreateClassroomModal(true)}>
                Thêm phòng học
              </Button>
            </div>
          )}

        {!loading && !error && listClassrooms.length > 0 && (
          <>
            <ScrollArea style={{ width: "100%", flex: 1 }}>
              <Table verticalSpacing="xs" highlightOnHover style={{ width: "100%", minWidth: "600px" }}>
                <thead>
                  <tr>
                    <th>Tên phòng học</th>
                    <th>Chức năng</th>
                    <th>Sức chứa</th>
                    <th>
                      <Button color="green" onClick={() => setIsOpenCreateClassroomModal(true)}>
                        <Text>Thêm phòng học</Text>
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listClassrooms.map((classroom: Classroom, index: number) => (
                    <tr key={index}>
                      <td style={{ width: "40%" }}>{classroom.name}</td>
                      <td style={{ width: "30%" }}>{classroom.function}</td>
                      <td>{classroom.capacity}</td>
                      <td>
                        <Button onClick={() => {
                          setCurrentClassroom(classroom);
                          setIsOpenModifyClassroomModal(true);
                        }}>
                          <Text>Sửa</Text>
                        </Button>
                        <Button color="red"
                          onClick={() => {
                            setCurrentClassroom(classroom);
                            setIsOpenRemoveClassroomModal(true);
                          }} ml={10}>
                          <Text>Xóa</Text>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ScrollArea>
            <Space h={20} />
            {currentPage > 0 && maxPage > 0 && (
              <Pagination
                className={styles.pagination}
                page={currentPage}
                total={maxPage}
                onChange={(choosedPage: number) => onClickPaginationPage(choosedPage)}
              />
            )}
            <Space h={20} />
          </>
        )}
      </Container>
    </>
  );
}


export default EmployeeClassroomScreen;
import { Button, Container, Grid, Input, Pagination, ScrollArea, Space, Table, Title, Text, Modal } from "@mantine/core";
import { useInputState, useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { EmployeeConstants, Url, UserRole } from "../../../../helpers/constants";
import { getGenderName } from "../../../../helpers/getGenderName";
import UserStudent from "../../../../models/userStudent.model";
import { useAuth } from "../../../../stores/Auth";
import Loading from "../../../commons/Loading";
import styles from "./student.module.css";
import CustomModal from "../Modal/modal";


interface IProps {
  total: number | null;
  students: UserStudent[];
  userRole: UserRole | null;
}


const EmployeeLateFeeStudentScreen = (props: IProps) => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const router = useRouter();
  const [authState] = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [listStudents, setListStudents] = useState<UserStudent[]>(props.students);
  const [total, setTotal] = useState(0);
  const [maxPage, setMaxPage] = useState(1);
  const [query, setQuery] = useInputState("");
  // Notify all student
  const [isNotifyAllStudentModalOpened, setIsNotifyAllStudentModalOpened] = useState(false);
  // Notify student
  const [isNotifyStudentModalOpened, setIsNotifyStudentModalOpened] = useState(false);
  // Common notify state
  const [currentStudent, setCurrentStudent] = useState<UserStudent | null>(null);
  const [isSendingStudentNotificationRequest, setIsSendingStudentNotificationRequest] = useState(false);


  const getStudents = useCallback(async (limit: number, skip: number, query: string) => {
    return await API.post(Url.employees.getLateFeeStudent, {
      token: authState.token,
      limit: limit,
      skip: skip,
      query: query,
    });
  }, [authState.token]);


  const notifyStudent = useCallback(async () => {
    try {
      setIsSendingStudentNotificationRequest(true);
      const responses = await API.post(Url.employees.notifyLateFeeStudent, {
        token: authState.token,
        studentId: currentStudent?.user.id,
      });
      if (responses == true) {
        toast.success("Gửi thông báo thành công")
      } else toast.error("Gửi thông báo thất bại. Vui lòng thử lại.")
      setIsSendingStudentNotificationRequest(false);
      setIsNotifyAllStudentModalOpened(false);
      setIsNotifyStudentModalOpened(false);
    } catch (error: any) {
      setIsSendingStudentNotificationRequest(false);
      setIsNotifyAllStudentModalOpened(false);
      setIsNotifyStudentModalOpened(false);
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
  }, [authState.token, currentStudent])


  const queryStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const responses = await getStudents(EmployeeConstants.limitStudent, 0, query);
      setCurrentPage(1);
      setTotal(responses.total);
      setMaxPage(Math.ceil(responses.total / EmployeeConstants.limitStudent));
      setListStudents(responses.students);
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
  }, [query])



  const onClickPaginationPage = useCallback(async (page: number) => {
    try {
      if (page < 1) return;
      setLoading(true);
      setError(false);
      const responses = await getStudents(
        EmployeeConstants.limitStudent,
        (page - 1) * EmployeeConstants.limitStudent,
        query
      );
      setTotal(responses.total);
      setMaxPage(Math.ceil(responses.total / EmployeeConstants.limitStudent));
      setListStudents(responses.students);
      setLoading(false);
      setCurrentPage(page);
    } catch (error: any) {
      setLoading(false);
      setCurrentPage(page);
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
  }, [query]);




  useEffect(() => {
    setLoading(false);
    if (props.total === null) {
      setError(true);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    } else {
      setTotal(props.total);
      setMaxPage(Math.ceil(props.total / EmployeeConstants.limitStudent));
    }
  }, []);


  return (
    <>
      <Head>
        <title>Danh sách học viên trễ học phí</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal
        opened={isNotifyAllStudentModalOpened}
        onClose={() => setIsNotifyAllStudentModalOpened(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <CustomModal
          loading={isSendingStudentNotificationRequest}
          title="Nhắc nhở"
          message={`Bạn có chắc muốn nhắc nhở toàn bộ học sinh đang nợ học phí chứ?`}
          buttonLabel="Xác nhận xóa"
          colorButton="red"
          callBack={notifyStudent}
        />
      </Modal>

      <Modal
        opened={isNotifyStudentModalOpened}
        onClose={() => setIsNotifyStudentModalOpened(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <CustomModal
          loading={isSendingStudentNotificationRequest}
          title="Nhắc nhở"
          message={`Bạn có chắc muốn nhắc nhở "${currentStudent?.user.fullName}"?`}
          buttonLabel="Xác nhận xóa"
          colorButton="red"
          callBack={notifyStudent}
        />
      </Modal>


      <Container size="xl" style={{
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
      }}>
        <Title align="center" size="2.6rem" color="#444" transform="uppercase" mt={20} mb={10}>
          Học viên trễ học phí
        </Title>
        <Grid mb={20}>
          {!isTablet && (<Grid.Col span={3}></Grid.Col>)}
          <Grid.Col span={isTablet ? (isMobile ? 12 : 8) : 4}>
            <Input
              styles={{ input: { color: "#444" } }}
              value={query}
              placeholder="Tìm kiếm theo tên hoặc MSHV"
              onChange={setQuery}
            />
          </Grid.Col>
          <Grid.Col span={isTablet ? (isMobile ? 12 : 4) : 2}>
            <Button fullWidth onClick={() => queryStudents()} disabled={loading}>
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
          listStudents.length == 0 && (
            <div className={styles.emptyResultContainer}>
              <p>Không có kết quả</p>
            </div>
          )}

        {!loading && !error && listStudents.length > 0 && (
          <>
            <ScrollArea style={{ width: "100%", flex: 1 }}>
              <Table verticalSpacing="xs" highlightOnHover style={{ width: "100%", minWidth: "600px" }}>
                <thead>
                  <tr>
                    <th>MSHV</th>
                    <th>Tên học viên</th>
                    <th>Giới tính</th>
                    <th>Ngày sinh</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>
                      <Button color="green" fullWidth
                        onClick={() => {
                          setCurrentStudent(null);
                          setIsNotifyAllStudentModalOpened(true);
                        }}>
                        Nhắc nhở tất cả
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listStudents.map((student: UserStudent, index: number) => (
                    <tr key={index}>
                      <td>{student.user.id}</td>
                      <td>{student.user.fullName}</td>
                      <td>{getGenderName(student.user.sex)}</td>
                      <td>{moment(student.user.dateOfBirth).format("DD/MM/YYYY")}</td>
                      <td>{student.user.email || "-"}</td>
                      <td>{student.user.phone || "-"}</td>
                      <td style={{ width: "80px" }}>
                        <Button fullWidth compact
                          onClick={() => {
                            setCurrentStudent(student);
                            setIsNotifyStudentModalOpened(true);
                          }}>
                          Nhắc nhở</Button>
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


export default EmployeeLateFeeStudentScreen;
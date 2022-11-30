import { Container, Loader, ScrollArea, Space, Table, Title, Text, Pagination, Modal, Grid, Input, Select, Divider } from "@mantine/core";
import { useInputState, useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { EmployeeConstants, Url } from "../../../../helpers/constants";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";
import styles from "./workers.module.css";
import UserTeacher from "../../../../models/userTeacher.model";
import UserTutor from "../../../../models/userTutor.model";
import 'dayjs/locale/vi';
import UserEmployee from "../../../../models/userEmployee.model";
import { getGenderName } from "../../../../helpers/getGenderName";
import Branch from "../../../../models/branch.model";
import CreateSalaryModal from "../Modal/modal";

interface IProps {
  teachers: {
    total: number;
    teachers: UserTeacher[];
  },
  branch: Branch | null;
}


enum WorkerType {
  TEACHER = "Teacher",
  TUTOR = "Tutor",
  EMPLOYEE = "Employee"
}


const EmployeeWorkersScreen = (props: IProps) => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  // Common state
  const [authState] = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [workerType, setWorkerType] = useState<WorkerType>(WorkerType.TEACHER);
  // Tutor state
  const [currentTutorsPage, setCurrentTutorsPage] = useState(1);
  const [listTutors, setListTutors] = useState<UserTutor[]>([]);
  const [totalTutors, setTotalTutors] = useState(0);
  const [maxPageTutors, setMaxPageTutors] = useState(1);
  // Teacher state
  const [currentTeachersPage, setCurrentTeachersPage] = useState(1);
  const [listTeachers, setListTeachers] = useState<UserTeacher[]>(props.teachers.teachers);
  const [totalTeachers, setTotalTeachers] = useState(props.teachers.total);
  const [maxPageTeachers, setMaxPageTeachers] = useState(Math.ceil(props.teachers.total / EmployeeConstants.limitTeacher));
  // Employee state
  const [currentEmployeesPage, setCurrentEmployeesPage] = useState(1);
  const [listEmployees, setListEmployees] = useState<UserEmployee[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [maxPageEmployees, setMaxPageEmployees] = useState(1);
  // Create salary state
  const [isConfirmCreateSalaryModalOpened, setIsConfirmCreateSalaryModalOpened] = useState(false);
  const [isSendingCreateSalaryRequest, setIsSendingCreateSaalaryRequest] = useState(false);
  // Query by name or id
  const [query, setQuery] = useInputState("");



  const getTutors = useCallback(async (limit: number, skip: number, query: string) => {
    return await API.post(Url.employees.getTutorsByBranch, {
      token: authState.token,
      limit: limit,
      skip: skip,
      query: query,
    });
  }, [authState.token]);



  const queryTutors = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const responses = await getTutors(EmployeeConstants.limitTutor, 0, query);
      setCurrentTutorsPage(1);
      setTotalTutors(responses.total);
      setMaxPageTutors(Math.ceil(responses.total / EmployeeConstants.limitTutor));
      setListTutors(responses.tutors);
      setLoading(false);
      setError(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [query])



  const onClickPaginationTutorsPage = useCallback(async (page: number) => {
    try {
      if (page < 1) return;
      setLoading(true);
      setError(false);
      const responses = await getTutors(
        EmployeeConstants.limitTutor,
        (page - 1) * EmployeeConstants.limitTutor,
        query
      );
      setTotalTutors(responses.total);
      setMaxPageTutors(Math.ceil(responses.total / EmployeeConstants.limitTutor));
      setListTutors(responses.tutors);
      setLoading(false);
      setCurrentTutorsPage(page);
    } catch (err) {
      setLoading(false);
      setCurrentTutorsPage(page);
      setError(true);
    }
  }, [query]);



  const getTeachers = useCallback(async (limit: number,
    skip: number, query: string) => {
    return await API.post(Url.employees.getTeachersByBranch, {
      token: authState.token,
      limit: limit,
      skip: skip,
      query: query
    });
  }, [authState.token]);



  const queryTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const responses = await getTeachers(EmployeeConstants.limitTeacher, 0, query);
      setCurrentTeachersPage(1);
      setTotalTeachers(responses.total);
      setMaxPageTeachers(Math.ceil(responses.total / EmployeeConstants.limitTeacher));
      setListTeachers(responses.teachers);
      setLoading(false);
      setError(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [query])



  const onConfirmCreateSalary = useCallback(async () => {
    try {
      setIsSendingCreateSaalaryRequest(true);
      const responses = await API.post(Url.employees.createSalary, { token: authState.token });
      if (responses == true) {
        toast.success("Gửi yêu cầu khởi tạo lương cho nhân sự");
      } else toast.error("Tạo lương thất bại. Vui lòng thử lại.");
      setIsSendingCreateSaalaryRequest(false);
      setIsConfirmCreateSalaryModalOpened(false);
    } catch (error: any) {
      console.log(error);
      setIsSendingCreateSaalaryRequest(false);
      setIsConfirmCreateSalaryModalOpened(false);
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
  }, [authState.token])




  const onClickPaginationTeachersPage = useCallback(async (page: number) => {
    try {
      if (page < 1) return;
      setLoading(true);
      setError(false);
      const responses = await getTeachers(
        EmployeeConstants.limitTeacher,
        (page - 1) * EmployeeConstants.limitTeacher,
        query
      );
      setTotalTeachers(responses.total);
      setMaxPageTeachers(Math.ceil(responses.total / EmployeeConstants.limitTeacher));
      setListTeachers(responses.teachers);
      setLoading(false);
      setCurrentTeachersPage(page);
    } catch (err) {
      setLoading(false);
      setCurrentTeachersPage(page);
      setError(true);
    }
  }, [query]);



  const getEmployees = useCallback(async (limit: number, skip: number, query: string) => {
    return await API.post(Url.employees.getEmployeesByBranch, {
      token: authState.token,
      limit: limit,
      skip: skip,
      query,
    });
  }, [authState.token]);



  const queryEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const responses = await getEmployees(EmployeeConstants.limitEmployee, 0, query);
      setCurrentEmployeesPage(1);
      setTotalEmployees(responses.total);
      setMaxPageEmployees(Math.ceil(responses.total / EmployeeConstants.limitEmployee));
      setListEmployees(responses.employees);
      setLoading(false);
      setError(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [query])



  const onClickPaginationEmployeesPage = useCallback(async (page: number) => {
    try {
      if (page < 1) return;
      setLoading(true);
      setError(false);
      const responses = await getEmployees(
        EmployeeConstants.limitEmployee,
        (page - 1) * EmployeeConstants.limitEmployee,
        query
      );
      setTotalEmployees(responses.total);
      setMaxPageEmployees(Math.ceil(responses.total / EmployeeConstants.limitEmployee));
      setListEmployees(responses.employees);
      setLoading(false);
      setCurrentEmployeesPage(page);
    } catch (err) {
      setLoading(false);
      setCurrentEmployeesPage(page);
      setError(true);
    }
  }, [query]);



  const onChangeDateQuery = useCallback(() => {
    if (workerType === WorkerType.EMPLOYEE)
      queryEmployees();
    else if (workerType === WorkerType.TUTOR)
      queryTutors();
    else if (workerType === WorkerType.TEACHER)
      queryTeachers();
  }, [workerType, queryEmployees, queryTutors, queryTeachers]);



  const onClickPaginationPage = useCallback((page: number) => {
    if (workerType === WorkerType.EMPLOYEE)
      onClickPaginationEmployeesPage(page);
    else if (workerType === WorkerType.TUTOR)
      onClickPaginationTutorsPage(page);
    else if (workerType === WorkerType.TEACHER)
      onClickPaginationTeachersPage(page);
  }, [workerType, onClickPaginationEmployeesPage, onClickPaginationTutorsPage, onClickPaginationTeachersPage]);


  const getCurentPage = useCallback(() => {
    if (workerType === WorkerType.EMPLOYEE)
      return currentEmployeesPage;
    else if (workerType === WorkerType.TUTOR)
      return currentTutorsPage;
    else if (workerType === WorkerType.TEACHER)
      return currentTeachersPage;
    return 1;
  }, [workerType, currentEmployeesPage, currentTutorsPage, currentTeachersPage]);



  const getMaxPage = useCallback(() => {
    if (workerType === WorkerType.EMPLOYEE)
      return maxPageEmployees;
    else if (workerType === WorkerType.TUTOR)
      return maxPageTutors;
    else if (workerType === WorkerType.TEACHER)
      return maxPageTeachers;
    return 1;
  }, [workerType, maxPageEmployees, maxPageTutors, maxPageTeachers]);



  const getListData = useCallback(() => {
    if (workerType === WorkerType.EMPLOYEE)
      return listEmployees;
    else if (workerType === WorkerType.TUTOR)
      return listTutors;
    else if (workerType === WorkerType.TEACHER)
      return listTeachers;
    return [];
  }, [workerType, listEmployees, listTutors, listTeachers]);



  const onChangeWorkerType = useCallback((value: WorkerType) => {
    setWorkerType(value);
    setQuery("");
  }, []);



  useEffect(() => {
    onClickPaginationPage(1);
  }, [workerType])



  return (
    <>
      <Head>
        <title>Danh sách nhân sự</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>



      <Modal
        opened={isConfirmCreateSalaryModalOpened}
        onClose={() => setIsConfirmCreateSalaryModalOpened(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <CreateSalaryModal
          loading={isSendingCreateSalaryRequest}
          title="Tạo lương"
          message={`Bạn có chắc muốn khởi tạo lương cho nhân sự trong chi nhánh?`}
          buttonLabel="Xác nhận"
          colorButton="green"
          callBack={onConfirmCreateSalary}
        />
      </Modal>


      <Container size="xl" style={{
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
      }}>
        <Title align="center" size="2.6rem" color="#444" transform="uppercase" mt={20}>
          Danh sách nhân sự
        </Title>
        <Container p={0} mt={5} mb={15}>
          <Text color="#444" align="center" weight={600}>Loại nhân sự</Text>
          <Select
            placeholder="Loại nhân sự"
            value={workerType}
            onChange={onChangeWorkerType}
            data={!authState.isManager ? [
              { value: WorkerType.TEACHER, label: "Giáo viên" },
              { value: WorkerType.TUTOR, label: "Trợ giảng" }
            ] : [
              { value: WorkerType.TEACHER, label: "Giáo viên" },
              { value: WorkerType.TUTOR, label: "Trợ giảng" },
              { value: WorkerType.EMPLOYEE, label: "Nhân viên" }
            ]}
          />
        </Container>
        <Divider
          style={{ maxWidth: "300px" }}
          mx="auto" label={props.branch?.name || ""}
          labelPosition="center"
          variant="dashed"
        />
        <Grid my={15}>
          {!isTablet && (<Grid.Col span={authState.isManager ? 2 : 3}></Grid.Col>)}
          <Grid.Col span={isTablet ? (isMobile ? 12 : 8) : 4}>
            <Input
              styles={{ input: { color: "#444" } }}
              value={query}
              placeholder="Tìm kiếm theo tên hoặc mã số"
              onChange={setQuery}
            />
          </Grid.Col>
          <Grid.Col span={isTablet ? (isMobile ? 12 : 4) : 2}>
            <Button fullWidth onClick={() => onChangeDateQuery()} disabled={loading}>
              Tìm kiếm
            </Button>
          </Grid.Col>
          {authState.isManager && (
            <Grid.Col span={isTablet ? 12 : 2}>
              <Button color="green" fullWidth onClick={() => setIsConfirmCreateSalaryModalOpened(true)} disabled={loading}>
                Tạo lương
              </Button>
            </Grid.Col>
          )}
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
              onClick={() => onClickPaginationPage(getCurentPage())}>
              Thử lại
            </Button>
          </div>
        )}

        {!loading &&
          !error &&
          getListData().length == 0 && (
            <div className={styles.emptyResultContainer}>
              <p>Không có kết quả</p>
            </div>
          )}

        {!loading && !error && getListData().length > 0 && (
          <>
            <ScrollArea style={{ width: "100%", flex: 1 }}>
              <Table verticalSpacing="xs" highlightOnHover style={{ width: "100%", minWidth: "max-content" }}>
                <thead>
                  <tr>
                    <th>
                      {workerType === WorkerType.EMPLOYEE && (<Text>MSNV</Text>)}
                      {workerType === WorkerType.TEACHER && (<Text>MSGV</Text>)}
                      {workerType === WorkerType.TUTOR && (<Text>MSTG</Text>)}
                    </th>
                    <th>Họ và tên</th>
                    <th>Giới tính</th>
                    <th>Ngày sinh</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>CMND/CCCD</th>
                    <th>Địa chỉ</th>
                  </tr>
                </thead>
                <tbody>
                  {getListData().map((item, index) => (
                    <tr key={index}>
                      <td>{item.worker.user.id}</td>
                      <td>{item.worker.user.fullName}</td>
                      <td>{getGenderName(item.worker.user.sex)}</td>
                      <td>{moment(item.worker.user.dateOfBirth).format("DD/MM/YYYY")}</td>
                      <td>{item.worker.user.email || "-"}</td>
                      <td>{item.worker.user.phone || "-"}</td>
                      <td>{item.worker.passport}</td>
                      <td>{item.worker.user.address}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ScrollArea>
            <Space h={20} />
            {getCurentPage() > 0 && getMaxPage() > 0 && (
              <Pagination
                className={styles.pagination}
                page={getCurentPage()}
                total={getMaxPage()}
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


export default EmployeeWorkersScreen;
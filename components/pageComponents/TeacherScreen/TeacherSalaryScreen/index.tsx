import { Container, Loader, ScrollArea, Space, Table, Title, Text, Pagination, Modal, Grid, Input } from "@mantine/core";
import { DateRangePicker, DateRangePickerValue } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { TeacherConstants, TimeZoneOffset, Url } from "../../../../helpers/constants";
import { formatCurrency } from "../../../../helpers/formatCurrency";
import Salary from "../../../../models/salary.model";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";
import styles from "./salary.module.css";
import 'dayjs/locale/vi';


interface IProps {
  salaries: {
    total: number;
    salaries: Salary[];
  }
}


const TeacherSalaryScreen = (props: IProps) => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const [authState] = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [listSalaries, setListSalaries] = useState<Salary[]>(props.salaries.salaries);
  const [total, setTotal] = useState(props.salaries.total);
  const [maxPage, setMaxPage] = useState(Math.ceil(props.salaries.total / TeacherConstants.limitSalary));
  const [date, setDate] = useState<DateRangePickerValue>([null, null]);



  const getSalaries = useCallback(async (limit: number,
    skip: number, fromDate: Date | null, toDate: Date | null) => {
    return await API.post(Url.teachers.getSalaries, {
      token: authState.token,
      limit: limit,
      skip: skip,
      fromDate: fromDate,
      toDate: toDate
    });
  }, [authState.token]);



  const querySalaries = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const responses = await getSalaries(TeacherConstants.limitSalary, 0, date[0], date[1]);
      setCurrentPage(1);
      setTotal(responses.total);
      setMaxPage(Math.ceil(responses.total / TeacherConstants.limitSalary));
      setListSalaries(responses.salaries);
      setLoading(false);
      setError(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [date[0], date[1]])



  const onClickPaginationPage = useCallback(async (page: number) => {
    try {
      if (page < 1) return;
      setLoading(true);
      setError(false);
      const responses = await getSalaries(
        TeacherConstants.limitSalary,
        (page - 1) * TeacherConstants.limitSalary,
        date[0], date[1]
      );
      setTotal(responses.total);
      setMaxPage(Math.ceil(responses.total / TeacherConstants.limitSalary));
      setListSalaries(responses.salaries);
      setLoading(false);
      setCurrentPage(page);
    } catch (err) {
      setLoading(false);
      setCurrentPage(page);
      setError(true);
    }
  }, [date[0], date[1]]);




  return (
    <>
      <Head>
        <title>Lương cá nhân</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container size="xl" style={{
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
      }}>
        <Title align="center" size="2.6rem" color="#444" transform="uppercase" my={20}>
          Khoản lương cá nhân
        </Title>
        <Grid mb={20}>
          {!isTablet && (<Grid.Col span={3}></Grid.Col>)}
          <Grid.Col span={isTablet ? (isMobile ? 12 : 8) : 4}>
            <DateRangePicker
              placeholder="Tìm kiếm theo ngày"
              value={date}
              onChange={setDate}
              locale="vi"
            />
          </Grid.Col>
          <Grid.Col span={isTablet ? (isMobile ? 12 : 4) : 2}>
            <Button fullWidth onClick={() => querySalaries()} disabled={loading}>
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
          listSalaries.length == 0 && (
            <div className={styles.emptyResultContainer}>
              <p>Không có kết quả</p>
            </div>
          )}

        {!loading && !error && listSalaries.length > 0 && (
          <>
            <ScrollArea style={{ width: "100%", flex: 1 }}>
              <Table verticalSpacing="xs" highlightOnHover style={{ width: "100%", minWidth: "900px" }}>
                <thead>
                  <tr>
                    <th>Mã giao dịch</th>
                    <th>Nội dung</th>
                    <th>Số tiền</th>
                    <th>Ngày giao dịch</th>
                    <th>Người giao dịch</th>
                  </tr>
                </thead>
                <tbody>
                  {listSalaries.map((salary, index) => (
                    <tr key={index}>
                      <td>{salary.transCode.transCode}</td>
                      <td>{salary.transCode.content}</td>
                      <td>{formatCurrency(salary.transCode.amount)}</td>
                      <td>{moment(salary.transCode.payDate).utcOffset(TimeZoneOffset).format("HH:mm:ss DD/MM/YYYY")}</td>
                      <td>{salary.transCode.userEmployee.worker.user.fullName}</td>
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


export default TeacherSalaryScreen;
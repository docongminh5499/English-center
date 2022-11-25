import { Container, Loader, ScrollArea, Space, Table, Title, Text, Pagination, Modal, Grid, Input, Select, Divider } from "@mantine/core";
import { DateRangePicker, DateRangePickerValue } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { EmployeeConstants, TimeZoneOffset, TransactionType, Url } from "../../../../helpers/constants";
import { formatCurrency } from "../../../../helpers/formatCurrency";
import Salary from "../../../../models/salary.model";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";
import styles from "./transactions.module.css";
import 'dayjs/locale/vi';
import Fee from "../../../../models/fee.model";
import Refund from "../../../../models/refund.model";
import Branch from "../../../../models/branch.model";


interface IProps {
  fees: {
    total: number;
    fees: Fee[];
  },
  branch: Branch | null;
}


const EmployeeTransactionScreen = (props: IProps) => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  // Common state
  const [authState] = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.Fee);
  // Salary state
  const [currentSalariesPage, setCurrentSalariesPage] = useState(1);
  const [listSalaries, setListSalaries] = useState<Salary[]>([]);
  const [totalSalaries, setTotalSalaries] = useState(0);
  const [maxPageSalaries, setMaxPageSalaries] = useState(1);
  // Fee state
  const [currentFeesPage, setCurrentFeesPage] = useState(1);
  const [listFees, setListFees] = useState<Fee[]>(props.fees.fees);
  const [totalFees, setTotalFees] = useState(props.fees.total);
  const [maxPageFees, setMaxPageFees] = useState(Math.ceil(props.fees.total / EmployeeConstants.limitFee));
  // Refund state
  const [currentRefundsPage, setCurrentRefundsPage] = useState(1);
  const [listRefunds, setListRefunds] = useState<Refund[]>([]);
  const [totalRefunds, setTotalRefunds] = useState(0);
  const [maxPageRefunds, setMaxPageRefunds] = useState(1);
  // Query by date
  const [date, setDate] = useState<DateRangePickerValue>([null, null]);



  const getSalaries = useCallback(async (limit: number,
    skip: number, fromDate: Date | null, toDate: Date | null) => {
    return await API.post(Url.employees.getSalariesByBranch, {
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
      const responses = await getSalaries(EmployeeConstants.limitSalaryTransaction, 0, date[0], date[1]);
      setCurrentSalariesPage(1);
      setTotalSalaries(responses.total);
      setMaxPageSalaries(Math.ceil(responses.total / EmployeeConstants.limitSalaryTransaction));
      setListSalaries(responses.salaries);
      setLoading(false);
      setError(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [date[0], date[1]])



  const onClickPaginationSalariesPage = useCallback(async (page: number) => {
    try {
      if (page < 1) return;
      setLoading(true);
      setError(false);
      const responses = await getSalaries(
        EmployeeConstants.limitSalaryTransaction,
        (page - 1) * EmployeeConstants.limitSalaryTransaction,
        date[0], date[1]
      );
      setTotalSalaries(responses.total);
      setMaxPageSalaries(Math.ceil(responses.total / EmployeeConstants.limitSalaryTransaction));
      setListSalaries(responses.salaries);
      setLoading(false);
      setCurrentSalariesPage(page);
    } catch (err) {
      setLoading(false);
      setCurrentSalariesPage(page);
      setError(true);
    }
  }, [date[0], date[1]]);



  const getFees = useCallback(async (limit: number,
    skip: number, fromDate: Date | null, toDate: Date | null) => {
    return await API.post(Url.employees.getFeesByBranch, {
      token: authState.token,
      limit: limit,
      skip: skip,
      fromDate: fromDate,
      toDate: toDate
    });
  }, [authState.token]);



  const queryFees = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const responses = await getFees(EmployeeConstants.limitFee, 0, date[0], date[1]);
      setCurrentFeesPage(1);
      setTotalFees(responses.total);
      setMaxPageFees(Math.ceil(responses.total / EmployeeConstants.limitFee));
      setListFees(responses.fees);
      setLoading(false);
      setError(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [date[0], date[1]])



  const onClickPaginationFeesPage = useCallback(async (page: number) => {
    try {
      if (page < 1) return;
      setLoading(true);
      setError(false);
      const responses = await getFees(
        EmployeeConstants.limitFee,
        (page - 1) * EmployeeConstants.limitFee,
        date[0], date[1]
      );
      setTotalFees(responses.total);
      setMaxPageFees(Math.ceil(responses.total / EmployeeConstants.limitFee));
      setListFees(responses.fees);
      setLoading(false);
      setCurrentFeesPage(page);
    } catch (err) {
      setLoading(false);
      setCurrentFeesPage(page);
      setError(true);
    }
  }, [date[0], date[1]]);



  const getRefunds = useCallback(async (limit: number,
    skip: number, fromDate: Date | null, toDate: Date | null) => {
    return await API.post(Url.employees.getRefundsByBranch, {
      token: authState.token,
      limit: limit,
      skip: skip,
      fromDate: fromDate,
      toDate: toDate
    });
  }, [authState.token]);



  const queryRefunds = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const responses = await getRefunds(EmployeeConstants.limitRefund, 0, date[0], date[1]);
      setCurrentRefundsPage(1);
      setTotalRefunds(responses.total);
      setMaxPageRefunds(Math.ceil(responses.total / EmployeeConstants.limitRefund));
      setListRefunds(responses.refunds);
      setLoading(false);
      setError(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [date[0], date[1]])



  const onClickPaginationRefundsPage = useCallback(async (page: number) => {
    try {
      if (page < 1) return;
      setLoading(true);
      setError(false);
      const responses = await getRefunds(
        EmployeeConstants.limitRefund,
        (page - 1) * EmployeeConstants.limitRefund,
        date[0], date[1]
      );
      setTotalRefunds(responses.total);
      setMaxPageRefunds(Math.ceil(responses.total / EmployeeConstants.limitRefund));
      setListRefunds(responses.refunds);
      setLoading(false);
      setCurrentRefundsPage(page);
    } catch (err) {
      setLoading(false);
      setCurrentRefundsPage(page);
      setError(true);
    }
  }, [date[0], date[1]]);



  const onChangeDateQuery = useCallback(() => {
    if (transactionType === TransactionType.Salary)
      querySalaries();
    else if (transactionType === TransactionType.Fee)
      queryFees();
    else if (transactionType === TransactionType.Refund)
      queryRefunds();
  }, [transactionType, querySalaries, queryFees, queryRefunds]);



  const onClickPaginationPage = useCallback((page: number) => {
    if (transactionType === TransactionType.Salary)
      onClickPaginationSalariesPage(page);
    else if (transactionType === TransactionType.Fee)
      onClickPaginationFeesPage(page);
    else if (transactionType === TransactionType.Refund)
      onClickPaginationRefundsPage(page);
  }, [transactionType, onClickPaginationSalariesPage, onClickPaginationFeesPage, onClickPaginationRefundsPage]);


  const getCurentPage = useCallback(() => {
    if (transactionType === TransactionType.Salary)
      return currentSalariesPage;
    else if (transactionType === TransactionType.Fee)
      return currentFeesPage;
    else if (transactionType === TransactionType.Refund)
      return currentRefundsPage;
    return 1;
  }, [transactionType, currentSalariesPage, currentFeesPage, currentRefundsPage]);



  const getMaxPage = useCallback(() => {
    if (transactionType === TransactionType.Salary)
      return maxPageSalaries;
    else if (transactionType === TransactionType.Fee)
      return maxPageFees;
    else if (transactionType === TransactionType.Refund)
      return maxPageRefunds;
    return 1;
  }, [transactionType, maxPageSalaries, maxPageFees, maxPageRefunds]);



  const getListData = useCallback(() => {
    if (transactionType === TransactionType.Salary)
      return listSalaries;
    else if (transactionType === TransactionType.Fee)
      return listFees;
    else if (transactionType === TransactionType.Refund)
      return listRefunds;
    return [];
  }, [transactionType, listSalaries, listFees, listRefunds]);



  const onChangeTransactionType = useCallback((value: TransactionType) => {
    setTransactionType(value);
    setDate([null, null]);
  }, []);



  useEffect(() => {
    onClickPaginationPage(1);
  }, [transactionType])



  return (
    <>
      <Head>
        <title>Danh sách giao dịch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container size="xl" style={{
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
      }}>
        <Title align="center" size="2.6rem" color="#444" transform="uppercase" mt={20}>
          Danh sách giao dịch
        </Title>
        <Container p={0} mt={5} mb={15}>
          <Text color="#444" align="center" weight={600}>Loại giao dịch</Text>
          <Select
            placeholder="Loại giao dịch"
            value={transactionType}
            onChange={onChangeTransactionType}
            data={!authState.isManager ? [
              { value: TransactionType.Fee, label: "Học phí" },
              { value: TransactionType.Refund, label: "Hoàn phí" }
            ] : [
              { value: TransactionType.Fee, label: "Học phí" },
              { value: TransactionType.Refund, label: "Hoàn phí" },
              { value: TransactionType.Salary, label: "Lương" }
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
            <Button fullWidth onClick={() => onChangeDateQuery()} disabled={loading}>
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
                    <th>Mã giao dịch</th>
                    <th>Nội dung</th>
                    <th>Số tiền</th>
                    <th>Ngày giao dịch</th>
                    <th>Thuộc về</th>
                    <th>Người giao dịch</th>
                  </tr>
                </thead>
                <tbody>
                  {getListData().map((item, index) => (
                    <tr key={index}>
                      <td>{item.transCode.transCode}</td>
                      <td>{item.transCode.content}</td>
                      <td>{formatCurrency(item.transCode.amount)}</td>
                      <td>{moment(item.transCode.payDate).utcOffset(TimeZoneOffset).format("HH:mm:ss DD/MM/YYYY")}</td>
                      <td>
                        {transactionType === TransactionType.Fee && (
                          <Text color="#444">{(item as Fee).userStudent.user.fullName}</Text>
                        )}
                        {transactionType === TransactionType.Refund && (
                          <Text color="#444">{(item as Refund).fee.userStudent.user.fullName}</Text>
                        )}
                        {transactionType === TransactionType.Salary && (
                          <Text color="#444">{(item as Salary).worker.user.fullName}</Text>
                        )}
                      </td>
                      <td>{item.transCode.userEmployee.worker.user.fullName}</td>
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


export default EmployeeTransactionScreen;
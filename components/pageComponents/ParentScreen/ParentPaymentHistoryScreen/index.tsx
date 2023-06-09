import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Loader,
  MediaQuery,
  Modal,
  Pagination,
  Popover,
  ScrollArea,
  Select,
  Space,
  Table,
  Text,
  Title,
} from "@mantine/core";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import {
  ParentConstants,
  StudentConstants,
  TimeZoneOffset,
  Url,
} from "../../../../helpers/constants";
import { useAuth } from "../../../../stores/Auth";
import SelectStudentModal from "../Modal/selectStudent.modal";
import Head from "next/head";
import { useParent } from "../../../../stores/Parent";
import styles from "./fee.module.css";
import { formatCurrency } from "../../../../helpers/formatCurrency";
import { PayPalButtons } from "@paypal/react-paypal-js";

const ParentPaymentHistoryScreen = (props: any) => {
  const [authState] = useAuth();
  const [parentState, setParentState] = useParent();
  const [selectStudentModal, setSelectStudentModal] = useState(
    parentState.selectedStudentId == undefined ? true : false
  );
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  //Payment
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [listFee, setListFee] = useState([]);
  const [total, setTotal] = useState(0);
  const [maxPage, setMaxPage] = useState(
    Math.ceil(total / ParentConstants.limitFee)
  );
  const [confirmPayment, setConfirmPayment] = useState(false);
  const [paymentFee, setPaymentFee] = useState(null);
  const [orderDetail, setOrderDetail] = useState<object | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [selectedCourseForPayment, setSelectedCourseForPayment] =
    useState(null);

  console.log(
    "============================================================================="
  );
  console.log(parentState);
  const parent = props.userParent;

  useEffect(() => {
    const didMountFunc = async () => {
      try {
        setLoading(true);
        if (parentState.selectedStudentId == undefined) return;
        const paymentResponse = await API.get(
          Url.parents.getStudentPaymentHistory,
          {
            token: authState.token,
            studentId: parentState.selectedStudentId,
            limit: ParentConstants.limitFee,
            skip: 0,
          }
        );
        //Set state
        setListFee(paymentResponse.fee);
        setTotal(paymentResponse.total);
        setMaxPage(Math.ceil(paymentResponse.total / ParentConstants.limitFee));
        console.log(
          "-------------------------------------------------------------------"
        );
        console.log(parent);
        const userStudent = parent.userStudents.filter(
          (value: any) => value.user.id === parentState.selectedStudentId
        );
        console.log(
          "-------------------------------------------------------------------"
        );
        console.log(userStudent);
        if (userStudent.length !== 0) setSelectedStudent(userStudent[0]);
      } catch (error) {
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    didMountFunc();
  }, [parentState.selectedStudentId]);

  const getFee = useCallback(
    async (limit: number, skip: number) => {
      return await API.get(Url.parents.getStudentPaymentHistory, {
        token: authState.token,
        studentId: parentState.selectedStudentId,
        limit: limit,
        skip: skip,
      });
    },
    [authState.token]
  );

  const onClickPaginationPage = async (page: number) => {
    try {
      if (page < 1) return;
      setLoading(true);
      setError(false);
      const responses = await getFee(
        StudentConstants.limitFee,
        (page - 1) * StudentConstants.limitFee
      );
      setTotal(responses.total);
      setMaxPage(Math.ceil(responses.total / StudentConstants.limitFee));
      setListFee(responses.fee);
      setLoading(false);
      setCurrentPage(page);
    } catch (err) {
      setLoading(false);
      setCurrentPage(page);
      setError(true);
    }
  };

  console.log(props.parent);
  console.log(`Selected Student: ${selectedStudent?.user.fullName}`);

  const createOrder = useCallback(
    (data: any, actions: any) => {
      return actions.order.create(orderDetail);
    },
    [orderDetail]
  );

  const onApprove = 
    (data: any, actions: any) => {
      return actions.order.capture().then(async function (detail: any) {
        try {
          await API.post(Url.payments.parentPayment, {
            token: authState.token,
            courseSlug: selectedCourseForPayment?.slug,
            studentId: parentState.selectedStudentId,
            orderId: detail.id,
          });
          const paymentHistory = await API.get(
            Url.parents.getStudentPaymentHistory,
            {
              token: authState.token,
              studentId: parentState.selectedStudentId,
              limit: ParentConstants.limitFee,
              skip: 0,
            }
          );
          setListFee(paymentHistory === null ? [] : paymentHistory.fee);
          setConfirmPayment(false);
          toast.success("Thanh toán thành công.");
        } catch (error: any) {
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
            } else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
          } else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
        } finally {
          setConfirmPayment(false);
        }
      });
    };

    const onError = useCallback((error: any) => {
      console.log(error)
      toast.error("Lỗi thanh toán, vui lòng thử lại sau.");
      setConfirmPayment(false);
    }, []);
  //================================================================================================

  return (
    <Box m={"md"} style={{ width: "100%" }}>
      <Head>
        <title>Lịch sử thanh toán</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Modal
        zIndex={10}
        centered
        opened={confirmPayment}
        onClose={() => {
          setPaymentFee(null);
          setConfirmPayment(false);
        }}
      >
        <Box>
          <Title order={3} align="center">
            Xác nhận thanh toán khoản tiền{" "}
            {formatCurrency(paymentFee?.transCode.amount)}?
          </Title>

          <Group position="center" mt="sm">
            <PayPalButtons
              style={{
                color: "blue",
                shape: "pill",
                label: "pay",
                tagline: false,
                layout: "horizontal",
              }}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
            />
          </Group>
        </Box>
      </Modal>
      {selectStudentModal && (
        <SelectStudentModal
          students={parent.userStudents}
          setSelectedStudent={setSelectedStudent}
          openedModal={setSelectStudentModal}
        />
      )}

      {!selectStudentModal && !loading && (
        <>
          <Box style={{ width: "100%" }}>
						<MediaQuery smallerThan={768} styles={{ fontSize: "2rem" }}>
							<Title order={1} align="center">
								Lịch sử giao dịch
							</Title>
						</MediaQuery>
            <Grid>
                <Grid.Col span={6}>
                  <Title
                    align="right"
                    order={3}
                    style={{ width: "100%" }}
                    mt={"sm"}
                  >
                    Học viên:
                  </Title>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Group position="left" align={"center"} mt="sm">
                    <Select
                      radius={"md"}
                      size={"md"}
                      placeholder="Chọn học viên muốn bạn theo dõi"
                      defaultValue={parentState.selectedStudentId?.toString()}
                      onChange={(value: string) => {
                        setParentState.setSelectedStudent(parseInt(value));
                      }}
                      data={parent.userStudents.map((userStudent: any) => {
                        return {
                          value: userStudent.user.id.toString(),
                          label: userStudent.user.fullName,
                        };
                      })}
                    />
                  </Group>
                </Grid.Col>
              </Grid>

            {listFee.length === 0 && (
              <Box>
                <Group mt={"sm"} grow align={"center"}>
                  <Title order={3} color="gray" align="center">
                    Không có dữ liệu.
                  </Title>
                </Group>
              </Box>
            )}

            {listFee.length !== 0 && (
              <Box mt="lg">
                <ScrollArea style={{ width: "100%", flex: 1 }}>
                  <Table
                    verticalSpacing="xs"
                    highlightOnHover
                    style={{ width: "100%", minWidth: "900px" }}
                  >
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
                      {listFee.map((fee: any, index: number) => (
                        <tr key={index}>
                          <td>{fee.transCode.transCode}</td>
                          <td>{fee.transCode.content}</td>
                          <td>{formatCurrency(fee.transCode.amount)}</td>
                          <td>
                            {new Date(fee.transCode.payDate).getTime() === 0
                              ? "Chưa thanh toán"
                              : moment(fee.transCode.payDate)
                                  .utcOffset(TimeZoneOffset)
                                  .format("HH:mm:ss DD/MM/YYYY")}
                          </td>
                          <td>
                            {fee.transCode.userEmployee === undefined ? (
                              <Button
                                onClick={() => {
                                  setConfirmPayment(true);
                                  setPaymentFee(fee);
                                  setSelectedCourseForPayment(fee.course)
                                  setOrderDetail({
                                    intent: "CAPTURE",
                                    purchase_units: [
                                      {
                                        amount: {
                                          currency_code: "USD",
                                          value: (Math.ceil(fee.transCode.amount / 23000 * 100) / 100).toString(),
                                        },
                                      },
                                    ],
                                    application_context: {
                                      shipping_preference: "NO_SHIPPING",
                                    },
                                  });
                                  setAmount(fee.transCode.amount);
                                }}
                              >
                                Thanh toán
                              </Button>
                            ) : (
                              fee.transCode.userEmployee?.worker.user.fullName || "-"
                            )}
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
                    onChange={(choosedPage: number) =>
                      onClickPaginationPage(choosedPage)
                    }
                  />
                )}
              </Box>
            )}
          </Box>
        </>
      )}

      {loading && (
        <Group position="center">
          <Loader size={"lg"} />
        </Group>
      )}
    </Box>
  );
};

export default ParentPaymentHistoryScreen;

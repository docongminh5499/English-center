import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Input,
  Loader,
  Modal,
  Pagination,
  ScrollArea,
  Space,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { IconTrash } from "@tabler/icons";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import {
  StudentConstants,
  TimeZoneOffset,
  Url,
  UserRole,
} from "../../../../helpers/constants";
import { formatCurrency } from "../../../../helpers/formatCurrency";
import { getGenderName } from "../../../../helpers/getGenderName";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";
import styles from "./fee.module.css";

const StudentPersonalScreen = (props: any) => {
  const isLargeTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 480px)");
  const [didMount, setDidMount] = useState(false);
  const router = useRouter();

  const [authState] = useAuth();
  const [addParentModal, setAddParentModal] = useState(false);
  const [parentSearchValue, setParentSearchValue] = useState("");
  const [parentList, setParentList] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [confirmDeleteParent, setConfirmDeleteParent] = useState(false);

  //Payment
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [listFee, setListFee] = useState(props.payments === null ? [] : props.payments.fee);
  const [total, setTotal] = useState(props.payments === null ? 0 : props.payments.total);
  const [maxPage, setMaxPage] = useState(
    Math.ceil(total / StudentConstants.limitFee)
  );
  const [confirmPayment, setConfirmPayment] = useState(false);
  const [paymentFee, setPaymentFee] = useState(null);
  const [orderDetail, setOrderDetail] = useState<object | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
	const [selectedCourseForPayment, setSelectedCourseForPayment] = useState(null);

  useEffect(() => {
    if (props.userStudent === null) router.replace("/not-found");
    else setDidMount(true);
  }, []);

  const getFee = useCallback(
    async (limit: number, skip: number) => {
      return await API.get(Url.students.getPaymentHistory, {
        token: authState.token,
        limit: limit,
        skip: skip,
      });
    },
    [authState.token]
  );

  const onClickPaginationPage = useCallback(async (page: number) => {
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
  }, []);

  const createOrder = useCallback(
    (data: any, actions: any) => {
      return actions.order.create(orderDetail);
    },
    [orderDetail]
  );

  const onApprove = useCallback(
    (data: any, actions: any) => {
      return actions.order.capture().then(async function (detail: any) {
        try {
          await API.post(Url.payments.studentPayment, {
            token: authState.token,
            courseSlug: selectedCourseForPayment?.slug,
            studentId: props.userStudent?.user.id,
            orderId: detail.id,
          });
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
        }
      });
    },
    [authState.token, paymentFee]
  );
  //================================================================================================

  const findParent = async () => {
    try {
      const parentListResponse = await API.get(Url.students.getParentList, {
        token: authState.token,
        searchValue: parentSearchValue,
      });
      console.log(parentListResponse);
      setParentList(parentListResponse);
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống gặp sự cố, vui lòng thử lại sau!");
    }
  };

  const addParent = async () => {
    try {
      if (selectedParent === null) {
        return;
      }
      const response = await API.post(Url.students.addParent, {
        token: authState.token,
        parentId: selectedParent.user.id,
      });
      props.userStudent.userParent = response;
      console.log(response);
      toast.success("Thêm phụ huynh thành công");
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống gặp sự cố, vui lòng thử lại sau!");
    } finally {
      setParentSearchValue("");
      setParentList(null);
      setSelectedParent(null);
      setAddParentModal(false);
    }
  };
  const deleteParent = async () => {
    try {
      if (props.userStudent?.userParent === null) {
        return;
      }
      const response = await API.post(Url.students.deleteParent, {
        token: authState.token,
        parentId: props.userStudent?.userParent.user.id,
      });
      props.userStudent.userParent = null;
      console.log(response);
      if (response === true) toast.success("Xóa phụ huynh thành công");
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống gặp sự cố, vui lòng thử lại sau!");
    } finally {
      setConfirmDeleteParent(false);
    }
  };

  let parentRows = <></>;

  if (parentList !== null) {
    parentRows = parentList.map((userParent: any) => {
      return (
        <Container
          mt={"sm"}
          key={userParent.user.id}
          onClick={() => setSelectedParent(userParent)}
          style={{
            background:
              selectedParent !== null &&
              userParent.user.id === selectedParent.user.id
                ? "#E7E5E8"
                : "white",
          }}
        >
          <Group>
            <Avatar src={getAvatarImageUrl(userParent.user.avatar)} />

            <div>
              <Text size="sm">{userParent.user.fullName}</Text>
              <Text size="xs" opacity={0.65}>
                {userParent.user.id}
              </Text>
            </div>
          </Group>
        </Container>
      );
    });
  }

  return (
    <>
      <Head>
        <title>Tài khoản cá nhân</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal
        zIndex={10}
        centered
        opened={confirmDeleteParent}
        onClose={() => {
          setConfirmDeleteParent(false);
        }}
      >
        <Box>
          <Title order={3} align="center">
            Xác nhận xóa người phụ thuộc?
          </Title>

          <Group position="center" mt="sm">
            <Button color={"green"} onClick={() => deleteParent()}>
              Xác nhận
            </Button>

            <Button
              color={"red"}
              ml="sm"
              onClick={() => setConfirmDeleteParent(false)}
            >
              Hủy bỏ
            </Button>
          </Group>
        </Box>
      </Modal>

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
              // onError={onError}
            />
          </Group>
        </Box>
      </Modal>

      <Modal
        zIndex={10}
        centered
        opened={addParentModal}
        onClose={() => {
          setParentSearchValue("");
          setParentList(null);
          setAddParentModal(false);
          setSelectedParent(null);
        }}
      >
        <Box>
          <Title order={3}>Chọn phụ huynh bạn muốn thêm.</Title>
          <Grid mt={"sm"}>
            <Grid.Col span={9}>
              <TextInput
                value={parentSearchValue}
                onChange={(event) =>
                  setParentSearchValue(event.currentTarget.value)
                }
                placeholder="Nhập tên hoặc mã số của phụ huynh"
              />
            </Grid.Col>

            <Grid.Col span={2}>
              <Button
                onClick={() => {
                  setSelectedParent(null);
                  findParent();
                }}
              >
                Tìm kiếm
              </Button>
            </Grid.Col>
          </Grid>
          {parentList === null && (
            <Group align={"center"} position="center" grow>
              <Title order={3} color="gray" mt="sm" align="center">
                Không tìm thấy kết quả nào.
              </Title>
            </Group>
          )}

          {parentList !== null && (
            <Box>
              {parentRows}
              <Group position="center">
                <Button color="green" mt={"md"} onClick={() => addParent()} disabled={selectedParent === null}>
                  Thêm
                </Button>
              </Group>
            </Box>
          )}
        </Box>
      </Modal>

      {!didMount && (
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading />
        </Container>
      )}

      {didMount && (
        <Container size="xl" style={{ width: "100%" }} p={isMobile ? 8 : 20}>
          <Title order={1} align="center" mb={"sm"}>
            Thông tin cá nhân
          </Title>
          <Container
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              withPlaceholder
              placeholder={
                <Container
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "300px",
                  }}
                >
                  <Loader variant="dots" />
                </Container>
              }
              style={{ maxWidth: "300px" }}
              radius="md"
              src={getAvatarImageUrl(props.userStudent?.user.avatar)}
              alt="Hình đại diện"
            />
          </Container>
          <Space h={20} />
          <Grid>
            <Grid.Col span={isLargeTablet ? 12 : 5}>
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Họ và tên:{" "}
                </Text>
                <Text color="#444">{props.userStudent?.user.fullName}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Giới tính:{" "}
                </Text>
                <Text color="#444">
                  {getGenderName(props.userStudent?.user.sex)}
                </Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Ngày sinh:{" "}
                </Text>
                <Text color="#444">
                  {moment(props.userStudent?.user.dateOfBirth)
                    .utcOffset(TimeZoneOffset)
                    .format("DD/MM/YYYY")}
                </Text>
              </Group>
            </Grid.Col>
            {!isLargeTablet && <Grid.Col span={2}></Grid.Col>}
            <Grid.Col span={isLargeTablet ? 12 : 5}>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Địa chỉ:{" "}
                </Text>
                <Text color="#444">{props.userStudent?.user.address}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Email:{" "}
                </Text>
                <Text color="#444">{props.userStudent?.user.email || "-"}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Số điện thoại:{" "}
                </Text>
                <Text color="#444">{props.userStudent?.user.phone || "-"}</Text>
              </Group>
            </Grid.Col>
          </Grid>

          <Space h={20} />
          <Container
            p={0}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button onClick={() => router.push("/modify-personal")}>
              Chỉnh sửa
            </Button>
          </Container>
          <Space h={20} />

          <Space h={40} />
          <Text color="#444" weight={700} style={{ fontSize: "1.8rem" }}>
            Thông tin phụ huynh
          </Text>
          <Divider />

          {props.userStudent?.userParent !== null && (
            <Box mt={"sm"}>
              <Grid>
                <Grid.Col span={2}>
                  <Image
                    withPlaceholder
                    placeholder={
                      <Container
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          maxWidth: "150px",
                        }}
                      >
                        <Loader variant="dots" />
                      </Container>
                    }
                    style={{ maxWidth: "150px" }}
                    radius="md"
                    src={getAvatarImageUrl(
                      props.userStudent?.userParent.user.avatar
                    )}
                    alt="Hình đại diện"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Group position="apart">
                    <Text weight={600} color="#444" mr={5}>
                      Họ và tên:{" "}
                    </Text>
                    <Text color="#444">{props.userStudent?.userParent.user.fullName}</Text>
                  </Group>
                  <Space h={10} />
                  <Group position="apart">
                    <Text weight={600} color="#444" mr={5}>
                      Giới tính:{" "}
                    </Text>
                    <Text color="#444">
                      {getGenderName(props.userStudent?.userParent.user.sex)}
                    </Text>
                  </Group>
                  <Space h={10} />
                  <Group position="apart">
                    <Text weight={600} color="#444" mr={5}>
                      Ngày sinh:{" "}
                    </Text>
                    <Text color="#444">
                      {moment(props.userStudent?.userParent.user.dateOfBirth)
                        .utcOffset(TimeZoneOffset)
                        .format("DD/MM/YYYY")}
                    </Text>
                  </Group>
                </Grid.Col>
                <Grid.Col span={2}></Grid.Col>
                <Grid.Col span={4}>
                  <Group position="apart">
                    <Text weight={600} color="#444" mr={5}>
                      Địa chỉ:{" "}
                    </Text>
                    <Text color="#444">{props.userStudent?.userParent.user.address}</Text>
                  </Group>
                  <Space h={10} />
                  <Group position="apart">
                    <Text weight={600} color="#444" mr={5}>
                      Email:{" "}
                    </Text>
                    <Text color="#444">
                      {props.userStudent?.userParent.user.email || "-"}
                    </Text>
                  </Group>
                  <Space h={10} />
                  <Group position="apart">
                    <Text weight={600} color="#444" mr={5}>
                      Số điện thoại:{" "}
                    </Text>
                    <Text color="#444">
                      {props.userStudent?.userParent.user.phone || "-"}
                    </Text>
                  </Group>
                </Grid.Col>
              </Grid>

              <Group position="center">
                <Button
                  color={"red"}
                  leftIcon={<IconTrash size={14} />}
                  mt="md"
                  onClick={() => {
                    setConfirmDeleteParent(true);
                  }}
                >
                  Xóa
                </Button>
              </Group>
            </Box>
          )}

          {props.userStudent.userParent === null && (
            <Box>
              <Group mt={"sm"} grow align={"center"}>
                <Title order={3} color="gray" align="center">
                  Bạn chưa thêm phụ huynh của mình.
                </Title>
              </Group>
              <Space h={10} />
              <Container
                p={0}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={() => {
                    setAddParentModal(true);
                  }}
                >
                  Thêm
                </Button>
              </Container>
            </Box>
          )}

          <Space h={40} />
          <Text color="#444" weight={700} style={{ fontSize: "1.8rem" }}>
            Lịch sử giao dịch
          </Text>
          <Divider />

          {props.payments === null && (
            <Box>
              <Group mt={"sm"} grow align={"center"}>
                <Title order={3} color="gray" align="center">
                  Không có dữ liệu.
                </Title>
              </Group>
            </Box>
          )}

          {props.payments !== null && (
            <Box>
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

          <Space h={40} />
        </Container>
      )}
    </>
  );
};

export default StudentPersonalScreen;

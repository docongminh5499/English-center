import { Button, Container, Modal, ScrollArea, Space, Table, Text, Title } from '@mantine/core';
import moment from "moment";
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../../../../../helpers/api';
import { Url } from '../../../../../../helpers/constants';
import { formatCurrency } from '../../../../../../helpers/formatCurrency';
import UnpaidDto from '../../../../../../models/unpaidFee.model';
import { useAuth } from '../../../../../../stores/Auth';
import Loading from '../../../../../commons/Loading';
import AmountModal from "../../../Modal/amount.modal";

interface IProps {
  title: string;
  loading: boolean;
  data: UnpaidDto[];
  onPayFeeSuccess: () => Promise<void>;
}
const UnpaidFeeInfos = (props: IProps) => {
  const [authState] = useAuth();
  // Remove participate course
  const [current, setCurrent] = useState<UnpaidDto | null>(null);
  const [isSendingPaidFeeRequest, setIsSendingPaidFeeRequest] = useState(false);
  const [isOpenConfirmPaidFeeModal, setIsOpenConfirmPaidFeeModal] = useState(false);

  const onConfirmPayFee = useCallback(async () => {
    try {
      setIsSendingPaidFeeRequest(true);
      const responses: any = await API.post(Url.employees.payFee, {
        token: authState.token,
        courseSlug: current?.course.slug,
        studentId: current?.student.user.id,
        fromDate: current?.fromDate,
        toDate: current?.toDate,
        amount: current?.amount,
      });
      if (responses == true) {
        toast.success("Tác vụ thành công");
      } else toast.error("Tác vụ thất bại. Vui lòng thử lại")
      setIsSendingPaidFeeRequest(false);
      setIsOpenConfirmPaidFeeModal(false);
      await props.onPayFeeSuccess();
    } catch (error: any) {
      setIsSendingPaidFeeRequest(false);
      setIsOpenConfirmPaidFeeModal(false);
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
  }, [authState.token, current]);

  return (
    <div style={{ width: "100%" }} >
      <Title transform="uppercase" color="#444444" size="2.6rem" mt={20} align="left">
        {props.title}
      </Title>

      <Modal
        opened={isOpenConfirmPaidFeeModal}
        onClose={() => setIsOpenConfirmPaidFeeModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <AmountModal
          callBack={onConfirmPayFee}
          amount={current?.amount || 0}
          loading={isSendingPaidFeeRequest}
          message={`Số tiền cần thu ${current?.student.user.fullName} (MSHS: ${current?.student.user.id}) là`}
          title="Đăng ký học viên"
        />
      </Modal>

      <Space h={30} />
      {props.loading && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "150px"
        }}>
          <Loading />
        </Container>
      )}

      {!props.loading && props.data.length === 0 && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "150px"
        }}>
          <Text style={{ fontSize: "2.4rem", color: "#CED4DA" }} weight={600}>
            Không có dữ liệu
          </Text>
        </Container>
      )}

      {!props.loading && props.data.length > 0 && (
        <ScrollArea style={{ width: "100%", flex: 1 }}>
          <Table verticalSpacing="xs" highlightOnHover style={{ width: "100%", minWidth: "600px" }}>
            <thead>
              <tr>
                <th>Tên khóa học</th>
                <th>Khoản tiền</th>
                <th>Ngày</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {props.data.map((fee: UnpaidDto, index: number) => (
                <tr key={index}>
                  <td>{fee.course.name}</td>
                  <td>{formatCurrency(fee.amount)}</td>
                  <td>{moment(fee.fromDate).format("DD/MM/YYYY") + " - " + moment(fee.toDate).format("DD/MM/YYYY")}</td>
                  <td>
                    <Button onClick={() => {
                      setCurrent(fee);
                      setIsOpenConfirmPaidFeeModal(true);
                    }}>
                      Thanh toán
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
      )}
    </div>
  )
}

export default UnpaidFeeInfos
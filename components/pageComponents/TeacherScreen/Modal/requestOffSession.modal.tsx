import { Container, Select, Space, Text, Textarea } from "@mantine/core";
import * as yup from "yup";
import { DatePicker } from "@mantine/dates";
import { useForm, yupResolver } from '@mantine/form';
import 'dayjs/locale/vi';
import Button from "../../../commons/Button";
import UserSelectItem from "../../../commons/UserSelectItem";
import { useCallback, useEffect, useState } from "react";
import UserEmployee from "../../../../models/userEmployee.model";
import { useAuth } from "../../../../stores/Auth";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { Url } from "../../../../helpers/constants";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";



const schema = yup.object().shape({
  employeeId: yup.number().required("Vui lòng chọn nhân viên"),
  excuse: yup.string().required("Vui lòng nhập lý do"),
});



interface IProps {
  onSendRequest: (data: any) => void;
  loading: boolean;
  branchId?: number;
}



const RequestOffSessionModal = (props: IProps) => {
  const [authState] = useAuth();
  const [employees, setEmployees] = useState<UserEmployee[]>([]);
  const requestOffSessionForm = useForm({
    validate: yupResolver(schema),
  });


  const getEmployeeByBranch = useCallback(async () => {
    try {
      const responses = await API.post(Url.teachers.getEmployeeByBranch, {
        token: authState.token,
        branchId: props.branchId
      });
      setEmployees(responses);
    } catch (error) {
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
    }
  }, [authState.token, props.branchId]);


  useEffect(() => {
    getEmployeeByBranch();
  }, []);


  return (
    <Container>
      <Text transform="uppercase" align="center" style={{ fontSize: "2.4rem" }} color="#444" weight={600}>
        Xin nghỉ
      </Text>
      <Space h={10} />
      <form
        onSubmit={requestOffSessionForm.onSubmit((values) => props.onSendRequest(values))}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
        <Select
          withAsterisk
          label="Chọn nhân viên nhận yêu cầu"
          placeholder="Nhân viên"
          itemComponent={UserSelectItem}
          data={employees.map(employee => ({
            avatar: getAvatarImageUrl(employee.worker.user.avatar),
            name: employee.worker.user.fullName,
            label: employee.worker.user.fullName,
            id: employee.worker.user.id,
            value: employee.worker.user.id.toString(),
          }))}
          searchable
          maxDropdownHeight={400}
          nothingFound="Không có nhân viên phù hợp"
          filter={(value, item) =>
            item.name.toLowerCase().includes(value.toLowerCase().trim()) ||
            item.id.toString().toLowerCase().includes(value.toLowerCase().trim())
          }
          {...requestOffSessionForm.getInputProps('employeeId')}
        />
        <Textarea
          withAsterisk
          minRows={6}
          label="Lý do"
          placeholder="Nhập lý do của bạn"
          {...requestOffSessionForm.getInputProps('excuse')}
        />
        <Space h={20} />
        <Button color="pink" type="submit" loading={props.loading}>Gửi yêu cầu</Button>
      </form>
    </Container>
  );
}

export default RequestOffSessionModal;
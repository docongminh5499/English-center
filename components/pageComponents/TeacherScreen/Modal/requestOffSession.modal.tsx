import { Container, Select, Space, Text, Textarea } from "@mantine/core";
import * as yup from "yup";
import { useForm, yupResolver } from '@mantine/form';
import 'dayjs/locale/vi';
import Button from "../../../commons/Button";


const schema = yup.object().shape({
  excuse: yup.string().required("Vui lòng nhập lý do"),
});


interface IProps {
  onSendRequest: (data: any) => void;
  loading: boolean;
}


const RequestOffSessionModal = (props: IProps) => {
  const requestOffSessionForm = useForm({
    initialValues: { excuse: "" },
    validate: yupResolver(schema),
  });


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
        <Textarea
          withAsterisk
          minRows={6}
          label="Lý do"
          placeholder="Nhập lý do của bạn"
          {...requestOffSessionForm.getInputProps('excuse')}
        />
        <Space h={10} />
        <Button color="pink" type="submit" loading={props.loading}>Gửi yêu cầu</Button>
      </form>
    </Container>
  );
}

export default RequestOffSessionModal;
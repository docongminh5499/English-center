import { Container, Space, Text, Textarea } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import Button from "../../../commons/Button";
import * as yup from "yup";


interface IProps {
  onSend: (data: any) => void;
}


const schema = yup.object().shape({
  notification: yup.string().required("Vui lòng nhập nội dung thông báo.")
})


const SendNotificationCourseModal = ({ onSend }: IProps) => {
  const sendNotificationForm = useForm({
    initialValues: {
      notification: '',
    },
    validate: yupResolver(schema),
  });


  return (
    <Container p={0} style={{
      backgroundColor: "white",
      borderRadius: "5px",
      margin: "0 1rem",
    }}>
      <Text color="#444" transform="uppercase" weight={600} style={{ fontSize: "2rem" }} align="center">
        Gửi thông báo
      </Text>
      <Space h={20} />
      <form
        encType='multipart/form-data'
        onSubmit={sendNotificationForm.onSubmit((values) => onSend(values))}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
        <Textarea
          withAsterisk
          placeholder="Nội dung thông báo"
          label="Thông báo"
          minRows={6}
          {...sendNotificationForm.getInputProps('notification')}
        />
        <Space h={20} />
        <Button color="green" type="submit">Gửi thông báo</Button>
      </form>
    </Container>
  );
};

export default SendNotificationCourseModal;

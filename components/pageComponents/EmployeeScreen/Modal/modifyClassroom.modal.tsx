import { Container, Select, Space, Text, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";
import { ClassroomFunction } from "../../../../helpers/constants";
import Classroom from "../../../../models/classroom.model";
import Button from "../../../commons/Button";

interface IProps {
  onSendRequest: (data: any) => void;
  loading: boolean;
  classroom: Classroom | null;
}


const schema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên"),
  capacity: yup.number().nullable()
    .required("Vui lòng nhập sức chứa")
    .integer("Vui lòng nhập sức chứa hợp lệ")
    .positive("Vui lòng nhập sức chứa hợp lệ"),
  function: yup.string()
    .required("Vui lòng chọn chức năng")
    .oneOf([ClassroomFunction.CLASSROOM, ClassroomFunction.MEETING_ROOM, ClassroomFunction.WAREHOUSE_ROOM], "Vui lòng chọn chức năng"),
});


const ModifyClassroomModal = (props: IProps) => {
  const modifyClassroomForm = useForm({
    initialValues: {
      name: props.classroom?.name,
      capacity: props.classroom?.capacity,
      function: props.classroom?.function
    },
    validate: yupResolver(schema),
  });


  return (
    <Container>
      <Text transform="uppercase" align="center" style={{ fontSize: "2.4rem" }} color="#444" weight={600}>
        Chỉnh sửa phòng học
      </Text>
      <Space h={10} />
      <form
        onSubmit={modifyClassroomForm.onSubmit((values) => props.onSendRequest(values))}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Tên phòng học"
          label="Tên phòng học"
          withAsterisk
          {...modifyClassroomForm.getInputProps('name')}
        />
        <TextInput
          type="number"
          style={{ flex: 1 }}
          placeholder="Sức chứa"
          label="Sức chứa"
          withAsterisk
          {...modifyClassroomForm.getInputProps('capacity')}
        />
        <Select
          withAsterisk
          label="Chọn chức năng"
          placeholder="Chức năng"
          data={[
            ClassroomFunction.CLASSROOM,
            ClassroomFunction.MEETING_ROOM,
            ClassroomFunction.WAREHOUSE_ROOM
          ]}
          {...modifyClassroomForm.getInputProps('function')}
        />
        <Space h={20} />
        <Button type="submit" loading={props.loading}>Lưu thông tin</Button>
      </form>
    </Container>
  );
}


export default ModifyClassroomModal;
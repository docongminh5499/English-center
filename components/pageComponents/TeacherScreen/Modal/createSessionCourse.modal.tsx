import { Container, Select, Space, Text } from "@mantine/core";
import * as yup from "yup";
import { DatePicker } from "@mantine/dates";
import { useForm, yupResolver } from '@mantine/form';
import 'dayjs/locale/vi';
import Button from "../../../commons/Button";
import TutorSelectItem from "../../../commons/TutorSelectItem";



const data = [
  {
    avatar: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
    name: 'Nguyễn Văn A',
    label: 'Nguyễn Văn A',
    tutorId: 1,
    value: 1,
  },
  {
    avatar: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
    name: 'Nguyễn Văn B',
    label: 'Nguyễn Văn B',
    tutorId: 2,
    value: 2,
  },
  {
    avatar: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
    name: 'Nguyễn Văn C',
    label: 'Nguyễn Văn C',
    tutorId: 3,
    value: 3,
  },
  {
    avatar: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
    name: 'Nguyễn Văn D',
    label: 'Nguyễn Văn D',
    tutorId: 4,
    value: 4,
  },
];



const schema = yup.object().shape({
  curriculumId: yup.number().required("Vui lòng chọn bài học"),
  sessionDate: yup.date().required("Vui lòng chọn ngày học"),
  startShiftId: yup.number().required("Vui lòng chọn ca học bắt đầu"),
  endShiftId: yup.number().required("Vui lòng chọn ca học kết thúc"),
  tutorId: yup.number().required("Vui lòng chọn trợ giảng")
});



interface IProps {
  onCreate: (data: any) => void
}



const CreateSessionCourseModal = (props: IProps) => {
  const createSessionForm = useForm({
    validate: yupResolver(schema),
  });

  return (
    <Container>
      <Text transform="uppercase" align="center" style={{ fontSize: "2.4rem" }} color="#444" weight={600}>
        Tạo buổi học mới
      </Text>
      <Space h={10} />
      <form
        onSubmit={createSessionForm.onSubmit((values) => props.onCreate(values))}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
        <Select
          withAsterisk
          label="Chọn bài học"
          placeholder="Bài học"
          data={[
            { value: 1, label: 'Bài 1: Family' },
            { value: 2, label: 'Bài 2: Work' },
            { value: 3, label: 'Bài 3: Hobbies' },
            { value: 4, label: 'Bài 4: Entertainment' },
          ]}
          {...createSessionForm.getInputProps('curriculumId')}
        />
        <DatePicker
          locale="vi"
          withAsterisk
          placeholder="Ngày học"
          label="Chọn ngày học"
          {...createSessionForm.getInputProps('sessionDate')}
        />

        <Select
          withAsterisk
          label="Chọn ca bắt đầu"
          placeholder="Ca bắt đầu"
          data={[
            { value: 1, label: '7:00' },
            { value: 2, label: '8:00' },
            { value: 3, label: '9:00' },
            { value: 4, label: '10:00' },
          ]}
          {...createSessionForm.getInputProps('startShiftId')}
        />

        <Select
          withAsterisk
          label="Chọn ca kết thúc"
          placeholder="Ca kết thúc"
          data={[
            { value: 1, label: '7:00' },
            { value: 2, label: '8:00' },
            { value: 3, label: '9:00' },
            { value: 4, label: '10:00' },
          ]}
          {...createSessionForm.getInputProps('endShiftId')}
        />

        <Select
          withAsterisk
          label="Chọn trợ giảng"
          placeholder="Trợ giảng"
          itemComponent={TutorSelectItem}
          data={data}
          searchable
          maxDropdownHeight={400}
          nothingFound="Không có trợ giảng phù hợp"
          filter={(value, item) =>
            item.name.toLowerCase().includes(value.toLowerCase().trim()) ||
            item.tutorId.toString().toLowerCase().includes(value.toLowerCase().trim())
          }
          {...createSessionForm.getInputProps('tutorId')}
        />

        <Space h={20} />

        <Button type="submit">Tạo buổi học</Button>
      </form>
    </Container>
  );
}

export default CreateSessionCourseModal;
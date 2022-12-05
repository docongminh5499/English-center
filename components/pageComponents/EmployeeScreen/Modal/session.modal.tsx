import { Avatar, Button, Container, Group, Input, Space, Text, Title } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import moment from "moment";
import { useCallback, useState } from "react";
import * as yup from "yup";
import { getWeekdayName } from "../../../../helpers/getWeekdayName";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";
import Classroom from "../../../../models/classroom.model";
import Shift from "../../../../models/shift.model";
import UserTutor from "../../../../models/userTutor.model";
import SearchClassroomForm from "../Form/searchClassroomForm";
import SearchTutorForm from "../Form/searchTutorForm";



const schema = yup.object().shape({
  tutor: yup.object().nullable().required("Vui lòng chọn trợ giảng"),
  classroom: yup.object().nullable().required("Vui lòng chọn phòng học"),
});



interface IProps {
  shifts: Shift[];
  beginingDate: Date;
  branchId: number;
  onSubmit: (data: any) => void;
  maximumStudentNumber: number;
  closingDate?: Date;
  courseSlug?: string;
}

const StudySessionModal = (props: IProps) => {
  const [isOpenTutorForm, setIsOpenTutorForm] = useState(false);
  const [isOpenClassroomForm, setIsOpenClassroomForm] = useState(false);

  const createSessionForm = useForm({
    initialValues: {
      classroom: null,
      tutor: null,
    },
    validate: yupResolver(schema),
  });



  const onChooseTutor = useCallback((tutor: UserTutor) => {
    setIsOpenTutorForm(false);
    createSessionForm.setFieldValue('tutor', tutor as any);
  }, []);



  const onChooseClassroom = useCallback((classroom: Classroom) => {
    setIsOpenClassroomForm(false);
    createSessionForm.setFieldValue('classroom', classroom as any);
  }, []);



  const onChangeClassroom = useCallback(() => {
    setIsOpenClassroomForm(true);
    setIsOpenTutorForm(false);
  }, []);



  const onChangeTutor = useCallback(() => {
    setIsOpenClassroomForm(false);
    setIsOpenTutorForm(true);
  }, []);



  return (
    <Container p={0} style={{
      backgroundColor: "white",
      borderRadius: "5px",
    }}>
      <Title align="center" size="1.8rem" color="#444" transform="uppercase" mb={20}>
        Tạo lịch học
      </Title>
      <Group grow>
        <Input disabled value={getWeekdayName(props.shifts[0].weekDay)} />
        <Input disabled value={moment(props.shifts[0].startTime).format("HH:mm") + " - " + moment(props.shifts[props.shifts.length - 1].endTime).format("HH:mm")} />
      </Group>

      <Container size="xl" style={{ width: "100%" }} p={0} my={10}>
        <Text weight={600} style={{ fontSize: "14px" }}>
          Trợ giảng <Text component="span" color='red'>*</Text>
        </Text>
        {createSessionForm.values['tutor'] === null
          ? <Text>Chưa chọn trợ giảng
            <Button ml={10} compact variant="light" onClick={onChangeTutor}>Thay đổi</Button>
          </Text>
          : (<Group mt={10} style={{ border: "1px solid #CED4DA", borderRadius: 5 }} p={10} >
            <Avatar
              size={30}
              color="blue"
              radius='xl'
              src={getAvatarImageUrl((createSessionForm.values['tutor'] as UserTutor).worker.user.avatar)}
            />
            <Container style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start"
            }} p={0}>
              <Text style={{ fontSize: "1.2rem" }} weight={500} color="#444" align="center">
                {(createSessionForm.values['tutor'] as UserTutor).worker.user.fullName}
              </Text>
              <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">MSTG: {(createSessionForm.values['tutor'] as UserTutor).worker.user.id}</Text>
            </Container>
            <Button ml={10} compact variant="light" onClick={onChangeTutor}>Thay đổi</Button>
          </Group>
          )}
        {createSessionForm.errors['tutor'] && (
          <Text color="red" style={{ fontSize: "12px" }}>
            {createSessionForm.errors['tutor']}
          </Text>
        )}
      </Container>


      <Container size="xl" style={{ width: "100%" }} p={0} my={10}>
        <Text weight={600} style={{ fontSize: "14px" }}>
          Phòng học <Text component="span" color='red'>*</Text>
        </Text>
        {createSessionForm.values['classroom'] === null
          ? <Text>Chưa chọn phòng học
            <Button ml={10} compact variant="light" onClick={onChangeClassroom}>Thay đổi</Button>
          </Text>
          : (<Group style={{ border: "1px solid #CED4DA", borderRadius: 5 }} p={10} mt={5}>
            <Container style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              flex: 1
            }} p={0}>
              <Text style={{ fontSize: "1.2rem" }}>Phòng {(createSessionForm.values['classroom'] as Classroom).name} </Text>
              <Text color="dimmed" style={{ fontSize: "1rem" }}>Sức chứa {(createSessionForm.values['classroom'] as Classroom).capacity} </Text>
            </Container>
            <Button ml={10} compact variant="light" onClick={onChangeClassroom}>Thay đổi</Button>
          </Group>
          )}
        {createSessionForm.errors['classroom'] && (
          <Text color="red" style={{ fontSize: "12px" }}>
            {createSessionForm.errors['classroom']}
          </Text>
        )}
      </Container>

      {isOpenTutorForm && (
        <SearchTutorForm
          branchId={props.branchId}
          beginingDate={props.beginingDate}
          shiftIds={props.shifts.map(shift => shift.id)}
          onChooseTutor={onChooseTutor}
          closingDate={props.closingDate}
          courseSlug={props.courseSlug}
        />
      )}

      {isOpenClassroomForm && (
        <SearchClassroomForm
          branchId={props.branchId}
          beginingDate={props.beginingDate}
          shiftIds={props.shifts.map(shift => shift.id)}
          onChooseClassroom={onChooseClassroom}
          closingDate={props.closingDate}
          courseSlug={props.courseSlug}
        />
      )}

      <Space h={20} />
      <Container style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <Button color="green" onClick={() => {
          createSessionForm.validate();
          if (createSessionForm.isValid()) {
            const classroom = createSessionForm.values.classroom as any;
            if (classroom.capacity < props.maximumStudentNumber)
              return createSessionForm.setFieldError("classroom", "Sức chứa phòng học không đủ. Vui lòng thay đổi phòng học khác.");
            props.onSubmit(createSessionForm.values);
          }
        }}>Chọn khung giờ</Button>
      </Container>

    </Container>
  );
};

export default StudySessionModal;

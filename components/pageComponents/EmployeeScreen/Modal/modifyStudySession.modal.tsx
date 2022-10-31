import { Avatar, Button, Container, Group, Select, Space, Text, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, yupResolver } from "@mantine/form";
import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import StudySession from "../../../../models/studySession.model";
import 'dayjs/locale/vi';
import API from "../../../../helpers/api";
import { Url } from "../../../../helpers/constants";
import { useAuth } from "../../../../stores/Auth";
import Shift from "../../../../models/shift.model";
import moment from "moment";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";
import SearchTutorFormModifySession from "../Form/searchTutorFormModifySession";
import UserTutor from "../../../../models/userTutor.model";
import Classroom from "../../../../models/classroom.model";
import UserTeacher from "../../../../models/userTeacher.model";
import SearchTeacherFormModifySession from "../Form/searchTeacherFormModifySession";
import SearchClassroomFormModifySession from "../Form/searchClassroomFormModifySession";
import Curriculum from "../../../../models/cirriculum.model";

const schema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên"),
  date: yup.date().nullable().required("Vui lòng chọn ngày học"),
  shiftLabelValue: yup.number().nullable().required("Vui lòng chọn ca học"),
  tutorId: yup.number().nullable().required("Vui lòng chọn trợ giảng"),
  teacherId: yup.number().nullable().required("Vui lòng chọn giáo viên"),
  classroom: yup.object().nullable().required("Vui lòng chọn phòng học"),
});


interface IProps {
  onSendRequest: (data: any) => void;
  loading: boolean;
  studySession?: StudySession;
  shiftsPerSession?: number;
  curriculum?: Curriculum;
}


interface ShiftLabel {
  value: number;
  label: string;
  shifts: Shift[];
}


const ModifyStudySessionModal = (props: IProps) => {
  const modifyStudySessionForm = useForm({
    initialValues: {
      name: props.studySession?.name,
      date: new Date(props.studySession?.date || Date.now()),
      shiftLabelValue: null as number | null,
      tutorId: props.studySession?.tutor.worker.user.id,
      teacherId: props.studySession?.teacher.worker.user.id,
      classroom: {
        name: props.studySession?.classroom.name,
        branchId: props.studySession?.classroom.branch.id,
      }
    },
    validate: yupResolver(schema),
  });
  const [authState] = useAuth();
  const [tutor, setTutor] = useState(props.studySession?.tutor);
  const [teacher, setTeacher] = useState(props.studySession?.teacher);
  const [classroom, setClassroom] = useState(props.studySession?.classroom);
  const [shiftLabels, setShiftLabels] = useState<ShiftLabel[]>([]);
  const [firstRequest, setFirstRequest] = useState(true);
  const [isOpenTeacherForm, setIsOpenTeacherForm] = useState(false);
  const [isOpenTutorForm, setIsOpenTutorForm] = useState(false);
  const [isOpenClassroomForm, setIsOpenClassroomForm] = useState(false);

  const getShiftByDate = useCallback(async (date: Date) => {
    try {
      const responses = await API.post(Url.employees.getShifts, {
        token: authState.token,
        date: date,
      });
      const shiftLabels = [] as ShiftLabel[];
      responses.forEach((shift: Shift, index: number) => {
        const shiftsPerSession = props.shiftsPerSession || 0;
        if (index + shiftsPerSession > responses.length) return;
        const shifts = responses.slice(index, index + shiftsPerSession);
        const shiftLabel = {
          value: index,
          label: moment(shifts[0].startTime).format("HH:mm") + "-" + moment(shifts[shifts.length - 1].endTime).format("HH:mm"),
          shifts: shifts,
        };
        if (firstRequest && shifts[0].id === props.studySession?.shifts[0].id)
          modifyStudySessionForm.setFieldValue("shiftLabelValue", index);
        shiftLabels.push(shiftLabel);
      });
      setShiftLabels(shiftLabels);
    } catch (error) {
      console.log(error);
    }
  }, [authState.token, props.shiftsPerSession, firstRequest]);



  const onSendRequest = useCallback((data: any) => {
    const shiftLabel = shiftLabels.find(label => label.value === data.shiftLabelValue);
    if (shiftLabel === undefined)
      return modifyStudySessionForm.setFieldError("shiftLabelValue", "Vui lòng chọn ca học");
    const shifts = shiftLabel.shifts;
    // const endTime = new Date(shifts[shifts.length - 1].endTime);
    // const current = new Date
    // endTime.setFullYear(data.date.getFullYear());
    // endTime.setMonth(data.date.getMonth());
    // endTime.setDate(data.date.getDate());
    // if (endTime.getTime() <= current.getTime())
    //   return modifyStudySessionForm.setFieldError("shiftLabelValue", "Ngày giờ của buổi học đã quá hạn, vui lòng chọn lại");
    data.shiftIds = shifts.map(shift => shift.id);
    props.onSendRequest(data);
  }, [props.onSendRequest, shiftLabels, modifyStudySessionForm]);


  const onChooseTeacher = useCallback((teacher: UserTeacher) => {
    setIsOpenTeacherForm(false);
    setTeacher(teacher);
    modifyStudySessionForm.setFieldValue('teacherId', teacher.worker.user.id);
  }, []);


  const onChooseTutor = useCallback((tutor: UserTutor) => {
    setIsOpenTutorForm(false);
    setTutor(tutor);
    modifyStudySessionForm.setFieldValue('tutorId', tutor.worker.user.id);
  }, []);



  const onChooseClassroom = useCallback((classroom: Classroom) => {
    setIsOpenClassroomForm(false);
    setClassroom(classroom);
    modifyStudySessionForm.setFieldValue('classroom', {
      name: classroom.name,
      branchId: classroom.branch.id,
    });
  }, []);


  const onChangeClassroom = useCallback(() => {
    setIsOpenClassroomForm(true);
    setIsOpenTutorForm(false);
    setIsOpenTeacherForm(false);
  }, []);



  const onChangeTutor = useCallback(() => {
    setIsOpenClassroomForm(false);
    setIsOpenTutorForm(true);
    setIsOpenTeacherForm(false);
  }, []);


  const onChangeTeacher = useCallback(() => {
    setIsOpenClassroomForm(false);
    setIsOpenTutorForm(false);
    setIsOpenTeacherForm(true);
  }, []);



  useEffect(() => {
    if (!firstRequest) {
      modifyStudySessionForm.setFieldValue("tutorId", null as any);
      modifyStudySessionForm.setFieldValue("teacherId", null as any);
      modifyStudySessionForm.setFieldValue("classroom", null as any);
    }
    firstRequest && modifyStudySessionForm.values.shiftLabelValue !== null && setFirstRequest(false);
  }, [modifyStudySessionForm.values.shiftLabelValue])



  useEffect(() => {
    modifyStudySessionForm.setFieldValue("shiftLabelValue", null);
    setShiftLabels([]);
    if (modifyStudySessionForm.values.date !== null)
      getShiftByDate(modifyStudySessionForm.values.date);
  }, [modifyStudySessionForm.values.date?.getTime()]);



  return (
    <Container>
      <Text transform="uppercase" align="center" style={{ fontSize: "2.4rem" }} color="#444" weight={600}>
        Thay đổi buổi học
      </Text>
      <Space h={10} />
      <form
        onSubmit={modifyStudySessionForm.onSubmit((values) => onSendRequest(values))}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Tên buổi học"
          label="Tên buổi học"
          withAsterisk
          {...modifyStudySessionForm.getInputProps('name')}
        />
        <DatePicker
          withAsterisk
          placeholder="Ngày diễn ra"
          label="Ngày diễn ra"
          locale="vi"
          {...modifyStudySessionForm.getInputProps('date')}
        />
        <Select
          withAsterisk
          label="Chọn ca học"
          placeholder="Ca học"
          data={shiftLabels}
          nothingFound="Vui lòng chọn ngày diễn ra buổi học trước"
          {...modifyStudySessionForm.getInputProps('shiftLabelValue')}
        />

        <Container size="xl" style={{ width: "100%" }} p={0}>
          <Text weight={600} style={{ fontSize: "14px" }}>
            Giáo viên <Text component="span" color='red'>*</Text>
          </Text>
          {modifyStudySessionForm.values['teacherId'] === null
            ? <Text>Chưa chọn giáo viên
              <Button ml={10} compact variant="light" onClick={onChangeTeacher}>Thay đổi</Button>
            </Text>
            : (<Group style={{ border: "1px solid #CED4DA", borderRadius: 5 }} p={10} >
              <Avatar
                size={30}
                color="blue"
                radius='xl'
                src={getAvatarImageUrl(teacher?.worker.user.avatar)}
              />
              <Container style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start"
              }} p={0}>
                <Text style={{ fontSize: "1.2rem" }} weight={500} color="#444" align="center">
                  {teacher?.worker.user.fullName}
                </Text>
                <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">MSGV: {teacher?.worker.user.id}</Text>
              </Container>
              <Button ml={10} compact variant="light" onClick={onChangeTeacher}>Thay đổi</Button>
            </Group>
            )}
          {modifyStudySessionForm.errors['teacherId'] && (
            <Text color="red" style={{ fontSize: "12px" }}>
              {modifyStudySessionForm.errors['teacherId']}
            </Text>
          )}
        </Container>

        <Container size="xl" style={{ width: "100%" }} p={0}>
          <Text weight={600} style={{ fontSize: "14px" }}>
            Trợ giảng <Text component="span" color='red'>*</Text>
          </Text>
          {modifyStudySessionForm.values['tutorId'] === null
            ? <Text>Chưa chọn trợ giảng
              <Button ml={10} compact variant="light" onClick={onChangeTutor}>Thay đổi</Button>
            </Text>
            : (<Group style={{ border: "1px solid #CED4DA", borderRadius: 5 }} p={10} >
              <Avatar
                size={30}
                color="blue"
                radius='xl'
                src={getAvatarImageUrl(tutor?.worker.user.avatar)}
              />
              <Container style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start"
              }} p={0}>
                <Text style={{ fontSize: "1.2rem" }} weight={500} color="#444" align="center">
                  {tutor?.worker.user.fullName}
                </Text>
                <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">MSTG: {tutor?.worker.user.id}</Text>
              </Container>
              <Button ml={10} compact variant="light" onClick={onChangeTutor}>Thay đổi</Button>
            </Group>
            )}
          {modifyStudySessionForm.errors['tutorId'] && (
            <Text color="red" style={{ fontSize: "12px" }}>
              {modifyStudySessionForm.errors['tutorId']}
            </Text>
          )}
        </Container>


        <Container size="xl" style={{ width: "100%" }} p={0}>
          <Text weight={600} style={{ fontSize: "14px" }}>
            Phòng học <Text component="span" color='red'>*</Text>
          </Text>
          {modifyStudySessionForm.values['classroom'] === null
            ? <Text>Chưa chọn phòng học
              <Button ml={10} compact variant="light" onClick={onChangeClassroom}>Thay đổi</Button>
            </Text>
            : (<Group style={{ border: "1px solid #CED4DA", borderRadius: 5 }} p={10}>
              <Container style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                flex: 1
              }} p={0}>
                <Text style={{ fontSize: "1.2rem" }}>Phòng {classroom?.name} </Text>
                <Text color="dimmed" style={{ fontSize: "1rem" }}>Sức chứa {classroom?.capacity} </Text>
              </Container>
              <Button ml={10} compact variant="light" onClick={onChangeClassroom}>Thay đổi</Button>
            </Group>
            )}
          {modifyStudySessionForm.errors['classroom'] && (
            <Text color="red" style={{ fontSize: "12px" }}>
              {modifyStudySessionForm.errors['classroom']}
            </Text>
          )}
        </Container>

        {isOpenTeacherForm && (
          <SearchTeacherFormModifySession
            branchId={props.studySession?.classroom.branch.id || 0}
            date={modifyStudySessionForm.values.date}
            shiftIds={(shiftLabels.find(label =>
              label.value === modifyStudySessionForm.values.shiftLabelValue)?.shifts || [])
              .map(shift => shift.id)}
            onChooseTeacher={onChooseTeacher}
            studySessionId={props.studySession?.id}
            curriculumId={props.curriculum?.id}
          />
        )}

        {isOpenTutorForm && (
          <SearchTutorFormModifySession
            branchId={props.studySession?.classroom.branch.id || 0}
            date={modifyStudySessionForm.values.date}
            shiftIds={(shiftLabels.find(label =>
              label.value === modifyStudySessionForm.values.shiftLabelValue)?.shifts || [])
              .map(shift => shift.id)}
            onChooseTutor={onChooseTutor}
            studySessionId={props.studySession?.id}
          />
        )}

        {isOpenClassroomForm && (
          <SearchClassroomFormModifySession
            branchId={props.studySession?.classroom.branch.id || 0}
            date={modifyStudySessionForm.values.date}
            shiftIds={(shiftLabels.find(label =>
              label.value === modifyStudySessionForm.values.shiftLabelValue)?.shifts || [])
              .map(shift => shift.id)}
            onChooseClassroom={onChooseClassroom}
            studySessionId={props.studySession?.id}
          />
        )}

        <Space h={20} />
        <Button type="submit" loading={props.loading}>Lưu thông tin</Button>
      </form>
    </Container>
  );
}


export default ModifyStudySessionModal;
import { Avatar, Button, Container, Group, Loader, Select, Space, Text, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, yupResolver } from "@mantine/form";
import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import 'dayjs/locale/vi';
import API from "../../../../helpers/api";
import { Url } from "../../../../helpers/constants";
import { useAuth } from "../../../../stores/Auth";
import Shift from "../../../../models/shift.model";
import moment from "moment";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";
import UserTutor from "../../../../models/userTutor.model";
import Classroom from "../../../../models/classroom.model";
import UserTeacher from "../../../../models/userTeacher.model";
import Curriculum from "../../../../models/cirriculum.model";
import SearchTeacherFormCreateSession from "../Form/searchTeacherFormCreateSession";
import SearchTutorFormCreateSession from "../Form/searchTutorFormCreateSession";
import SearchClassroomFormCreateSession from "../Form/searchClassroomFormCreateSession";
import { toast } from "react-toastify";

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
  shiftsPerSession?: number;
  curriculum?: Curriculum;
  courseSlug?: string;
  branchId?: number;
  openingDate?: Date;
  maximumStudentNumber?: number;
}


interface ShiftLabel {
  value: number;
  label: string;
  shifts: Shift[];
}


function getMininumValidDate(startDate?: Date) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0);
  tomorrow.setMinutes(0);
  tomorrow.setSeconds(0);
  if (startDate) {
    const openingDate = new Date(startDate);
    return openingDate.getTime() > tomorrow.getTime() ? openingDate : tomorrow;
  } else return tomorrow;
}


const CreateStudySessionModal = (props: IProps) => {
  const createStudySessionForm = useForm({
    initialValues: {
      name: "",
      date: getMininumValidDate(props.openingDate),
      shiftLabelValue: null as number | null,
      tutorId: null as number | null,
      teacherId: null as number | null,
      classroom: null as { name: string, branchId: number } | null,
    },
    validate: yupResolver(schema),
  });
  const [authState] = useAuth();
  const [tutor, setTutor] = useState<UserTutor | null>(null);
  const [teacher, setTeacher] = useState<UserTeacher | null>(null);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [shiftLabels, setShiftLabels] = useState<ShiftLabel[]>([]);
  const [isOpenTeacherForm, setIsOpenTeacherForm] = useState(false);
  const [isOpenTutorForm, setIsOpenTutorForm] = useState(false);
  const [isOpenClassroomForm, setIsOpenClassroomForm] = useState(false);
  const [isOnSendGetAvaiableStudentCount, setIsOnSendGetAvailableCount] = useState(false);
  const [isOnSendGetShifts, setIsOnSendGetShifts] = useState(false);
  const [freeStudentPercentage, setFreeStudentPercentage] = useState(-1);
  const [acceptedPercentage, setAcceptedPercentage] = useState(0);
  const [freeStudentError, setFreeStudentError] = useState("");

  const getShiftByDate = useCallback(async (date: Date) => {
    try {
      setIsOnSendGetShifts(true);
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
        shiftLabels.push(shiftLabel);
      });
      setShiftLabels(shiftLabels);
      setIsOnSendGetShifts(false);
    } catch (error) {
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
      setIsOnSendGetShifts(false);
    }
  }, [authState.token, props.shiftsPerSession]);



  const onGetAvailableStudentCount = useCallback(
    async (date: Date, courseSlug: string, shiftIds: number[]) => {
      try {
        setIsOnSendGetAvailableCount(true);
        const responses = await API.post(Url.employees.getAvailableStudentCount, {
          token: authState.token,
          date: date,
          courseSlug: courseSlug,
          shiftIds: shiftIds,
        });
        const percentage = responses.total === 0 ? 100 : Math.round(responses.free / responses.total * 1000) / 10;
        setFreeStudentPercentage(percentage);
        setAcceptedPercentage(responses.acceptedPercent);
        setIsOnSendGetAvailableCount(false);
      } catch (error) {
        setIsOnSendGetAvailableCount(false);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
      }
    }, [authState.token]);



  const onSendRequest = useCallback((data: any) => {
    const shiftLabel = shiftLabels.find(label => label.value === data.shiftLabelValue);
    if (shiftLabel === undefined)
      return createStudySessionForm.setFieldError("shiftLabelValue", "Vui lòng chọn ca học");
    if (freeStudentPercentage < acceptedPercentage)
      return setFreeStudentError(`Vui lòng chọn giờ học có hơn ${acceptedPercentage}% học sinh có thể tham gia.`)
    if (props.openingDate) {
      const openingDate = new Date(props.openingDate);
      openingDate.setHours(0);
      openingDate.setMinutes(0);
      openingDate.setSeconds(0);
      openingDate.setMilliseconds(0);
      if (openingDate.getTime() > data.date.getTime())
        return createStudySessionForm.setFieldError("date", "Ngày diễn ra buổi học trước ngày khai giảng, vui lòng chọn lại");
    }
    const shifts = shiftLabel.shifts;
    data.shiftIds = shifts.map(shift => shift.id);
    props.onSendRequest(data);
  }, [props.onSendRequest, shiftLabels, createStudySessionForm, freeStudentPercentage, acceptedPercentage, props.openingDate]);


  const onChooseTeacher = useCallback((teacher: UserTeacher) => {
    setIsOpenTeacherForm(false);
    setTeacher(teacher);
    createStudySessionForm.setFieldValue('teacherId', teacher.worker.user.id);
  }, []);


  const onChooseTutor = useCallback((tutor: UserTutor) => {
    setIsOpenTutorForm(false);
    setTutor(tutor);
    createStudySessionForm.setFieldValue('tutorId', tutor.worker.user.id);
  }, []);



  const onChooseClassroom = useCallback((classroom: Classroom) => {
    setIsOpenClassroomForm(false);
    setClassroom(classroom);
    createStudySessionForm.setFieldValue('classroom', {
      name: classroom.name,
      branchId: classroom.branch.id,
    });
  }, []);


  const onChangeClassroom = useCallback(() => {
    if (createStudySessionForm.values.shiftLabelValue !== null) {
      setIsOpenClassroomForm(true);
      setIsOpenTutorForm(false);
      setIsOpenTeacherForm(false);
    } else createStudySessionForm.setFieldError("classroom", "Vui lòng chọn ca học trước");
  }, [createStudySessionForm, createStudySessionForm.values.shiftLabelValue]);



  const onChangeTutor = useCallback(() => {
    if (createStudySessionForm.values.shiftLabelValue !== null) {
      setIsOpenClassroomForm(false);
      setIsOpenTutorForm(true);
      setIsOpenTeacherForm(false);
    } else createStudySessionForm.setFieldError("tutorId", "Vui lòng chọn ca học trước");
  }, [createStudySessionForm, createStudySessionForm.values.shiftLabelValue]);


  const onChangeTeacher = useCallback(() => {
    if (createStudySessionForm.values.shiftLabelValue !== null) {
      setIsOpenClassroomForm(false);
      setIsOpenTutorForm(false);
      setIsOpenTeacherForm(true);
    } else createStudySessionForm.setFieldError("teacherId", "Vui lòng chọn ca học trước");
  }, [createStudySessionForm, createStudySessionForm.values.shiftLabelValue]);



  useEffect(() => {
    createStudySessionForm.setFieldValue("tutorId", null as any);
    createStudySessionForm.setFieldValue("teacherId", null as any);
    createStudySessionForm.setFieldValue("classroom", null as any);
    setIsOpenClassroomForm(false);
    setIsOpenTutorForm(false);
    setIsOpenTeacherForm(false);
    createStudySessionForm.clearFieldError("teacherId");
    createStudySessionForm.clearFieldError("tutorId");
    createStudySessionForm.clearFieldError("classroom");

    if (createStudySessionForm.values.shiftLabelValue !== null) {
      const shiftLabel = shiftLabels.find(label =>
        label.value === createStudySessionForm.values.shiftLabelValue);
      const shifts = shiftLabel?.shifts || [];
      const date = createStudySessionForm.values.date;
      const courseSlug = props.courseSlug || "";
      const shiftIds = shifts.map(shift => shift.id);
      onGetAvailableStudentCount(date, courseSlug, shiftIds);
    } else setFreeStudentPercentage(-1);
    setFreeStudentError("");
  }, [createStudySessionForm.values.shiftLabelValue])



  useEffect(() => {
    createStudySessionForm.setFieldValue("shiftLabelValue", null);
    setShiftLabels([]);
    if (createStudySessionForm.values.date !== null)
      getShiftByDate(createStudySessionForm.values.date);
  }, [createStudySessionForm.values.date?.getTime()]);



  return (
    <Container>
      <Text transform="uppercase" align="center" style={{ fontSize: "2.4rem" }} color="#444" weight={600}>
        Thêm buổi học
      </Text>
      <Space h={10} />
      <form
        onSubmit={createStudySessionForm.onSubmit((values) => {
          if (props.maximumStudentNumber && classroom &&
            props.maximumStudentNumber > classroom.capacity)
            return createStudySessionForm.setFieldError("classroom", "Sức chứa phòng học không đủ. Vui lòng thay đổi phòng học khác.");
          onSendRequest(values);
        })}
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
          {...createStudySessionForm.getInputProps('name')}
        />
        <Group grow>
          <Container p={0}>
            <DatePicker
              withAsterisk
              placeholder="Ngày diễn ra"
              label="Ngày diễn ra"
              locale="vi"
              minDate={props.openingDate ? new Date(props.openingDate) : undefined}
              {...createStudySessionForm.getInputProps('date')}
            />
            <Select
              withAsterisk
              label="Chọn ca học"
              placeholder="Ca học"
              data={shiftLabels}
              nothingFound={
                isOnSendGetShifts ?
                  <Loader variant="dots" my={20} /> :
                  "Vui lòng chọn ngày diễn ra buổi học trước"
              }
              {...createStudySessionForm.getInputProps('shiftLabelValue')}
            />
          </Container>
          <Container p={0} style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%"
          }}>
            <Text align="center" color="#444" style={{ fontSize: "1.1rem" }}>
              Số lượng học viên có thể tham gia giờ học
            </Text>
            {isOnSendGetAvaiableStudentCount ? (
              <Loader variant="dots" mt={20} />
            ) : freeStudentPercentage < 0 ? (
              <Text
                align="center"
                weight={600}
                style={{ fontSize: "2.6rem" }}
                color="#444">
                ____
              </Text>
            ) : (
              <Text
                align="center"
                weight={600}
                style={{ fontSize: "2.6rem" }}
                color={freeStudentPercentage >= acceptedPercentage ? "green" : "red"}>
                {freeStudentPercentage}%
              </Text>
            )}
            {freeStudentError.length > 0 && (
              <Text color="red" align="center" style={{ fontSize: "1.1rem" }}>{freeStudentError}</Text>
            )}
          </Container>
        </Group>

        <Container size="xl" style={{ width: "100%" }} p={0}>
          <Text weight={600} style={{ fontSize: "14px" }}>
            Giáo viên <Text component="span" color='red'>*</Text>
          </Text>
          {createStudySessionForm.values['teacherId'] === null
            ? <Text>Chưa chọn giáo viên
              <Button ml={10} compact variant="light" onClick={onChangeTeacher} disabled={isOnSendGetAvaiableStudentCount}>Thay đổi</Button>
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
              <Button ml={10} compact variant="light" onClick={onChangeTeacher} disabled={isOnSendGetAvaiableStudentCount}>Thay đổi</Button>
            </Group>
            )}
          {createStudySessionForm.errors['teacherId'] && (
            <Text color="red" style={{ fontSize: "12px" }}>
              {createStudySessionForm.errors['teacherId']}
            </Text>
          )}
        </Container>

        <Container size="xl" style={{ width: "100%" }} p={0}>
          <Text weight={600} style={{ fontSize: "14px" }}>
            Trợ giảng <Text component="span" color='red'>*</Text>
          </Text>
          {createStudySessionForm.values['tutorId'] === null
            ? <Text>Chưa chọn trợ giảng
              <Button ml={10} compact variant="light" onClick={onChangeTutor} disabled={isOnSendGetAvaiableStudentCount}>Thay đổi</Button>
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
              <Button ml={10} compact variant="light" onClick={onChangeTutor} disabled={isOnSendGetAvaiableStudentCount}>Thay đổi</Button>
            </Group>
            )}
          {createStudySessionForm.errors['tutorId'] && (
            <Text color="red" style={{ fontSize: "12px" }}>
              {createStudySessionForm.errors['tutorId']}
            </Text>
          )}
        </Container>


        <Container size="xl" style={{ width: "100%" }} p={0}>
          <Text weight={600} style={{ fontSize: "14px" }}>
            Phòng học <Text component="span" color='red'>*</Text>
          </Text>
          {createStudySessionForm.values['classroom'] === null
            ? <Text>Chưa chọn phòng học
              <Button ml={10} compact variant="light" onClick={onChangeClassroom} disabled={isOnSendGetAvaiableStudentCount}>Thay đổi</Button>
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
              <Button ml={10} compact variant="light" onClick={onChangeClassroom} disabled={isOnSendGetAvaiableStudentCount}>Thay đổi</Button>
            </Group>
            )}
          {createStudySessionForm.errors['classroom'] && (
            <Text color="red" style={{ fontSize: "12px" }}>
              {createStudySessionForm.errors['classroom']}
            </Text>
          )}
        </Container>

        {isOpenTeacherForm && (
          <SearchTeacherFormCreateSession
            branchId={props.branchId || 0}
            date={createStudySessionForm.values.date}
            shiftIds={(shiftLabels.find(label =>
              label.value === createStudySessionForm.values.shiftLabelValue)?.shifts || [])
              .map(shift => shift.id)}
            onChooseTeacher={onChooseTeacher}
            curriculumId={props.curriculum?.id}
          />
        )}

        {isOpenTutorForm && (
          <SearchTutorFormCreateSession
            branchId={props.branchId || 0}
            date={createStudySessionForm.values.date}
            shiftIds={(shiftLabels.find(label =>
              label.value === createStudySessionForm.values.shiftLabelValue)?.shifts || [])
              .map(shift => shift.id)}
            onChooseTutor={onChooseTutor}
          />
        )}

        {isOpenClassroomForm && (
          <SearchClassroomFormCreateSession
            branchId={props.branchId || 0}
            date={createStudySessionForm.values.date}
            shiftIds={(shiftLabels.find(label =>
              label.value === createStudySessionForm.values.shiftLabelValue)?.shifts || [])
              .map(shift => shift.id)}
            onChooseClassroom={onChooseClassroom}
          />
        )}

        <Space h={20} />
        <Button type="submit" loading={props.loading} disabled={isOnSendGetAvaiableStudentCount}>Lưu thông tin</Button>
      </form>
    </Container >
  );
}


export default CreateStudySessionModal;
import { Container, Select, TextInput, Title, Text, Image, Loader, FileInput, Space, Modal, Group, Avatar, Grid } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, yupResolver } from "@mantine/form";
import Head from "next/head";
import * as yup from "yup";
import 'dayjs/locale/vi';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAvatarImageUrl, getImageUrl } from "../../../../helpers/image.helper";
import Button from "../../../commons/Button";
import SearchTeacherForm from "../Form/searchTeacherForm";
import SaveModal from "../../TeacherScreen/Modal/save.modal";
import UserEmployee from "../../../../models/userEmployee.model";
import Loading from "../../../commons/Loading";
import { useRouter } from "next/router";
import Curriculum from "../../../../models/cirriculum.model";
import CurriculumSelectItem from "../ItemComponent/curriculumSelectItem";
import UserTeacher from "../../../../models/userTeacher.model";
import ShiftForm from "../Form/shiftForm";
import { useMediaQuery } from "@mantine/hooks";
import Shift from "../../../../models/shift.model";
import UserTutor from "../../../../models/userTutor.model";
import Classroom from "../../../../models/classroom.model";
import TimeTable from "../../../../interfaces/timeTable.interface";
import { getWeekdayName } from "../../../../helpers/getWeekdayName";
import moment from "moment";
import API from "../../../../helpers/api";
import { Url, UserRole } from "../../../../helpers/constants";
import { useAuth } from "../../../../stores/Auth";
import { toast } from "react-toastify";
import { Course } from "../../../../models/course.model";


const getMinimumValidDate = () => {
  const current = new Date();
  current.setDate(current.getDate() + 1);
  current.setHours(0);
  current.setMinutes(0);
  current.setSeconds(0);
  current.setMilliseconds(0);
  return current;
}


const diffDays = (oldOpeningDate: Date, newOpeningDate: Date) => {
  const diffTime: number = (new Date(oldOpeningDate)).getTime() - (new Date(newOpeningDate)).getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}


const getUpdatedExpectedClosingDate = (course: Course | null, openingDate?: Date) => {
  if (course === null || openingDate === undefined) return undefined;
  // Calculating expected course
  let days = diffDays(course.openingDate, openingDate);
  const expectedClosingDate = new Date(course.expectedClosingDate);
  expectedClosingDate.setDate(expectedClosingDate.getDate() + days + 7); // Add one more week
  return expectedClosingDate;
}


interface IProps {
  userEmployee: UserEmployee | null;
  userRole: UserRole | null;
  course: Course | null;
  participationCount: number;
}

const schema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên khóa học"),
  maxNumberOfStudent: yup.number()
    .required("Vui lòng nhập số lượng học viên tối đa")
    .integer("Vui lòng nhập số nguyên")
    .min(0, `Số lượng học viên tối đa phải lớn hơn 0`),
  price: yup.number()
    .required("Vui lòng nhập giá tiền khóa học")
    .integer("Vui lòng nhập số nguyên")
    .min(0, "Giá tiền khóa học phải lớn hơn 0"),
  openingDate: yup.date()
    .nullable()
    .required("Vui lòng chọn ngày khai giảng")
});


const EmployeeModifyCourseScreen = (props: IProps) => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const avatarInputRef = useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;
  const avatarImgRef = useRef<HTMLImageElement>() as React.MutableRefObject<HTMLImageElement>;
  const router = useRouter();

  const [authState] = useAuth();
  const [didMount, setDidMount] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<UserTeacher | null>(props.course?.teacher || null);
  const [currentData, setCurrentData] = useState();
  const [isOpenFindingTeacherForm, setIsOpenFindingTeacherForm] = useState(false);
  const [isOpenShiftForm, setIsOpenShiftForm] = useState(false);


  const createCourseForm = useForm({
    initialValues: {
      name: props.course?.name,
      maxNumberOfStudent: props.course?.maxNumberOfStudent,
      price: props.course?.price,
      openingDate: new Date(props.course?.openingDate || new Date()),
      image: null,
      teacher: null,
      timeTables: [] as TimeTable[],
    },
    validate: yupResolver(schema),
  });



  const activeShiftIds = useMemo(() => {
    let ids: number[] = [];
    createCourseForm.values['timeTables'].forEach(timeTable => {
      ids = ids.concat(timeTable.shifts.map(shift => shift.id));
    });
    return ids;
  }, [createCourseForm.values['timeTables'], createCourseForm.values['timeTables'].length]);



  const onSubmit = useCallback((data: any) => {
    let error = false;
    if (data.maxNumberOfStudent && data.maxNumberOfStudent < props.participationCount) {
      createCourseForm.setFieldError("maxNumberOfStudent", `Hiện tại đã có ${props.participationCount} tham gia khóa học. Số lượng học viên tối đa phải lớn hơn ${props.participationCount}`)
      error = true;
    }
    if (props.participationCount > 0 && data.price !== props.course?.price) {
      createCourseForm.setFieldError("price", `Hiện tại đã có học sinh tham gia khóa học. Không thể sửa giá khóa học.`)
      error = true;
    }
    if (data.teacher !== null &&
      !(data.teacher === props.course?.teacher.worker.user.id &&
        (new Date(createCourseForm.values.openingDate)).getTime() === (new Date(props.course?.openingDate || new Date())).getTime()) &&
      data.timeTables.length !== props.course?.sessionPerWeek) {
      createCourseForm.setFieldError("timeTables", `Lịch học hiện tại là ${props.course?.sessionPerWeek} buổi mỗi tuần`)
      error = true;
    }
    if (!error) {
      setCurrentData(data);
      setIsSaveModalOpen(true);
    }
  }, [props.participationCount, props.course?.teacher.worker.user.id, props.course?.sessionPerWeek, createCourseForm.values.openingDate?.getTime(), (new Date(props.course?.openingDate || new Date())).getTime()]);


  const onSave = useCallback(async (data: any) => {
    try {
      setIsSaving(true);
      const { timeTables, ...courseData } = data;
      const classrooms = timeTables.map((timeTable: any) => ({
        name: timeTable.classroom.name,
        branchId: timeTable.classroom.branch.id,
      }));
      const tutors = timeTables.map((timeTable: any) => timeTable.tutor.worker.user.id);
      const shifts = timeTables.map((timeTable: any) => timeTable.shifts.map((shift: any) => shift.id));

      const formData = new FormData();
      if (courseData['name'].trim() !== props.course?.name.trim())
        formData.append("name", courseData['name']);
      if (courseData['maxNumberOfStudent'] !== props.course?.maxNumberOfStudent)
        formData.append("maxNumberOfStudent", courseData['maxNumberOfStudent']);
      if (courseData['price'] !== props.course?.price)
        formData.append("price", courseData['price']);
      if ((new Date(courseData['openingDate'])).getTime() !== (new Date(props.course?.openingDate || new Date())).getTime())
        formData.append("openingDate", courseData['openingDate']);
      if (courseData['image'])
        formData.append("image", courseData['image']);
      if (courseData['teacher'])
        formData.append("teacher", courseData['teacher']);
      formData.append("version", props.course?.version.toString() || "0");
      tutors.forEach((tutor: any, index: any) => {
        formData.append(`tutors[${index}]`, tutor);
      });
      classrooms.forEach((classroom: any, index: any) => {
        formData.append(`classrooms[${index}][name]`, classroom.name);
        formData.append(`classrooms[${index}][branchId]`, classroom.branchId);
      });
      shifts.forEach((shiftArray: any, index: any) => {
        shiftArray.forEach((shift: any, innerIndex: any) => {
          formData.append(`shifts[${index}][${innerIndex}]`, shift);
        })
      });
      formData.append('courseSlug', props.course?.slug || '');

      const responses: any = await API.post(
        Url.employees.modifyCourse, formData, {
        headers: {
          'x-access-token': authState.token || "",
          'content-type': 'multipart/form-data'
        },
      });
      if (responses.success) {
        setIsSaveModalOpen(false);
        setIsSaving(false);
        await router.push("/employee/course/" + responses.course.slug);
        toast.success("Cập nhật thông tin thành công");
      } else {
        setIsSaveModalOpen(false);
        setIsSaving(false);
        toast.error("Cập nhật thông tin thất bại");
      }
    } catch (error) {
      setIsSaveModalOpen(false);
      setIsSaving(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [authState.token, props.course, props.course?.slug]);



  const onChooseTeacher = useCallback((teacher: UserTeacher) => {
    createCourseForm.setFieldValue('teacher', teacher.worker.user.id as any);
    setCurrentTeacher(teacher);
    setIsOpenFindingTeacherForm(false);
    setIsOpenShiftForm(true);
  }, [createCourseForm]);


  const onClickChangeTeacherButton = useCallback(() => {
    createCourseForm.clearFieldError('teacher');
    if (createCourseForm.values['openingDate'] === null)
      return createCourseForm.setFieldError('teacher', "Vui lòng chọn ngày khai giảng trước");
    setIsOpenFindingTeacherForm(true)
  }, [createCourseForm]);



  const onAddTimeTable = useCallback((shifts: Shift[], tutor: UserTutor, classroom: Classroom) => {
    const timeTable = createCourseForm.values['timeTables'] as TimeTable[];
    timeTable.push({ shifts, classroom, tutor });
    createCourseForm.setFieldValue('timeTables', timeTable);
  }, [createCourseForm.values['timeTables']]);



  const onRemoveTimeTable = useCallback((index: number) => {
    const timeTable = createCourseForm.values['timeTables'] as TimeTable[];
    timeTable.splice(index, 1);
    createCourseForm.setFieldValue('timeTables', timeTable);
  }, [createCourseForm.values['timeTables']]);



  useEffect(() => {
    if (createCourseForm.values['image']) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target)
          avatarImgRef.current.src = e.target?.result as string;
      };
      reader.readAsDataURL(createCourseForm.values['image']);
    }
  }, [createCourseForm.values['image']])


  useEffect(() => {
    createCourseForm.setFieldValue('timeTables', []);
  }, [createCourseForm.values['teacher'], createCourseForm.values['openingDate']?.getTime()])


  useEffect(() => {
    if (didMount) {
      createCourseForm.setFieldValue('teacher', null);
      setCurrentTeacher(null);
      setIsOpenShiftForm(false);
      setIsOpenFindingTeacherForm(false);
    }
  }, [createCourseForm.values['openingDate']?.getTime()])


  useEffect(() => {
    if (props.course === null || props.userEmployee === null || props.userEmployee.worker.branch === null)
      router.replace('/not-found');
    else setDidMount(true);
  }, []);


  useEffect(() => {
    createCourseForm.setFieldValue("timeTables", []);
  }, [createCourseForm.values.maxNumberOfStudent]);



  return (
    <>
      <Head>
        <title>Chỉnh sửa khóa học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal
        opened={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <SaveModal
          loading={isSaving}
          title="Xác nhận lưu khóa học"
          message={`Bạn có chắc muốn lưu khóa học này chứ?`}
          buttonLabel="Xác nhận"
          onSave={() => onSave(currentData)}
        />
      </Modal>

      {!didMount && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Loading />
        </Container>
      )}

      {didMount && (
        <Container size="xl" style={{ width: "100%", minWidth: 0 }}>
          <Title align="center" size="2.6rem" color="#444" transform="uppercase" my={20}>
            Chỉnh sửa khóa học
          </Title>

          <form
            onSubmit={createCourseForm.onSubmit((values) => onSubmit(values))}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}>
            <TextInput
              style={{ flex: 1 }}
              placeholder="Nhập tên khóa học"
              label="Tên khóa học"
              withAsterisk
              {...createCourseForm.getInputProps('name')}
            />

            <TextInput
              style={{ flex: 1 }}
              placeholder="Chọn chương trình dạy"
              label="Chương trình dạy"
              withAsterisk
              value={props.course?.curriculum.name}
              disabled={true}
            />

            <DatePicker
              withAsterisk
              placeholder="Ngày khai giảng"
              label="Ngày khai giảng"
              locale="vi"
              minDate={getMinimumValidDate()}
              disabled={(new Date()) >= (new Date(props.course?.openingDate || new Date()))}
              {...createCourseForm.getInputProps('openingDate')}
            />

            <TextInput
              type="number"
              style={{ flex: 1 }}
              placeholder="Số lượng học viên tối đa"
              label="Số học viên"
              withAsterisk
              {...createCourseForm.getInputProps('maxNumberOfStudent')}
            />

            <TextInput
              type="number"
              style={{ flex: 1 }}
              placeholder="Giá tiền"
              label="Giá tiền"
              withAsterisk
              disabled={props.participationCount > 0}
              {...createCourseForm.getInputProps('price')}
            />

            <TextInput
              disabled={true}
              style={{ flex: 1 }}
              placeholder="Chi nhánh"
              label="Chi nhánh"
              withAsterisk
              value={props.userEmployee?.worker.branch.name}
            />

            <Container size="xl" style={{ width: "100%" }} p={0}>
              <Text weight={600} style={{ fontSize: "14px" }}>
                Hình minh họa <Text component="span" color='red'>*</Text>
              </Text>
              <Container style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative"
              }}>
                <Image
                  withPlaceholder
                  placeholder={
                    <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "300px" }}>
                      <Loader variant="dots" />
                    </Container>
                  }
                  imageRef={avatarImgRef}
                  style={{ maxWidth: "300px" }}
                  radius="md"
                  src={getImageUrl(props.course?.image)}
                  alt="Hình minh họa chương trình dạy"
                />
                <FileInput
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={avatarInputRef}
                  {...createCourseForm.getInputProps('image')}
                />
                <Button
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    left: "50%",
                    zIndex: 10,
                    transform: "translateX(-50%)"
                  }}
                  onClick={() => avatarInputRef.current.click()}
                >Thay đổi</Button>
              </Container>
              {createCourseForm.errors['image'] && (
                <Text color="red" style={{ fontSize: "12px" }}>
                  {createCourseForm.errors['image']}
                </Text>
              )}
            </Container>

            <Container size="xl" style={{ width: "100%" }} p={0}>
              <Text weight={600} style={{ fontSize: "14px" }}>
                Giáo viên <Text component="span" color='red'>*</Text>
              </Text>
              {currentTeacher === null
                ? <Text>Chưa chọn giáo viên
                  <Button
                    ml={10} compact variant="light"
                    onClick={onClickChangeTeacherButton}
                  >Thay đổi</Button>
                </Text>
                : (<Group mt={10} style={{ width: "fit-content" }} noWrap>
                  <Avatar
                    size={60}
                    color="blue"
                    radius='xl'
                    src={getAvatarImageUrl(currentTeacher.worker.user.avatar)}
                  />
                  <Container style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start"
                  }} p={0}>
                    <Text style={{ fontSize: "1.4rem" }} weight={500} color="#444" align="center">
                      {currentTeacher.worker.user.fullName}
                    </Text>
                    <Text style={{ fontSize: "1rem" }} color="dimmed" align="center">MSGV: {currentTeacher.worker.user.id}</Text>
                  </Container>
                  <Button
                    ml={10} compact variant="light"
                    onClick={onClickChangeTeacherButton}
                  >Thay đổi</Button>
                </Group>
                )}
              {createCourseForm.errors['teacher'] && (
                <Text color="red" style={{ fontSize: "12px" }}>
                  {createCourseForm.errors['teacher']}
                </Text>
              )}
            </Container>
            {isOpenFindingTeacherForm && (
              <SearchTeacherForm
                onChooseTeacher={onChooseTeacher}
                branchId={props.userEmployee?.worker.branch.id}
                curriculumId={props.course?.curriculum.id}
              />
            )}

            {createCourseForm.values['teacher'] !== null && (
              <>
                <Container size="xl" style={{ width: "100%" }} p={0}>
                  <Text weight={600} style={{ fontSize: "14px" }}>
                    Lịch học <Text component="span" color='red'>*</Text>
                  </Text>
                  {createCourseForm.errors['timeTables'] && (
                    <Text color="red" style={{ fontSize: "12px" }}>
                      {createCourseForm.errors['timeTables']}
                    </Text>
                  )}
                </Container>
                {createCourseForm.values['timeTables'].length > 0 && (
                  <Container
                    style={{
                      width: "100%",
                      border: '1px solid #DEE2E6',
                      borderRadius: 5
                    }} size="xl">
                    {createCourseForm.values['timeTables'].map((timetable, index) => (
                      <Grid my={10} key={index}>
                        <Grid.Col span={isTablet ? 6 : 2}>
                          <Text>{getWeekdayName(timetable.shifts[0].weekDay)}</Text>
                        </Grid.Col>
                        <Grid.Col span={isTablet ? 6 : 3}>
                          <Text>{moment(timetable.shifts[0].startTime).format("HH:mm") + " - " + moment(timetable.shifts[timetable.shifts.length - 1].endTime).format("HH:mm")}</Text>
                        </Grid.Col>
                        <Grid.Col span={isTablet ? 6 : 3}>
                          <Text>{timetable.tutor.worker.user.fullName}</Text>
                        </Grid.Col>
                        <Grid.Col span={isTablet ? 6 : 2}>
                          <Text>Phòng {timetable.classroom.name}</Text>
                        </Grid.Col>
                        <Grid.Col span={isTablet ? 12 : 2}>
                          <Button fullWidth compact variant="light" color="pink" onClick={() => onRemoveTimeTable(index)}>
                            Xóa
                          </Button>
                        </Grid.Col>
                      </Grid>
                    ))}
                  </Container>
                )}

                {isOpenShiftForm && (
                  <>
                    {createCourseForm.values.teacher === props.course?.teacher.worker.user.id &&
                      (new Date(createCourseForm.values.openingDate)).getTime() === (new Date(props.course.openingDate)).getTime() && (
                        <Button
                          onClick={() => {
                            setIsOpenShiftForm(false);
                            createCourseForm.setFieldValue("teacher", null);
                          }}>Không sửa lịch học</Button>
                      )}
                    <ShiftForm
                      branchId={props.userEmployee?.worker.branch.id || 0}
                      activeShiftIds={activeShiftIds}
                      numberShiftsPerSession={props.course?.curriculum.shiftsPerSession || 0}
                      teacherId={createCourseForm.values['teacher']}
                      beginingDate={createCourseForm.values['openingDate']}
                      closingDate={getUpdatedExpectedClosingDate(props.course, createCourseForm.values['openingDate'])}
                      courseSlug={props.course?.slug}
                      onAddTimeTable={onAddTimeTable}
                      maximumStudentNumber={createCourseForm.values.maxNumberOfStudent || 0}
                    />
                  </>
                )}
              </>
            )}

            <Space h={20} />
            <Container>
              <Button type="submit" color="green">Lưu thông tin</Button>
            </Container>
            <Space h={20} />
          </form>
        </Container >
      )}
    </>
  );
}


export default EmployeeModifyCourseScreen;
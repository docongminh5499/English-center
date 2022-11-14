import { Container, FileInput, Image, Loader, Space, Textarea, TextInput, Text, Select, Title, Modal, MultiSelect } from "@mantine/core";
import Head from "next/head";
import Button from "../../../commons/Button";
import * as yup from "yup";
import { useListState, useMediaQuery } from "@mantine/hooks";
import { useForm, yupResolver } from "@mantine/form";
import { useCallback, useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../../../helpers/image.helper";
import { CourseType, CurriculumLevel, TagsType, Url } from "../../../../helpers/constants";
import { LectureList } from "./LectureList";
import SaveCurriculumModal from "../Modal/save.modal";
import { toast } from "react-toastify";
import LectureForm from "./LectureForm";
import Curriculum from "../../../../models/cirriculum.model";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from 'uuid';
import Lecture from "../../../../models/lecture.model";
import DeleteModal from "../Modal/delete.modal";
import ChangeModifiedLectureModal from "../Modal/changeModifiedLecture.modal";
import API from "../../../../helpers/api";
import { useAuth } from "../../../../stores/Auth";
import Tag from "../../../../models/tag.model";
import Loading from "../../../commons/Loading";

const schema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tiêu đề").max(255, "Tiêu đề có độ dài quá lớn, tối đa 255 ký tự"),
  desc: yup.string().required("Vui lòng nhập mô tả"),
  type: yup.string()
    .required("Vui lòng chọn loại chương trình")
    .oneOf([CourseType.LONG_TERM, CourseType.SHORT_TERM], "Vui lòng chọn loại chương trình"),
  lectures: yup.array().required("Vui lòng thêm bài học").min(1, "Vui lòng thêm bài học"),
  image: yup.mixed().required("Vui lòng chọn hình ảnh minh họa"),
  shiftsPerSession: yup.number().typeError("Vui lòng nhập số ca học").required("Vui lòng nhập số ca học").integer("Vui lòng nhập số ca học hợp lệ").positive("Vui lòng nhập số ca học hợp lệ"),
  level: yup.string()
    .required("Vui lòng chọn trình độ")
    .oneOf([CurriculumLevel.Advance, CurriculumLevel.Beginer, CurriculumLevel.Intermediate], "Vui lòng chọn trình độ"),
  tags: yup.array().required("Vui lòng thêm thể loại").min(1, "Vui lòng thêm thể loại"),
});


interface IProps {
  tags: Tag[];
}



const TeacherCurriculumAddScreen = (props: IProps) => {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const saveLectureFormRef = useRef<HTMLButtonElement>() as React.MutableRefObject<HTMLButtonElement>;
  const avatarInputRef = useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;
  const avatarImgRef = useRef<HTMLImageElement>() as React.MutableRefObject<HTMLImageElement>;
  const router = useRouter();

  const [authState] = useAuth();
  const [lectures, lectureHandlers] = useListState<Lecture>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentData, setCurrentData] = useState();
  const [isOpenLectureForm, setIsOpenLectureForm] = useState(false);
  const [currentModifiedLecture, setCurrentModifiedLecture] = useState<Lecture | null>(null);
  const [targetModifiedLecture, setTargetModifiedLecture] = useState<Lecture | null>(null);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenChangeModifiedModal, setIsOpenChangeModifiedModal] = useState(false);
  const [isOpenHaveNotSaveLectureModal, setIsOpenHaveNotSaveLectureModal] = useState(false);
  const [currentRemovedLecture, setCurrentRemovedLecture] = useState<Lecture | null>();
  const [tags, setTags] = useState(props.tags);
  const [didMount, setDidMount] = useState(false);


  const createCurriculumInfoForm = useForm({
    initialValues: {
      name: "",
      desc: "",
      type: "",
      lectures: lectures,
      image: null,
      shiftsPerSession: "",
      level: "",
      tags: [] as string[],
    },
    validate: yupResolver(schema),
  });



  const onSave = useCallback(async (data: any) => {
    try {
      setIsSaving(true);
      const updatedCurriculum = {
        name: data.name,
        desc: data.desc,
        type: data.type,
        lectures: data.lectures,
        shiftsPerSession: data.shiftsPerSession,
        level: data.level,
        tags: data.tags,
      };
      const formData = new FormData();
      formData.append("curriculum", JSON.stringify(updatedCurriculum));
      formData.append("image", data['image']);
      const responses: any = await API.post(
        Url.teachers.createCurriculum, formData, {
        headers: {
          'x-access-token': authState.token || "",
          'content-type': 'multipart/form-data'
        },
      });

      if (responses.sucess === false) {
        toast.error("Thêm chương trình dạy thất bại. Vui lòng thử lại.");
      } else {
        router.push("/teacher/curriculum/" + responses.curriculum.id);
        toast.success("Thêm chương trình dạy thành công");
      }
      setIsSaving(false);
      setIsSaveModalOpen(false);
    } catch (error) {
      setIsSaving(false);
      setIsSaveModalOpen(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
    }
  }, [authState.token])



  const onSubmit = useCallback((data: any) => {
    if (isOpenLectureForm) {
      setIsOpenHaveNotSaveLectureModal(true);
    } else {
      data.lectures = data.lectures.map(
        (lecture: any, index: number) => ({ ...lecture, order: index + 1 }));
      setCurrentData(data);
      setIsSaveModalOpen(true);
    }
  }, [isOpenLectureForm]);



  const onClickLecture = useCallback((lecture: Lecture) => {
    if (lecture.pseudoId !== currentModifiedLecture?.pseudoId) {
      if (isOpenLectureForm) {
        setTargetModifiedLecture(lecture);
        setIsOpenChangeModifiedModal(true);
      } else {
        setCurrentModifiedLecture(lecture);
        setIsOpenLectureForm(true);
      }
    }
  }, [currentModifiedLecture, isOpenLectureForm])



  const onClickAddLectureButton = useCallback(() => {
    if (isOpenLectureForm) {
      setTargetModifiedLecture(null);
      setIsOpenChangeModifiedModal(true);
    } else {
      setCurrentModifiedLecture(null);
      setIsOpenLectureForm(true);
    }
  }, [isOpenLectureForm]);



  const onDragItem = useCallback((from: number, to: number) => {
    lectureHandlers.reorder({ from, to })
  }, [lectureHandlers])



  const onDeleteItem = useCallback((lecture: Lecture) => {
    setCurrentRemovedLecture(lecture);
    setIsOpenDeleteModal(true);
  }, []);


  const onConfirmDeleteLecture = useCallback(() => {
    let removed = false;
    for (let index = 0; index < lectures.length; index++) {
      if (lectures[index].pseudoId === currentRemovedLecture?.pseudoId) {
        lectureHandlers.remove(index);
        removed = true;
        break;
      }
    }
    if (removed && currentRemovedLecture?.pseudoId === currentModifiedLecture?.pseudoId) {
      setCurrentModifiedLecture(null);
      setIsOpenLectureForm(false);
    }
    setIsOpenDeleteModal(false);
    setCurrentRemovedLecture(null);
  }, [lectures, lectureHandlers])



  const onSaveModifiedLecture = useCallback((data: any) => {
    if (currentModifiedLecture !== null) {
      const modified = { ...currentModifiedLecture, ...data };
      for (let index = 0; index < lectures.length; index++) {
        if (modified.pseudoId === lectures[index].pseudoId) {
          lectureHandlers.setItem(index, modified);
          break;
        }
      }
    } else lectureHandlers.append({ ...data, pseudoId: uuidv4() });

    if (isOpenChangeModifiedModal === true) {
      setCurrentModifiedLecture(targetModifiedLecture);
      setTargetModifiedLecture(null);
      setIsOpenChangeModifiedModal(false);
    } else {
      setCurrentModifiedLecture(null);
      setIsOpenLectureForm(false);
    }
  }, [currentModifiedLecture, lectureHandlers, isOpenChangeModifiedModal, targetModifiedLecture]);


  const onCancelModifiedLecture = useCallback(() => {
    if (isOpenChangeModifiedModal === true) {
      setCurrentModifiedLecture(targetModifiedLecture);
      setTargetModifiedLecture(null);
      setIsOpenChangeModifiedModal(false);
    } else {
      setCurrentModifiedLecture(null);
      setIsOpenLectureForm(false);
    }
  }, [isOpenChangeModifiedModal, targetModifiedLecture]);



  useEffect(() => {
    if (createCurriculumInfoForm.values['image']) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target)
          avatarImgRef.current.src = e.target?.result as string;
      };
      reader.readAsDataURL(createCurriculumInfoForm.values['image']);
    }
  }, [createCurriculumInfoForm.values['image']])



  useEffect(() => {
    createCurriculumInfoForm.setFieldValue("lectures", lectures);
  }, [lectures])


  useEffect(() => {
    if (authState.isManager !== true)
      router.replace('/not-found');
    else setDidMount(true);
  }, []);



  return (
    <>
      <Head>
        <title>Thêm chương trình dạy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal
        opened={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <SaveCurriculumModal
          loading={isSaving}
          title="Xác nhận lưu chương trình dạy"
          message={`Bạn có chắc muốn lưu chương trình dạy chứ?`}
          onSave={() => onSave(currentData)}
        />
      </Modal>

      <Modal
        opened={isOpenDeleteModal}
        onClose={() => setIsOpenDeleteModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <DeleteModal
          loading={false}
          title="Xóa bài học"
          message={`Bạn có chắc muốn xóa bài học ${currentRemovedLecture?.name.toUpperCase()}?`}
          onDelete={onConfirmDeleteLecture}
        />
      </Modal>


      <Modal
        opened={isOpenChangeModifiedModal}
        onClose={() => setIsOpenChangeModifiedModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <ChangeModifiedLectureModal
          onCancel={onCancelModifiedLecture}
          onSave={() => saveLectureFormRef.current.click()}
        />
      </Modal>


      <Modal
        opened={isOpenHaveNotSaveLectureModal}
        onClose={() => setIsOpenHaveNotSaveLectureModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <Container p={0} style={{
          backgroundColor: "white",
          borderRadius: "5px",
          margin: "0 1rem",
        }}>
          <Title transform="uppercase" color="#444" size="1.6rem" my={20} align="center">
            Thông báo
          </Title>
          <Text align="center" style={{ color: "#444" }}>Bạn chưa lưu bài học.</Text>
          <Text align="center" style={{ color: "#444" }}>Hãy lưu bài học trước khi kết thúc.</Text>
        </Container>
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
        <Container size="xl" style={{ width: "100%" }} p={isMobile ? 8 : 20}>
          <Title transform="uppercase" color="#444" size="2.6rem" my={20} align="center">
            Thêm chương trình dạy
          </Title>

          <form
            encType='multipart/form-data'
            onSubmit={createCurriculumInfoForm.onSubmit((values) => onSubmit(values))}>

            <TextInput
              style={{ flex: 1 }}
              placeholder="Tiêu đề"
              label="Tiêu đề"
              withAsterisk
              {...createCurriculumInfoForm.getInputProps("name")}
            />

            <Space h={10} />

            <Textarea
              withAsterisk
              placeholder="Mô tả ngắn"
              label="Mô tả ngắn"
              minRows={6}
              {...createCurriculumInfoForm.getInputProps('desc')}
            />

            <Space h={10} />

            <Select
              style={{ flex: 1 }}
              withAsterisk
              placeholder="Loại chương trình"
              label="Loại chương trình"
              data={[
                { value: CourseType.SHORT_TERM, label: 'Ngắn hạn' },
                { value: CourseType.LONG_TERM, label: 'Dài hạn' },
              ]}
              {...createCurriculumInfoForm.getInputProps('type')}
            />

            <Space h={10} />

            <Select
              style={{ flex: 1 }}
              withAsterisk
              placeholder="Trình độ"
              label="Trình độ"
              data={[
                { value: CurriculumLevel.Beginer, label: 'Sơ cấp' },
                { value: CurriculumLevel.Intermediate, label: 'Trung cấp' },
                { value: CurriculumLevel.Advance, label: 'Cao cấp' },
              ]}
              {...createCurriculumInfoForm.getInputProps('level')}
            />

            <Space h={10} />

            <TextInput
              style={{ flex: 1 }}
              placeholder="Số ca học mỗi buổi học"
              label="Số ca học mỗi buổi học"
              withAsterisk
              {...createCurriculumInfoForm.getInputProps("shiftsPerSession")}
            />

            <Space h={10} />

            <MultiSelect
              data={tags.map(tag => tag.name)}
              label="Thể loại"
              placeholder="Thể loại"
              searchable
              creatable
              getCreateLabel={(query) => `+ Thêm "${query}"`}
              onCreate={(query) => {
                const item = { name: query, type: TagsType.Curriculum };
                setTags((current) => [...current, item]);
                return query;
              }}
              nothingFound="Không tìm thấy kết quả"
              {...createCurriculumInfoForm.getInputProps('tags')}
            />

            <Space h={10} />

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
                src={getImageUrl(undefined)}
                alt="Hình minh họa chương trình dạy"
              />
              <FileInput
                accept="image/*"
                style={{ display: 'none' }}
                ref={avatarInputRef}
                {...createCurriculumInfoForm.getInputProps('image')}
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
            {createCurriculumInfoForm.errors['image'] && (
              <Text color="red" style={{ fontSize: "12px" }}>
                {createCurriculumInfoForm.errors['image']}
              </Text>
            )}
            <Space h={10} />

            <Text weight={600} style={{ fontSize: "14px" }}>
              Chương trình dạy <Text component="span" color='red'>*</Text>
            </Text>
            {createCurriculumInfoForm.errors['lectures'] && (
              <Text color="red" style={{ fontSize: "12px" }}>
                {createCurriculumInfoForm.errors['lectures']}
              </Text>
            )}
            <Container p={0} size="xl" style={{ width: "100%" }}>
              <Container p={0} style={{ width: "100%" }} size="xl">
                <Button
                  color="green"
                  my={10}
                  onClick={onClickAddLectureButton}>
                  Thêm bài học
                </Button>
                <LectureList
                  activeId={currentModifiedLecture?.pseudoId}
                  data={lectures}
                  onDragItem={onDragItem}
                  onClickItem={onClickLecture}
                  onDeleteItem={onDeleteItem}
                />
              </Container>
              <Space h={20} />
              {isOpenLectureForm && (
                <Container p={0} style={{ width: "100%" }} size="xl">
                  <LectureForm
                    submitRef={saveLectureFormRef}
                    lecture={currentModifiedLecture}
                    onSave={onSaveModifiedLecture}
                    onCancel={onCancelModifiedLecture}
                    onErrorCallback={() => setIsOpenChangeModifiedModal(false)}
                  />
                </Container>
              )}
            </Container>

            <Space h={40} />
            <Container p={0} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
              <Button type="submit">Lưu thông tin</Button>
            </Container>
            <Space h={40} />
          </form>
        </Container >
      )}
    </>
  );
}


export default TeacherCurriculumAddScreen;
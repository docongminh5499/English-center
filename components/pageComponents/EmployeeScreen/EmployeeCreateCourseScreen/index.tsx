import { Container, Select, TextInput, Title, Text, Image, Loader, FileInput, Space, Modal } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, yupResolver } from "@mantine/form";
import Head from "next/head";
import * as yup from "yup";
import 'dayjs/locale/vi';
import { useCallback, useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../../../helpers/image.helper";
import Button from "../../../commons/Button";
import SearchTeacherForm from "./searchTeacherForm";
import SaveModal from "../../TeacherScreen/Modal/save.modal";


const schema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên khóa học"),
  maxNumberOfStudent: yup.number()
    .required("Vui lòng nhập số lượng học viên tối đa")
    .integer("Vui lòng nhập số nguyên")
    .min(1, "Số lượng học viên tối đa phải lớn hơn 0"),
  price: yup.number()
    .required("Vui lòng nhập giá tiền khóa học")
    .integer("Vui lòng nhập số nguyên")
    .min(0, "Giá tiền khóa học phải lớn hơn 0"),
  openingDate: yup.date()
    .required("Vui lòng chọn ngày khai giảng")
    .min(new Date(Date.now() + 86400000), "Vui lòng nhập ngày khai giảng sau ngày hiện tại"),
  image: yup.mixed().required("Vui lòng chọn hình minh họa"),
  curriculum: yup.object().required("Vui lòng chọn chương trình dạy"),
  branch: yup.object().required("Vui lòng chọn chi nhánh")
});



const EmployeeCreateCourseScreen = () => {
  const avatarInputRef = useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;
  const avatarImgRef = useRef<HTMLImageElement>() as React.MutableRefObject<HTMLImageElement>;

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentData, setCurrentData] = useState();



  const createCourseForm = useForm({
    initialValues: {
      name: "",
      maxNumberOfStudent: 20,
      price: 1000000,
      openingDate: new Date(Date.now() + 86400000),
      image: null,
      curriculum: null,
      branch: null
    },
    validate: yupResolver(schema),
  });


  const onSubmit = useCallback((data: any) => {
    setCurrentData(data);
    setIsSaveModalOpen(true);
  }, []);


  const onSave = useCallback(async (data: any) => {
    console.log(data);
  }, []);


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



  return (
    <>
      <Head>
        <title>Tạo khóa học</title>
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
          title="Xác nhận tạo khóa học"
          message={`Bạn có chắc muốn tạo khóa học này chứ?`}
          buttonLabel="Xác nhận tạo"
          onSave={() => onSave(currentData)}
        />
      </Modal>


      <Container size="xl" style={{ width: "100%" }}>
        <Title align="center" size="2.6rem" color="#444" transform="uppercase" my={20}>
          Tạo khóa học mới
        </Title>

        <form
          onSubmit={createCourseForm.onSubmit((values) => onSubmit(values))}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem"
          }}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Nhập tên khóa học"
            label="Tên khóa học"
            withAsterisk
            {...createCourseForm.getInputProps('name')}
          />

          <Select
            label="Chương trình dạy"
            placeholder="Tìm kiếm chương trình dạy"
            searchable
            nothingFound="Không có chương trình dạy"
            data={['React', 'Angular', 'Svelte', 'Vue']}
            {...createCourseForm.getInputProps('curriculum')}
          />

          <DatePicker
            withAsterisk
            placeholder="Ngày khai giảng"
            label="Ngày khai giảng"
            locale="vi"
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
            {...createCourseForm.getInputProps('price')}
          />

          <TextInput
            disabled
            style={{ flex: 1 }}
            placeholder="Chi nhánh"
            label="Chi nhánh"
            withAsterisk
            {...createCourseForm.getInputProps('branch')}
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
                src={getImageUrl(undefined)}
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
            <Text>Đỗ Công Minh <Button ml={10} compact variant="light">Thay đổi</Button></Text>
            {createCourseForm.errors['teacher'] && (
              <Text color="red" style={{ fontSize: "12px" }}>
                {createCourseForm.errors['teacher']}
              </Text>
            )}
          </Container>
          <SearchTeacherForm />

          <Space h={20} />
          <Container>
            <Button type="submit" color="green">Tạo khóa học</Button>
          </Container>
          <Space h={20} />
        </form>
      </Container>
    </>
  );
}


export default EmployeeCreateCourseScreen;
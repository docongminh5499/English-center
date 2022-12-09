import { Container, Space, Text, Textarea, TextInput, Title } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { MutableRefObject, useEffect } from "react";
import * as yup from "yup";
import Lecture from "../../../../models/lecture.model";
import Button from "../../../commons/Button";
import RichTextEditor from "../../../commons/RichText";


interface IProps {
  submitRef: MutableRefObject<HTMLButtonElement>;
  lecture: Lecture | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  onErrorCallback: () => void;
}


const schema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên bài học").max(255, "Tên bài học có độ dài quá lớn, tối đa 255 ký tự"),
  desc: yup.string().required("Vui lòng nhập mô tả"),
  detail: yup.string().required("Vui lòng nhập chi tiết bài học")
});



const LectureForm = (props: IProps) => {
  const lectureForm = useForm({
    initialValues: {
      name: props.lecture?.name || "",
      desc: props.lecture?.desc || "",
      detail: props.lecture?.detail || "",
    },
    validate: yupResolver(schema),
  });



  useEffect(() => {
    lectureForm.setFieldValue("name", props.lecture?.name || "");
    lectureForm.setFieldValue("desc", props.lecture?.desc || "");
    lectureForm.setFieldValue("detail", props.lecture?.detail || "");
    lectureForm.clearErrors();
  }, [props.lecture]);



  useEffect(() => {
    if (lectureForm.errors['name'] || lectureForm.errors['desc'] || lectureForm.errors['detail'])
      props.onErrorCallback();
  }, [lectureForm.errors, lectureForm.errors['name'], lectureForm.errors['desc'], lectureForm.errors['detail']])



  return (
    <Container p={10} style={{ backgroundColor: "#F1F3F5", width: "100%", borderRadius: 5 }} size='xl'>
      <Title transform="uppercase" size="1.8rem" color="#444" my={20} align="center">
        Thông tin bài học
      </Title>
      <TextInput
        style={{ flex: 1 }}
        placeholder="Tiêu đề"
        label="Tiêu đề"
        withAsterisk
        {...lectureForm.getInputProps("name")}
      />

      <Space h={10} />

      <Textarea
        withAsterisk
        placeholder="Mô tả ngắn"
        label="Mô tả ngắn"
        minRows={6}
        {...lectureForm.getInputProps('desc')}
      />

      <Space h={10} />

      <Text weight={600} style={{ fontSize: "14px" }}>
        Chi tiết bài học <Text component="span" color='red'>*</Text>
      </Text>
      <RichTextEditor
        style={{ borderColor: lectureForm.errors['detail'] ? "red" : "#ced4da" }}
        label="Chi tiết bài học"
        controls={[
          ['bold', 'strike', 'italic', 'underline', 'link', 'clean'],
          ['orderedList', 'unorderedList'],
          ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
          ['sup', 'sub'],
          ['alignLeft', 'alignCenter', 'alignRight'],
        ]}
        {...lectureForm.getInputProps("detail")}
      />
      {lectureForm.errors['detail'] && (
        <Text color="red" style={{ fontSize: "12px" }}>
          {lectureForm.errors['detail']}
        </Text>
      )}

      <Space h={40} />
      <Container p={0} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
        <Button
          ref={props.submitRef}
          color="green"
          onClick={lectureForm.onSubmit((values) => props.onSave(values))}>
          Lưu
        </Button>
        <Button color="red" onClick={props.onCancel}>Hủy</Button>
      </Container>

    </Container>
  );
}



export default LectureForm;
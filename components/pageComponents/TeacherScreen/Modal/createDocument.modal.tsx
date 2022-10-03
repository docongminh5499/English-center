import { Container, FileInput, Group, Input, Radio, Space, Text, TextInput } from "@mantine/core";
import * as yup from "yup";
import { useForm, yupResolver } from '@mantine/form';
import Button from "../../../commons/Button";

interface IProps {
  onCreate: (data: any) => void;
}

const schema = yup.object().shape({
  documentName: yup.string().required("Vui lòng nhập tên tài liệu"),
  documentYear: yup.string().nullable().notRequired().when('documentYear', {
    is: (value: string) => value?.length,
    then: rule => rule.matches(/^[0-9]{1,4}$/, "Vui lòng kiểm tra năm xuất bản"),
  }),
  documentType: yup.string().oneOf(['link', 'file'], "Vui lòng tải tài liệu hoặc thêm đường dẫn"),
  documentLink: yup.string().when('documentType', {
    is: (value: string) => value === "link",
    then: rule => rule.required("Vui lòng nhập đường dẫn").url("Đường dẫn không hợp lệ"),
  }),
  documentFile: yup.mixed().when('documentType', {
    is: (value: string) => value === "file",
    then: rule => rule.required("Vui lòng chọn tệp tin"),
  }),
}, [
  ['documentYear', 'documentYear'],
  ['documentLink', 'documentType'],
  ['documentFile', 'documentType']
]);

const CreateDocumentModal = (props: IProps) => {
  const createDocumentForm = useForm({
    initialValues: {
      documentName: '',
      documentAuthor: '',
      documentYear: '',
      documentType: '',
      documentLink: '',
    },
    validate: yupResolver(schema),
  });


  return (
    <Container>
      <Text transform="uppercase" align="center" style={{ fontSize: "2.4rem" }} color="#444" weight={600}>
        Tạo tài liệu mới
      </Text>
      <Space h={10} />
      <form
        encType='multipart/form-data'
        onSubmit={createDocumentForm.onSubmit((values) => props.onCreate(values))}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>

        <TextInput
          withAsterisk
          placeholder="Tên tài liệu"
          label="Tên tài liệu"
          {...createDocumentForm.getInputProps('documentName')}
        />

        <TextInput
          placeholder="Tác giả"
          label="Tác giả"
          {...createDocumentForm.getInputProps('documentAuthor')}
        />

        <TextInput
          placeholder="Năm xuất bản"
          label="Năm xuất bản"
          type="number"
          {...createDocumentForm.getInputProps('documentYear')}
        />

        <Radio.Group
          orientation="vertical"
          label="Tài liệu"
          withAsterisk
          {...createDocumentForm.getInputProps('documentType')}
        >
          <Group style={{ width: "100%" }}>
            <Radio value="link" label="Đường dẫn" />
            <TextInput
              style={{ flex: 1 }}
              placeholder="Đường dẫn"
              disabled={createDocumentForm.values['documentType'] !== 'link'}
              {...createDocumentForm.getInputProps('documentLink')}
            />
          </Group>

          <Group style={{ width: "100%" }}>
            <Radio value="file" label="Tải file lên" />
            <FileInput
              placeholder="Chọn file"
              style={{ flex: 1 }}
              disabled={createDocumentForm.values['documentType'] !== 'file'}
              {...createDocumentForm.getInputProps('documentFile')}
            />
          </Group>

        </Radio.Group>

        <Space h={20} />

        <Button type="submit">Tạo tài liệu</Button>
      </form>
    </Container>
  );

}


export default CreateDocumentModal;
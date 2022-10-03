import { Container, Divider, FileInput, Grid, Image, Loader, Select, Space, Text, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/router";
import Head from "next/head";
import Button from "../../../commons/Button";
import * as yup from "yup";
import { Gender } from "../../../../helpers/constants";
import { DatePicker } from "@mantine/dates";
import 'dayjs/locale/vi';
import RichTextEditor from "../../../commons/RichText";
import { useCallback, useEffect, useRef } from "react";


const schema = yup.object().shape({
  fullName: yup.string().required("Vui lòng nhập tên").max(50, "Họ và tên có độ dài quá lớn, tối đa 50 ký tự"),
  gender: yup.string().required("Vui lòng chọn giới tính").oneOf([Gender.MALE, Gender.FEMALE, Gender.UNDEFINE]),
  dateOfBirth: yup.date().required("Vui lòng chọn ngày sinh"),
  passport: yup.string().required("Vui lòng nhập CMND/CCCD").max(12, "Độ dài CMND/CCCD tối đa 12 số"),
  nation: yup.string().required("Vui lòng điền dân tộc"),
  homeTown: yup.string().required("Vui lòng điền nguyên quán").max(255, "Tên nguyên quán có độ dài quá lớn, tối đa 255 ký tự"),
  address: yup.string().max(255, "Địa chỉ có độ dài quá lớn, tối đa 255 ký tự"),
  email: yup.string().nullable().notRequired().when('email', {
    is: (value: string) => value?.length,
    then: rule => rule.email("Vui lòng kiểm tra lại email").max(25, "Độ dài email quá lớn, tối đa 25 ký tự")
  }),
  phone: yup.string().nullable().notRequired().when('phone', {
    is: (value: string) => value?.length,
    then: rule => rule.matches(/^[0-9]{1,11}$/, "Vui lòng kiểm tra số điện thoại")
  })
}, [
  ['email', 'email'],
  ['phone', 'phone']
]);


const TeacherModifyPersonalScreen = () => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;
  const avatarImgRef = useRef<HTMLImageElement>() as React.MutableRefObject<HTMLImageElement>;

  const updatePersonalInfoForm = useForm({
    initialValues: {
      avatar: null
    },
    validate: yupResolver(schema),
  });


  const onSubmit = useCallback((data: any) => {
    console.log(data);
  }, [])


  useEffect(() => {
    if (updatePersonalInfoForm.values['avatar']) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target) {
          avatarImgRef.current.src = e.target?.result as string;
        }

      };
      reader.readAsDataURL(updatePersonalInfoForm.values['avatar']);
    }
  }, [updatePersonalInfoForm.values['avatar']])


  return (
    <>
      <Head>
        <title>Chỉnh sửa tài khoản</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container size="xl" style={{ width: "100%" }} p={isMobile ? 8 : 20}>
        <form
          encType='multipart/form-data'
          onSubmit={updatePersonalInfoForm.onSubmit((values) => onSubmit(values))}>
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
              src="https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
              alt="Hình đại diện"
            />
            <FileInput
              style={{ display: 'none' }}
              ref={avatarInputRef}
              {...updatePersonalInfoForm.getInputProps('avatar')}
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
          <Space h={20} />
          <Grid>
            <Grid.Col span={isLargeTablet ? 12 : 5}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Họ và tên"
                label="Họ và tên"
                withAsterisk
                {...updatePersonalInfoForm.getInputProps("fullName")}
              />
              <Space h={10} />
              <Select
                style={{ flex: 1 }}
                withAsterisk
                placeholder="Giới tính"
                label="Giới tính"
                data={[
                  { value: Gender.MALE, label: 'Nam' },
                  { value: Gender.FEMALE, label: 'Nữ' },
                  { value: Gender.UNDEFINE, label: 'Không xác định' },
                ]}
                {...updatePersonalInfoForm.getInputProps('gender')}
              />
              <Space h={10} />
              <DatePicker
                style={{ flex: 1 }}
                locale="vi"
                withAsterisk
                label="Ngày sinh"
                placeholder="ngày sinh"
                {...updatePersonalInfoForm.getInputProps('dateOfBirth')}
              />
              <Space h={10} />
              <TextInput
                style={{ flex: 1 }}
                placeholder="CMND/CCCD"
                label="CMND/CCCD"
                withAsterisk
                type="number"
                {...updatePersonalInfoForm.getInputProps("passport")}
              />
              <Space h={10} />
              <TextInput
                style={{ flex: 1 }}
                placeholder="Dân tộc"
                label="Dân tộc"
                withAsterisk
                {...updatePersonalInfoForm.getInputProps("nation")}
              />
            </Grid.Col>
            {!isLargeTablet && (
              <Grid.Col span={2}></Grid.Col>
            )}
            <Grid.Col span={isLargeTablet ? 12 : 5}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Nguyên quán"
                label="Nguyên quán"
                withAsterisk
                {...updatePersonalInfoForm.getInputProps("homeTown")}
              />
              <Space h={10} />
              <TextInput
                style={{ flex: 1 }}
                placeholder="Địa chỉ"
                label="Địa chỉ"
                withAsterisk
                {...updatePersonalInfoForm.getInputProps("address")}
              />
              <Space h={10} />
              <TextInput
                style={{ flex: 1 }}
                placeholder="Email"
                label="Email"
                type="email"
                {...updatePersonalInfoForm.getInputProps("email")}
              />
              <Space h={10} />
              <TextInput
                style={{ flex: 1 }}
                placeholder="Số điện thoại"
                label="Số điện thoại"
                type="number"
                {...updatePersonalInfoForm.getInputProps("phone")}
              />
            </Grid.Col>
          </Grid>

          <Space h={40} />
          <Text color="#444" weight={700} style={{ fontSize: "1.8rem" }}>Kỹ năng chuyên môn</Text>
          <RichTextEditor
            controls={[
              ['bold', 'strike', 'italic', 'underline', 'link', 'clean'],
              ['orderedList', 'unorderedList'],
              ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
              ['sup', 'sub'],
              ['alignLeft', 'alignCenter', 'alignRight'],
            ]}
            {...updatePersonalInfoForm.getInputProps("shortDesc")}
          />

          <Space h={40} />
          <Text color="#444" weight={700} style={{ fontSize: "1.8rem" }}>Kinh nghiệm giảng dạy</Text>
          <RichTextEditor
            controls={[
              ['bold', 'strike', 'italic', 'underline', 'link', 'clean'],
              ['orderedList', 'unorderedList'],
              ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
              ['sup', 'sub'],
              ['alignLeft', 'alignCenter', 'alignRight'],
            ]}
            {...updatePersonalInfoForm.getInputProps("experience")}
          />

          <Space h={40} />
          <Container p={0} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
            <Button color="green" type="submit">Lưu</Button>
            <Button color="red">Hủy</Button>
          </Container>
          <Space h={40} />
        </form>
      </Container>
    </>
  );
}


export default TeacherModifyPersonalScreen;
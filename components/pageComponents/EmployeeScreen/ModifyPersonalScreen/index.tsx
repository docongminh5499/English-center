import { Container, FileInput, Grid, Image, Loader, Modal, PasswordInput, Select, Space, TextInput, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, yupResolver } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import 'dayjs/locale/vi';
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import API from "../../../../helpers/api";
import { Gender, TimeZoneOffset, Url, UserRole } from "../../../../helpers/constants";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";
import UserEmployee from "../../../../models/userEmployee.model";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";
import SaveNotificationModal from "../Modal/modal";


interface IProps {
  userRole?: UserRole | null;
  userEmployee: UserEmployee | null;
}


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



const accountSchema = yup.object().shape({
  username: yup
    .string()
    .required("Vui lòng nhập tên đăng nhập")
    .max(50, "Tên đăng nhập có độ dài quá lớn, tối đa 50 ký tự"),
  oldPassword: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .max(100, "Mật khẩu có độ dài quá lớn, tối đa 100 ký tự"),
  newPassword: yup
    .string()
    .nullable()
    .notRequired()
    .when('newPassword', {
      is: (value: string) => value?.length,
      then: rule => rule.max(100, "Mật khẩu có độ dài quá lớn, tối đa 100 ký tự")
    }),
  repeatNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Lặp lại mật khẩu không khớp')
}, [['newPassword', 'newPassword']]);



const EmployeeModifyPersonalScreen = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const router = useRouter();
  const [active, setActive] = useState<number>(1);
  const [authState, authAction] = useAuth();
  const [didMount, setDidMount] = useState(false);
  const [currentUserEmployee, setCurrentUserEmployee] = useState(props.userEmployee);
  // Personal info state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<any>();
  // Account state
  const [isSaveAccountModalOpen, setIsSaveAccountModalOpen] = useState(false);
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [dataAccount, setDataAccount] = useState<any>();
  // React node refs
  const avatarInputRef = useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;
  const avatarImgRef = useRef<HTMLImageElement>() as React.MutableRefObject<HTMLImageElement>;


  useEffect(() => {
    if (props.userEmployee === null)
      router.replace('/not-found');
    else setDidMount(true);
  }, []);



  const updatePersonalInfoForm = useForm({
    initialValues: {
      fullName: currentUserEmployee?.worker.user.fullName,
      gender: currentUserEmployee?.worker.user.sex,
      dateOfBirth: moment(currentUserEmployee?.worker.user.dateOfBirth).utcOffset(TimeZoneOffset).toDate(),
      passport: currentUserEmployee?.worker.passport,
      nation: currentUserEmployee?.worker.nation,
      homeTown: currentUserEmployee?.worker.homeTown,
      address: currentUserEmployee?.worker.user.address,
      email: currentUserEmployee?.worker.user.email,
      phone: currentUserEmployee?.worker.user.phone,
      avatar: null
    },
    validate: yupResolver(schema),
  });


  const updateAccountForm = useForm({
    initialValues: {
      oldUsername: authState.userName,
      username: authState.userName,
      oldPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    },
    validate: yupResolver(accountSchema),
  });


  const onSubmit = useCallback((data: any) => {
    setIsSaveModalOpen(true);
    setData(data);
  }, []);


  const onSubmitAccount = useCallback((data: any) => {
    setIsSaveAccountModalOpen(true);
    setDataAccount(data);
  }, [])


  const onSave = useCallback(async (data: any) => {
    setIsSaving(true);
    if (currentUserEmployee === null) {
      setIsSaveModalOpen(false);
      setIsSaving(false);
      toast.error("Cập nhật thông tin thất bại");
      return;
    }
    currentUserEmployee.worker.user.fullName = data.fullName;
    currentUserEmployee.worker.user.dateOfBirth = data.dateOfBirth;
    currentUserEmployee.worker.user.sex = data.gender;
    currentUserEmployee.worker.passport = data.passport;
    currentUserEmployee.worker.nation = data.nation;
    currentUserEmployee.worker.homeTown = data.homeTown;
    currentUserEmployee.worker.user.address = data.address;
    currentUserEmployee.worker.user.email = data.email;
    currentUserEmployee.worker.user.phone = data.phone;

    const obUserEmployee: { [key: string]: any; } = Object.assign({}, currentUserEmployee);
    try {
      const formData = new FormData();
      formData.append("avatar", data['avatar']);
      formData.append("userEmployee", JSON.stringify(obUserEmployee));
      const responses: any = await API.post(
        Url.employees.modifyPersonalInformation, formData, {
        headers: {
          'x-access-token': authState.token || "",
          'content-type': 'multipart/form-data'
        },
      });
      if (responses.success) {
        setIsSaveModalOpen(false);
        setIsSaving(false);
        await authAction.reload(responses.token);
        await router.push("/employee/personal");
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
  }, [currentUserEmployee, authState.token, router, toast])


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


  const onSaveAccount = useCallback(async (data: any) => {
    try {
      setIsSavingAccount(true);
      const responses = await API.post(Url.users.modifyAccount, {
        token: authState.token,
        oldUsername: data.oldUsername,
        oldPassword: data.oldPassword,
        username: data.username,
        newPassword: data.newPassword,
      });
      if (responses == true) {
        toast.success("Cập nhật thông tin thành công. Vui lòng đăng nhập lại bằng thông tin mới.")
      } else toast.error("Cập nhật thông tin thất bại.")
      setIsSaveAccountModalOpen(false);
      setIsSavingAccount(false);
    } catch (error) {
      setIsSaveAccountModalOpen(false);
      setIsSavingAccount(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [authState.token])



  return (
    <>
      <Head>
        <title>Chỉnh sửa tài khoản</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Modal
        opened={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <SaveNotificationModal
          loading={isSaving}
          title="Xác nhân lưu thông tin"
          message={`Bạn có chắc muốn lưu thông tin chứ?`}
          callBack={() => onSave(data)}
          buttonLabel="Xác nhận lưu"
          colorButton="green"
        />
      </Modal>


      <Modal
        opened={isSaveAccountModalOpen}
        onClose={() => setIsSaveAccountModalOpen(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <SaveNotificationModal
          loading={isSavingAccount}
          title="Xác nhân lưu thông tin"
          message={`Bạn có chắc muốn lưu thông tin chứ?`}
          callBack={() => onSaveAccount(dataAccount)}
          buttonLabel="Xác nhận lưu"
          colorButton="green"
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
        <Container size="xl" style={{ width: "100%" }} p={isMobile ? 8 : 20}>
          <Title order={2} mb={5} transform="uppercase" color="#444" align="center">
            Chỉnh sửa tài khoản
          </Title>
          <Container size="xl" p={0} mb={40} style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%"
          }}>
            <Button onClick={() => setActive(1)} variant={active === 1 ? "filled" : "subtle"}>
              Thông tin cá nhân
            </Button>
            <Button onClick={() => setActive(2)} variant={active === 2 ? "filled" : "subtle"}>
              Thông tin tài khoản
            </Button>
          </Container>
          {active === 1 && (
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
                  src={getAvatarImageUrl(currentUserEmployee?.worker.user.avatar)}
                  alt="Hình đại diện"
                />
                <FileInput
                  accept="image/*"
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
              <Container p={0} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                <Button color="green" type="submit">Lưu thông tin</Button>
              </Container>
              <Space h={40} />
            </form>
          )}

          {active === 2 && (
            <form
              style={{ maxWidth: "500px", margin: "auto" }}
              onSubmit={updateAccountForm.onSubmit((values) => onSubmitAccount(values))}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Tên đăng nhập"
                label="Tên đăng nhập"
                withAsterisk
                {...updateAccountForm.getInputProps("username")}
              />
              <Space h={10} />
              <PasswordInput
                style={{ flex: 1 }}
                placeholder="Mật khẩu hiện tại"
                label="Mật khẩu hiện tại"
                withAsterisk
                {...updateAccountForm.getInputProps("oldPassword")}
              />
              <Space h={10} />
              <PasswordInput
                style={{ flex: 1 }}
                placeholder="Mật khẩu mới"
                label="Mật khẩu mới"
                {...updateAccountForm.getInputProps("newPassword")}
              />
              <Space h={10} />
              <PasswordInput
                style={{ flex: 1 }}
                placeholder="Nhập lại mật khẩu"
                label="Xác nhận mật khẩu"
                {...updateAccountForm.getInputProps("repeatNewPassword")}
              />
              <Space h={40} />
              <Container p={0} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                <Button color="green" type="submit">Lưu thông tin</Button>
              </Container>
              <Space h={40} />
            </form>
          )}
        </Container>
      )}
    </>
  );
}


export default EmployeeModifyPersonalScreen;
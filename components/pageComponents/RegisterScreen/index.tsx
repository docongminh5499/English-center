import {
  TextInput,
  Select,
  Button,
  Group,
  Box,
  Stepper,
  Text,
  PasswordInput,
  Loader,
  Table,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconInfoCircle, IconUserCircle, IconCircleCheck } from "@tabler/icons";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../helpers/api";
import { Gender, Url, UserRole } from "../../../helpers/constants";
import 'dayjs/locale/vi';
import styles from "./register.module.css";

interface IProps {}

const RegisterScreen = (props: IProps) => {

  //Stepper
  const [active, setActive] = useState(0);
  const [loadingStep, setLoadingStep] = useState(false);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  const nextStep = async () => {
    if (active == 0) {
      form1.validate();
      if (form1.isValid()) {
        //check email
        const response = await API.get(Url.users.checkOldEmail, {
          email: form1.values.email,
        });
        console.log(response);
        if (response.isOldEmail === true) {
          form1.setErrors({
            email: "Email đã được sử dụng , vui lòng nhập email khác.",
          });
          return;
        }
        //============================================================
        setActive((current) => (current < 2 ? current + 1 : current));
        console.log("Form 1 is valid");
      }
    } else if (active == 1) {
      form2.validate();
      if (form2.isValid()) {
        setLoadingStep(true);
        console.log("Form 2 is valid");
        console.log("Send API Here!");
        try {
          await API.post(Url.users.signUp, {
            userInfo: form1.values,
            accountInfo: form2.values,
          });
          setActive((current) => (current < 2 ? current + 1 : current));
          setCompleted(true);
          await router.push("/login");
        } catch (error: any) {
          if (error.status && error.status == 409) {
            form2.setErrors({ username: "Username đã tồn tại!" });
          } else {
            toast.error("Hệ thống gặp sự cố. Vui lòng thử lại sau!");
          }
        } finally {
          setLoadingStep(false);
        }
      }
    }
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  //First Step
  const form1 = useForm({
    initialValues: {
      email: "",
      fullName: "",
      phone: "",
      address: "",
      gender: Gender.MALE,
      role: UserRole.STUDENT,
      dateOfBirth: new Date(),
    },

    validate: {
      fullName: (value: any) =>
        value !== "" ? null : "Vui lòng nhập tên của bạn",
      email: (value: any) =>
        /^\S+@\S+$/.test(value) ? null : "Email không hợp lệ",
      phone: (value: any) =>
        /^\d{10}$/.test(value) ? null : "Số điện thoại không hợp lệ",
      address: (value: any) => (value !== "" ? null : "Vui lòng nhập đại chỉ"),
      gender: (value: any) => (value !== "" ? null : "Vui lòng chọn giới tính"),
      role: (value: any) =>
        value !== "" ? null : "Vui lòng chọn loại tài khoản",
      dateOfBirth: (value: any) =>
        value !== "" ? null : "Vui lòng chọn ngày sinh",
    },
  });

  //Second Step
  const form2 = useForm({
    initialValues: {
      username: "",
      password: "",
      repeatPassword: "",
    },

    validate: {
      username: (value) =>
        value !== "" ? null : "Vui lòng nhập tên đăng nhập",
      password: (value) =>
        value.trim().length >= 8 ? null : "Mật khẩu phải chứa hơn 8 kí tự",
      repeatPassword: (value, values) =>
        value === values.password ? null : "Mật khẩu không trùng khớp",
    },
  });

  return (
    <>
      <Head>
        <title>Đăng ký</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ width: "100%" }}>
        <Stepper
          className={styles.stepperContainer}
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
          completedIcon={<IconCircleCheck />}
          style={{ maxWidth: "700px", margin: "auto", paddingTop: "100px" }}
        >
          <Stepper.Step
            className={styles.step}
            icon={<IconInfoCircle />}
            label="Bước 1"
            description="Thông tin cá nhân"
            allowStepSelect={active > 0}
          >
            <Box className={styles.formContainer} mx="auto">
              <form>
                <TextInput
                  withAsterisk
                  label="Họ và Tên"
                  placeholder="Nhập tên của bạn"
                  {...form1.getInputProps("fullName")}
                  mt="sm"
                />

                <TextInput
                  style={{ margin: "100" }}
                  withAsterisk
                  label="Email"
                  placeholder="your@email.com"
                  {...form1.getInputProps("email")}
                  mt="sm"
                />

                <TextInput
                  withAsterisk
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại"
                  {...form1.getInputProps("phone")}
                  mt="sm"
                />

                <TextInput
                  withAsterisk
                  label="Địa chỉ"
                  placeholder="Nhập địa chỉ"
                  {...form1.getInputProps("address")}
                  mt="sm"
                />

                <Select
                  withAsterisk
                  label="Giới tính"
                  placeholder="Giới tính"
                  data={[
                    { value: Gender.MALE, label: "Nam" },
                    { value: Gender.FEMALE, label: "Nữ" },
                    { value: Gender.UNDEFINE, label: "Không xác định" },
                  ]}
                  {...form1.getInputProps("gender")}
                  mt="sm"
                />

                <DatePicker
                  withAsterisk
                  placeholder="ngày sinh"
                  label="Ngày sinh"
                  {...form1.getInputProps("dateOfBirth")}
                  locale="vi"
                  mt="sm"
                />

                <Select
                  withAsterisk
                  label="Loại tài khoản"
                  placeholder="Loại tài khoản"
                  data={[
                    { value: UserRole.STUDENT, label: "Học viên" },
                    { value: UserRole.PARENT, label: "Phụ huynh" },
                  ]}
                  {...form1.getInputProps("role")}
                  mt="sm"
                />
              </form>
            </Box>
          </Stepper.Step>

          <Stepper.Step
            className={styles.step}
            icon={<IconUserCircle />}
            label="Bước 2"
            description="Tạo tài khoản"
            allowStepSelect={active > 1}
            loading={loadingStep}
          >
            <Box className={styles.formContainer} mx="auto">
              <form>
                <TextInput
                  withAsterisk
                  label="Tên đăng nhập"
                  placeholder="Nhập tên đăng nhập"
                  {...form2.getInputProps("username")}
                  mt="md"
                />

                <PasswordInput
                  withAsterisk
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                  {...form2.getInputProps("password")}
                  mt="md"
                />

                <PasswordInput
                  withAsterisk
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu"
                  {...form2.getInputProps("repeatPassword")}
                  mt="md"
                />
              </form>
            </Box>
          </Stepper.Step>

          <Stepper.Completed>
            <Text size="xl" align="center" weight={700}>
              Tạo tài khoản thành công, hệ thống sẽ tự động đăng nhập!
            </Text>
          </Stepper.Completed>
        </Stepper>
        {!completed && (
          <Group position="center" mt="xl">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Next step</Button>
          </Group>
        )}

        {completed && (
          <Group position="center" mt="xl">
            <Loader size="lg" />
          </Group>
        )}
      </div>
    </>
  );
};

export default RegisterScreen;

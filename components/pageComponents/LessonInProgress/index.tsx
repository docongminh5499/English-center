import Head from "next/head";
import { Container, Title, Text, Image, Loader, Space, Grid, NavLink, Divider, Group, Textarea, ScrollArea, Checkbox, Select } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { UserRole } from "../../../helpers/constants";
import styles from "./LessonInProgress.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../../stores/Auth";
import Button from "../../commons/Button";
import Table from "../../commons/Table";
import { useMediaQuery } from "@mantine/hooks";

interface IProps {
  userRole?: UserRole | null;
}

const TempleteScreen = (props: IProps) => {
  const [authState] = useAuth();
  const router = useRouter();
  const [didMount, setDidMount] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isSmallTablet = useMediaQuery('(max-width: 768px)');
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');

  useEffect(() => {
    setDidMount(true);
  }, []);

  useEffect(() => {
    if (authState.loggingOut) return;

    if (props.userRole === UserRole.TEACHER)
      router.replace("/teacher/course");
    else if (props.userRole === UserRole.EMPLOYEE)
      router.replace("/employee");
    else if (props.userRole === UserRole.STUDENT)
      router.push("/student/timetable");

    // TODO: Another user role

  }, [props.userRole]);

  const TemplateCheckBoxStudy = () => {
    return <Checkbox
      onChange={() => {}}
      transitionDuration={0}
    />
  }

  const TemplateCheckBoxAbsent = () => {
    return <Checkbox
      onChange={() => {}}
      transitionDuration={0}
    />
  }

  return (
    <>
      <Head>
        <title>Buổi học đang diễn ra</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {didMount && (
          <Container size="xl" style={{ width: "100%" }}>
          <Title transform="uppercase" color="#222222" size="2.6rem" mt={20} align="left">
            Bài 1: Thì hiện tại đơn
          </Title>
          <Text weight={600} color="#666666" style={{ fontSize: '1.6rem' }} align="justify">
            Khóa học IELTS 6.0+
          </Text>
          <Space h={30} />
          <div className={styles.wrapRowInfoTeacher}>
            <div className={styles.colInfoTeacher}>
              <div style={{ display: 'flex'}}>
                <Text color="#222222" style={{ flexShrink : 0 }}>Trợ giảng:</Text>
                <Space w={15} />
                <Text color="#222222">Nguyễn Văn A</Text>
              </div>
              <button className={styles.buttonChangeTeacher}  
                onClick={() => {}}>
                  Thay đổi
              </button>
            </div>
            <div className={styles.colDateLesson}>
            <Text color="#222222">Ngày</Text>
            <DatePicker
                placeholder="Ngày học"
                // withAsterisk
                // {...form1.getInputProps("dateOfBirth")}
                locale="vi"
                mt="sm"
              />
            </div>
          </div>
          <div className={styles.wrapRowTimeLesson}>
            <div className={styles.colTimeLesson}>
              <Text className={styles.txt} color="#222222">Ca học: </Text>
              <Select
                placeholder="Bắt đầu"
                data={[
                  { value: UserRole.STUDENT, label: "Ca 1 (10:00 - 12: 00)" },
                ]}
                mt="sm"
              />
            </div>
            <div className={styles.colTimeLesson}>
              <Text className={styles.txt} color="#222222">Đến: </Text>
              <Select
                placeholder="Kết thúc"
                data={[
                  { value: UserRole.STUDENT, label: "Ca 2 (12:00 - 14: 00)" },
                ]}
                mt="sm"
              />
            </div>
          </div>
          
          <Space h={15} />
          <Text color="#222222" weight={700} style={{ fontSize: "1.8rem" }}>Ghi chú</Text>
          <Space h={10} />
          <Textarea
            // withAsterisk
            placeholder="Ghi chú về buổi học"
            minRows={6}
            // {...sendNotificationForm.getInputProps('notification')}
          />

          <Space h={20} />
          <Text color="#222222" weight={700} style={{ fontSize: "1.8rem" }}>Điểm danh</Text>
          <Space h={20} />
          <Table
            columnTable={[
              { _idColumn : 'hoTen', titleColumn: 'Họ và tên', widthColumn : '150px' },
              { _idColumn : 'mshv', titleColumn: 'MSHV', widthColumn : '100px' },
              { _idColumn : 'hocBu', titleColumn: 'Học bù', widthColumn : '100px' },
              { _idColumn : 'vang', titleColumn: 'Vắng', widthColumn : '50px' },
              { _idColumn : 'ghiChu', titleColumn: 'Ghi chú', widthColumn : 'auto' },
            ]}
            rowTable={[
              [
                { _idColumn: 'hoTen', valueRow: 'Nguyễn Văn A' },
                { _idColumn: 'mshv', valueRow: 'MSHV001' },
                { _idColumn: 'hocBu', templateRow: <TemplateCheckBoxStudy/> },
                { _idColumn: 'vang', valueRow: <TemplateCheckBoxAbsent/> },
                { _idColumn: 'ghiChu', valueRow: 'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
              ],
              [
                { _idColumn: 'hoTen', valueRow: 'Nguyễn Văn A' },
                { _idColumn: 'mshv', valueRow: 'MSHV001' },
                { _idColumn: 'hocBu', templateRow: <TemplateCheckBoxStudy/> },
                { _idColumn: 'vang', valueRow: <TemplateCheckBoxAbsent/> },
                { _idColumn: 'ghiChu', valueRow: 'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
              ],
              [
                { _idColumn: 'hoTen', valueRow: 'Nguyễn Văn A' },
                { _idColumn: 'mshv', valueRow: 'MSHV001' },
                { _idColumn: 'hocBu', templateRow: <TemplateCheckBoxStudy/> },
                { _idColumn: 'vang', valueRow: <TemplateCheckBoxAbsent/> },
                { _idColumn: 'ghiChu', valueRow: 'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
              ],
              [
                { _idColumn: 'hoTen', valueRow: 'Nguyễn Văn A' },
                { _idColumn: 'mshv', valueRow: 'MSHV001' },
                { _idColumn: 'hocBu', templateRow: <TemplateCheckBoxStudy/> },
                { _idColumn: 'vang', valueRow: <TemplateCheckBoxAbsent/> },
                { _idColumn: 'ghiChu', valueRow: 'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
              ],
              [
                { _idColumn: 'hoTen', valueRow: 'Nguyễn Văn A' },
                { _idColumn: 'mshv', valueRow: 'MSHV001' },
                { _idColumn: 'hocBu', templateRow: <TemplateCheckBoxStudy/> },
                { _idColumn: 'vang', valueRow: <TemplateCheckBoxAbsent/> },
                { _idColumn: 'ghiChu', valueRow: 'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
              ],
              [
                { _idColumn: 'hoTen', valueRow: 'Nguyễn Văn A' },
                { _idColumn: 'mshv', valueRow: 'MSHV001' },
                { _idColumn: 'hocBu', templateRow: <TemplateCheckBoxStudy/> },
                { _idColumn: 'vang', valueRow: <TemplateCheckBoxAbsent/> },
                { _idColumn: 'ghiChu', valueRow: 'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
              ],
              [
                { _idColumn: 'hoTen', valueRow: 'Nguyễn Văn A' },
                { _idColumn: 'mshv', valueRow: 'MSHV001' },
                { _idColumn: 'hocBu', templateRow: <TemplateCheckBoxStudy/> },
                { _idColumn: 'vang', valueRow: <TemplateCheckBoxAbsent/> },
                { _idColumn: 'ghiChu', valueRow: 'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
              ],
              [
                { _idColumn: 'hoTen', valueRow: 'Nguyễn Văn A' },
                { _idColumn: 'mshv', valueRow: 'MSHV001' },
                { _idColumn: 'hocBu', templateRow: <TemplateCheckBoxStudy/> },
                { _idColumn: 'vang', valueRow: <TemplateCheckBoxAbsent/> },
                { _idColumn: 'ghiChu', valueRow: 'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
              ],
              [
                { _idColumn: 'hoTen', valueRow: 'Nguyễn Văn A' },
                { _idColumn: 'mshv', valueRow: 'MSHV001' },
                { _idColumn: 'hocBu', templateRow: <TemplateCheckBoxStudy/> },
                { _idColumn: 'vang', valueRow: <TemplateCheckBoxAbsent/> },
                { _idColumn: 'ghiChu', valueRow: 'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
              ],
              [
                { _idColumn: 'hoTen', valueRow: 'Nguyễn Văn A' },
                { _idColumn: 'mshv', valueRow: 'MSHV001' },
                { _idColumn: 'hocBu', templateRow: <TemplateCheckBoxStudy/> },
                { _idColumn: 'vang', valueRow: <TemplateCheckBoxAbsent/> },
                { _idColumn: 'ghiChu', valueRow: 'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
              ],
              [
                { _idColumn: 'hoTen', valueRow: 'Nguyễn Văn A' },
                { _idColumn: 'mshv', valueRow: 'MSHV001' },
                { _idColumn: 'hocBu', templateRow: <TemplateCheckBoxStudy/> },
                { _idColumn: 'vang', valueRow: <TemplateCheckBoxAbsent/> },
                { _idColumn: 'ghiChu', valueRow: 'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
              ],
              [
                { _idColumn: 'hoTen', valueRow: 'Nguyễn Văn A' },
                { _idColumn: 'mshv', valueRow: 'MSHV001' },
                { _idColumn: 'hocBu', templateRow: <TemplateCheckBoxStudy/> },
                { _idColumn: 'vang', valueRow: <TemplateCheckBoxAbsent/> },
                { _idColumn: 'ghiChu', valueRow: 'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
              ],
            ]}
            heightTable={isMobile ? 500 : 300}
          />

          <Container my={20} style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
            <Button onClick={() => {}}
            >Lưu thông tin</Button>
            <Button onClick={() => {}} color='red'>
            Kết thúc buổi học
            </Button>
          </Container>
          </Container>
      )}
    </>
  );
};

export default TempleteScreen;

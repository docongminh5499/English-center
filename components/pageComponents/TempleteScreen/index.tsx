import Head from "next/head";
import { Container, Title, Text, Image, Loader, Space, Grid, NavLink, Divider, Group, Textarea, ScrollArea, Checkbox } from "@mantine/core";
import { UserRole } from "../../../helpers/constants";
import styles from "./historyDetailsLesson.module.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";
import { useAuth } from "../../../stores/Auth";
import Button from "../../commons/Button";
import Table from "../../commons/Table";
import { useMediaQuery } from "@mantine/hooks";

interface IProps {
  userRole?: UserRole | null;
}

const dataTableTest = []

const TempleteScreen = (props: IProps) => {
  const [authState] = useAuth();
  const router = useRouter();
  const [didMount, setDidMount] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isSmallTablet = useMediaQuery('(max-width: 768px)');

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
        <title>Chi tiết lịch sử buổi học</title>
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
          <Grid>
            <Grid.Col span={isSmallTablet ? 12 : 4}>
              <Group position={isSmallTablet ? "apart" : "left"}>
                <Text color="#222222" mr={5}>Trợ giảng:</Text>
                <Text color="#222222">Nguyễn Văn A</Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={isSmallTablet ? 12 : 4}>
              <Group position={isSmallTablet ? 'apart' : 'center'}>
                <Text color="#222222" mr={5}>Ngày: </Text>
                <Text color="#222222">01/01/2022</Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={isSmallTablet ? 12 : 4}>
              <Group position={isSmallTablet ? 'apart' : 'right'} align="flex-start" >
                <Text color="#222222" mr={5}>Ca học: </Text>
                <div>
                  <Text color="#222222" >Ca 1-2</Text>
                  <Text color="#434343" size={12}>10:00 - 12:00</Text>
                </div>
              </Group>
            </Grid.Col>
          </Grid>
          <Space h={15} />
          <Text color="#222222" weight={700} style={{ fontSize: "1.8rem" }}>Ghi chú</Text>
          <Container
            p={0}
            pt={10}
            size="xl"
            style={{ color: "#222222", textAlign: "justify" }}
            dangerouslySetInnerHTML={{ __html: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>` }} />
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

          <Container my={20} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={() => {}}
            >Chỉnh sửa</Button>
          </Container>
          </Container>
      )}
    </>
  );
};

export default TempleteScreen;

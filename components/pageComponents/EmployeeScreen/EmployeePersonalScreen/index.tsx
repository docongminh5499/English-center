import { Anchor, Container, Divider, Grid, Group, Image, Loader, ScrollArea, Space, Table, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TimeZoneOffset, UserRole } from "../../../../helpers/constants";
import { formatCurrency } from "../../../../helpers/formatCurrency";
import { getGenderName } from "../../../../helpers/getGenderName";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";
import Salary from "../../../../models/salary.model";
import UserEmployee from "../../../../models/userEmployee.model";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";


interface IProps {
  userRole?: UserRole | null;
  userEmployee: UserEmployee | null;
  salaries: { total: number, salaries: Salary[] };
}


const EmployeePersonalScreen = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const [didMount, setDidMount] = useState(false);
  const router = useRouter();


  useEffect(() => {
    if (props.userEmployee === null)
      router.replace('/not-found');
    else setDidMount(true);
  }, []);


  return (
    <>
      <Head>
        <title>Tài khoản cá nhân</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


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
          <Container style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Image
              withPlaceholder
              placeholder={
                <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "300px" }}>
                  <Loader variant="dots" />
                </Container>
              }
              style={{ maxWidth: "300px" }}
              radius="md"
              src={getAvatarImageUrl(props.userEmployee?.worker.user.avatar)}
              alt="Hình đại diện"
            />
          </Container>
          <Space h={20} />
          <Grid>
            <Grid.Col span={isLargeTablet ? 12 : 5}>
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Họ và tên: </Text>
                <Text color="#444">{props.userEmployee?.worker.user.fullName}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Giới tính: </Text>
                <Text color="#444">{getGenderName(props.userEmployee?.worker.user.sex)}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Ngày sinh: </Text>
                <Text color="#444">
                  {moment(props.userEmployee?.worker.user.dateOfBirth)
                    .utcOffset(TimeZoneOffset)
                    .format("DD/MM/YYYY")}
                </Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>CMND/CCCD: </Text>
                <Text color="#444">{props.userEmployee?.worker.passport}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Dân tộc: </Text>
                <Text color="#444">{props.userEmployee?.worker.nation}</Text>
              </Group>
            </Grid.Col>
            {!isLargeTablet && (
              <Grid.Col span={2}></Grid.Col>
            )}
            <Grid.Col span={isLargeTablet ? 12 : 5}>
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Nguyên quán: </Text>
                <Text color="#444">{props.userEmployee?.worker.homeTown}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Địa chỉ: </Text>
                <Text color="#444">{props.userEmployee?.worker.user.address || "-"}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Email: </Text>
                <Text color="#444">{props.userEmployee?.worker.user.email || "-"}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Số điện thoại: </Text>
                <Text color="#444">{props.userEmployee?.worker.user.phone || "-"}</Text>
              </Group>
            </Grid.Col>
          </Grid>

          <Space h={40} />
          <Text color="#444" weight={700} style={{ fontSize: "1.8rem" }}>Chi nhánh làm việc</Text>
          <Divider />
          <Group position="apart">
            <Text weight={600} color="#444" mr={5}>Tên chi nhánh: </Text>
            <Text color="#444">{props.userEmployee?.worker.branch.name}</Text>
          </Group>
          <Space h={10} />
          <Group position="apart">
            <Text weight={600} color="#444" mr={5}>Địa chỉ: </Text>
            <Text color="#444">{props.userEmployee?.worker.branch.address}</Text>
          </Group>
          <Space h={10} />
          <Group position="apart">
            <Text weight={600} color="#444" mr={5}>Số điện thoại: </Text>
            <Text color="#444">{props.userEmployee?.worker.branch.phoneNumber}</Text>
          </Group>
          <Space h={10} />
          <Group position="apart">
            <Text weight={600} color="#444" mr={5}>Quản lý: </Text>
            <Text color="#444">{props.userEmployee?.worker.branch.userEmployee?.worker.user.fullName ?
              `${props.userEmployee?.worker.branch.userEmployee.worker.user.fullName} (MSNV: ${props.userEmployee?.worker.branch.userEmployee.worker.user.id})` :
              "-"}</Text>
          </Group>
          <Space h={10} />
          <Group position="apart">
            <Text weight={600} color="#444" mr={5}>Quản lý học vụ: </Text>
            <Text color="#444">{props.userEmployee?.worker.branch.userTeacher?.worker.user.fullName ?
              `${props.userEmployee?.worker.branch.userTeacher.worker.user.fullName} (MSGV: ${props.userEmployee?.worker.branch.userTeacher?.worker.user.id})` :
              "-"}</Text>
          </Group>
          <Space h={40} />
          <Group position="apart">
            <Text color="#444" weight={700} style={{ fontSize: "1.8rem" }}>Lương</Text>
            {props.salaries.total > props.salaries.salaries.length && (
              <Anchor component="button" onClick={() => router.push("/employee/personal/salaries")}>
                Xem tất cả
              </Anchor>
            )}
          </Group>
          <Divider />
          {props.salaries.salaries.length === 0 && (
            <Container style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100px"
            }}>
              <Text style={{ fontSize: "2.4rem", color: "#CED4DA" }} weight={600}>
                Không có dữ liệu
              </Text>
            </Container>
          )}

          {props.salaries.salaries.length > 0 && (
            <ScrollArea style={{ width: "100%" }}>
              <Table verticalSpacing="xs" highlightOnHover style={{ width: "100%", minWidth: "900px" }}>
                <thead>
                  <tr>
                    <th>Mã giao dịch</th>
                    <th>Nội dung</th>
                    <th>Số tiền</th>
                    <th>Ngày giao dịch</th>
                    <th>Người giao dịch</th>
                  </tr>
                </thead>
                <tbody>
                  {props.salaries.salaries.map((salary, index) => (
                    <tr key={index}>
                      <td>{salary.transCode.transCode}</td>
                      <td>{salary.transCode.content}</td>
                      <td>{formatCurrency(salary.transCode.amount)}</td>
                      <td>{moment(salary.transCode.payDate).utcOffset(TimeZoneOffset).format("HH:mm:ss DD/MM/YYYY")}</td>
                      <td>{salary.transCode.userEmployee.worker.user.fullName}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ScrollArea>
          )}
          <Space h={40} />
          <Container p={0} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button onClick={() => router.push("/modify-personal")}>Chỉnh sửa</Button>
          </Container>
          <Space h={40} />
        </Container>
      )}
    </>);
}


export default EmployeePersonalScreen;
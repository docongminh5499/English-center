import { Container, Divider, Grid, Group, Image, Loader, Space, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TimeZoneOffset, UserRole } from "../../../../helpers/constants";
import { getGenderName } from "../../../../helpers/getGenderName";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";
import UserTeacher from "../../../../models/userTeacher.model";
import Button from "../../../commons/Button";


interface IProps {
  userRole?: UserRole | null;
  userTeacher: UserTeacher | null;
}


const TeacherPersonalScreen = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const [didMount, setDidMount] = useState(false);
  const router = useRouter();


  useEffect(() => {
    if (props.userTeacher === null)
      router.replace('/not-found');
    else setDidMount(true);
  }, []);


  return (
    <>
      <Head>
        <title>Tài khoản cá nhân</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
              src={getAvatarImageUrl(props.userTeacher?.worker.user.avatar)}
              alt="Hình đại diện"
            />
          </Container>
          <Space h={20} />
          <Grid>
            <Grid.Col span={isLargeTablet ? 12 : 5}>
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Họ và tên: </Text>
                <Text color="#444">{props.userTeacher?.worker.user.fullName}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Giới tính: </Text>
                <Text color="#444">{getGenderName(props.userTeacher?.worker.user.sex)}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Ngày sinh: </Text>
                <Text color="#444">
                  {moment(props.userTeacher?.worker.user.dateOfBirth)
                    .utcOffset(TimeZoneOffset)
                    .format("DD/MM/YYYY")}
                </Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>CMND/CCCD: </Text>
                <Text color="#444">{props.userTeacher?.worker.passport}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Dân tộc: </Text>
                <Text color="#444">{props.userTeacher?.worker.nation}</Text>
              </Group>
            </Grid.Col>
            {!isLargeTablet && (
              <Grid.Col span={2}></Grid.Col>
            )}
            <Grid.Col span={isLargeTablet ? 12 : 5}>
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Nguyên quán: </Text>
                <Text color="#444">{props.userTeacher?.worker.homeTown}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Địa chỉ: </Text>
                <Text color="#444">{props.userTeacher?.worker.user.address}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Email: </Text>
                <Text color="#444">{props.userTeacher?.worker.user.email}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>Số điện thoại: </Text>
                <Text color="#444">{props.userTeacher?.worker.user.phone}</Text>
              </Group>
            </Grid.Col>
          </Grid>

          <Space h={40} />
          <Text color="#444" weight={700} style={{ fontSize: "1.8rem" }}>Chi nhánh làm việc</Text>
          <Divider />
          <Group position="apart">
            <Text weight={600} color="#444" mr={5}>Tên chi nhánh: </Text>
            <Text color="#444">{props.userTeacher?.worker.branch.name}</Text>
          </Group>
          <Space h={10} />
          <Group position="apart">
            <Text weight={600} color="#444" mr={5}>Địa chỉ: </Text>
            <Text color="#444">{props.userTeacher?.worker.branch.address}</Text>
          </Group>
          <Space h={10} />
          <Group position="apart">
            <Text weight={600} color="#444" mr={5}>Số điện thoại: </Text>
            <Text color="#444">{props.userTeacher?.worker.branch.phoneNumber}</Text>
          </Group>

          <Space h={40} />
          <Text color="#444" weight={700} style={{ fontSize: "1.8rem" }}>Kỹ năng chuyên môn</Text>
          <Divider />
          <Container
            p={0}
            pt={10}
            size="xl"
            style={{ color: "#444", textAlign: "justify" }}
            dangerouslySetInnerHTML={{ __html: props.userTeacher?.shortDesc || "" }} />

          <Space h={40} />
          <Text color="#444" weight={700} style={{ fontSize: "1.8rem" }}>Kinh nghiệm giảng dạy</Text>
          <Divider />
          <Container
            p={0}
            pt={10}
            size="xl"
            style={{ color: "#444", textAlign: "justify" }}
            dangerouslySetInnerHTML={{ __html: props.userTeacher?.experience || "" }} />

          <Space h={40} />
          <Container p={0} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button onClick={() => router.push("/modify-personal")}>Chỉnh sửa</Button>
          </Container>
          <Space h={40} />
        </Container>
      )}
    </>);
}


export default TeacherPersonalScreen;
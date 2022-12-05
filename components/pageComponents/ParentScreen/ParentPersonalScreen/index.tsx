import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Input,
  Loader,
  Modal,
  Space,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TimeZoneOffset, Url } from "../../../../helpers/constants";
import { getGenderName } from "../../../../helpers/getGenderName";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";

const ParentPersonalScreen = (props: any) => {
  const isLargeTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 480px)");
  const [didMount, setDidMount] = useState(false);
  const router = useRouter();

  const [authState] = useAuth();

  useEffect(() => {
    if (props.userParent === null) router.replace("/not-found");
    else setDidMount(true);
  }, []);

	console.log(props.userParent.userStudents)

	let studentRows = <></>;

	if (props.userParent.userStudents !== null) {
		studentRows = props.userParent.userStudents.map((userStudent: any) => {
			return (
				<Box mt={"sm"} key={userStudent.user.id}>
					<Grid>
						<Grid.Col span={2}>
							<Image
								withPlaceholder
								placeholder={
									<Container style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "150px" }}>
										<Loader variant="dots" />
									</Container>
								}
								style={{ maxWidth: "150px" }}
								radius="md"
								src={getAvatarImageUrl(userStudent.user.avatar)}
								alt="Hình đại diện"
							/>
						</Grid.Col>
						<Grid.Col span={4}>
							<Group position="apart">
								<Text weight={600} color="#444" mr={5}>Họ và tên: </Text>
								<Text color="#444">{userStudent.user.fullName}</Text>
							</Group>
							<Space h={10} />
							<Group position="apart">
								<Text weight={600} color="#444" mr={5}>Giới tính: </Text>
								<Text color="#444">{getGenderName(userStudent.user.sex)}</Text>
							</Group>
							<Space h={10} />
							<Group position="apart">
								<Text weight={600} color="#444" mr={5}>Ngày sinh: </Text>
								<Text color="#444">
									{moment(userStudent.user.dateOfBirth)
										.utcOffset(TimeZoneOffset)
										.format("DD/MM/YYYY")}
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col span={2}></Grid.Col>
						<Grid.Col span={4}>
							<Group position="apart">
								<Text weight={600} color="#444" mr={5}>Địa chỉ: </Text>
								<Text color="#444">{userStudent.user.address}</Text>
							</Group>
							<Space h={10} />
							<Group position="apart">
								<Text weight={600} color="#444" mr={5}>Email: </Text>
								<Text color="#444">{userStudent.user.email || "-"}</Text>
							</Group>
							<Space h={10} />
							<Group position="apart">
								<Text weight={600} color="#444" mr={5}>Số điện thoại: </Text>
								<Text color="#444">{userStudent.user.phone || "-"}</Text>
							</Group>
						</Grid.Col>
					</Grid>
				</Box>
			)
		})
	}

  return (
    <>
      <Head>
        <title>Tài khoản cá nhân</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!didMount && (
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading />
        </Container>
      )}

      {didMount && (
        <Container size="xl" style={{ width: "100%" }} p={isMobile ? 8 : 20}>
          <Title order={1} align="center" mb={"sm"}>
            Thông tin cá nhân
          </Title>
          <Container
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              withPlaceholder
              placeholder={
                <Container
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "300px",
                  }}
                >
                  <Loader variant="dots" />
                </Container>
              }
              style={{ maxWidth: "300px" }}
              radius="md"
              src={getAvatarImageUrl(props.userParent?.user.avatar)}
              alt="Hình đại diện"
            />
          </Container>
          <Space h={20} />
          <Grid>
            <Grid.Col span={isLargeTablet ? 12 : 5}>
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Họ và tên:{" "}
                </Text>
                <Text color="#444">{props.userParent?.user.fullName}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Giới tính:{" "}
                </Text>
                <Text color="#444">
                  {getGenderName(props.userParent?.user.sex)}
                </Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Ngày sinh:{" "}
                </Text>
                <Text color="#444">
                  {moment(props.userParent?.user.dateOfBirth)
                    .utcOffset(TimeZoneOffset)
                    .format("DD/MM/YYYY")}
                </Text>
              </Group>
            </Grid.Col>
            {!isLargeTablet && <Grid.Col span={2}></Grid.Col>}
            <Grid.Col span={isLargeTablet ? 12 : 5}>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Địa chỉ:{" "}
                </Text>
                <Text color="#444">{props.userParent?.user.address}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Email:{" "}
                </Text>
                <Text color="#444">{props.userParent?.user.email || "-"}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Số điện thoại:{" "}
                </Text>
                <Text color="#444">{props.userParent?.user.phone || "-"}</Text>
              </Group>
            </Grid.Col>
          </Grid>

          <Space h={20} />
          <Container
            p={0}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button onClick={() => router.push("/modify-personal")}>
              Chỉnh sửa
            </Button>
          </Container>
          <Space h={20} />

          <Space h={40} />
          <Text color="#444" weight={700} style={{ fontSize: "1.8rem" }}>
            Thông tin học sinh phụ thuộc
          </Text>
          <Divider />

					{(props.userParent.userStudents === null || props.userParent.userStudents.length === 0) &&
						<Group mt={"sm"} grow align={"center"}>
							<Title order={3} color="gray" align="center">Bạn chưa có học sinh phụ thuộc.</Title>
						</Group>
					}

					{(props.userParent.userStudents !== null || props.userParent.userStudents.length !== 0) &&
						<Box mt="sm">
							{studentRows}
						</Box>
					}

        </Container>
      )}
    </>
  );
};

export default ParentPersonalScreen;

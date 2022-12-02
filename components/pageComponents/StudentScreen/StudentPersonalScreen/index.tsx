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
import { IconTrash } from "@tabler/icons";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { TimeZoneOffset, Url } from "../../../../helpers/constants";
import { getGenderName } from "../../../../helpers/getGenderName";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";

const StudentPersonalScreen = (props: any) => {
  const isLargeTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 480px)");
  const [didMount, setDidMount] = useState(false);
  const router = useRouter();

  const [authState] = useAuth();
  const [addParentModal, setAddParentModal] = useState(false);
  const [parentSearchValue, setParentSearchValue] = useState("");
  const [parentList, setParentList] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [confirmDeleteParent, setConfirmDeleteParent] = useState(false);

  useEffect(() => {
    if (props.userTeacher === null) router.replace("/not-found");
    else setDidMount(true);
  }, []);

  const findParent = async () => {
    try {
      const parentListResponse = await API.get(Url.students.getParentList, {
        token: authState.token,
        searchValue: parentSearchValue,
      });
      console.log(parentListResponse);
      setParentList(parentListResponse);
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống gặp sự cố, vui lòng thử lại sau!");
    }
  };

  const addParent = async () => {
    try {
      if (selectedParent === null) {
        return;
      }
      const response = await API.post(Url.students.addParent, {
        token: authState.token,
        parentId: selectedParent.user.id,
      });
      props.userStudent.userParent = response;
      console.log(response);
      toast.success("Thêm phụ huynh thành công");
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống gặp sự cố, vui lòng thử lại sau!");
    } finally {
      setParentSearchValue("");
      setParentList(null);
      setSelectedParent(null);
      setAddParentModal(false);
    }
  };
  const deleteParent = async () => {
    try {
      if (props.userStudent?.userParent === null) {
        return;
      }
      const response = await API.post(Url.students.deleteParent, {
        token: authState.token,
        parentId: props.userStudent?.userParent.user.id,
      });
      props.userStudent.userParent = null;
      console.log(response);
      if (response === true) toast.success("Xóa phụ huynh thành công");
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống gặp sự cố, vui lòng thử lại sau!");
    } finally {
      setConfirmDeleteParent(false);
    }
  };

  let parentRows = <></>;

  if (parentList !== null) {
    parentRows = parentList.map((userParent: any) => {
      return (
        <Container
          mt={"sm"}
          key={userParent.user.id}
          onClick={() => setSelectedParent(userParent)}
          style={{
            background:
              selectedParent !== null &&
              userParent.user.id === selectedParent.user.id
                ? "#E7E5E8"
                : "white",
          }}
        >
          <Group>
            <Avatar src={getAvatarImageUrl(userParent.user.avatar)} />

            <div>
              <Text size="sm">{userParent.user.fullName}</Text>
              <Text size="xs" opacity={0.65}>
                {userParent.user.id}
              </Text>
            </div>
          </Group>
        </Container>
      );
    });
  }

  return (
    <>
      <Head>
        <title>Tài khoản cá nhân</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal
        zIndex={10}
        centered
        opened={confirmDeleteParent}
        onClose={() => {
          setConfirmDeleteParent(false);
        }}
      >
        <Box>
          <Title order={3} align="center">
            Xác nhận xóa người phụ thuộc?
          </Title>

          <Group position="center" mt="sm">
            <Button color={"green"} onClick={() => deleteParent()}>
              Xác nhận
            </Button>

            <Button
              color={"red"}
              ml="sm"
              onClick={() => setConfirmDeleteParent(false)}
            >
              Hủy bỏ
            </Button>
          </Group>
        </Box>
      </Modal>

      <Modal
        zIndex={10}
        centered
        opened={addParentModal}
        onClose={() => {
          setParentSearchValue("");
          setParentList(null);
          setAddParentModal(false);
          setSelectedParent(null);
        }}
      >
        <Box>
          <Title order={3}>Chọn phụ huynh bạn muốn thêm.</Title>
          <Grid mt={"sm"}>
            <Grid.Col span={9}>
              <TextInput
                value={parentSearchValue}
                onChange={(event) =>
                  setParentSearchValue(event.currentTarget.value)
                }
                placeholder="Nhập tên hoặc mã số của phụ huynh"
              />
            </Grid.Col>

            <Grid.Col span={2}>
              <Button
                onClick={() => {
                  setSelectedParent(null);
                  findParent();
                }}
              >
                Tìm kiếm
              </Button>
            </Grid.Col>
          </Grid>
          {parentList === null && (
            <Group align={"center"} position="center" grow>
              <Title order={3} color="gray" mt="sm" align="center">
                Không tìm thấy kết quả nào.
              </Title>
            </Group>
          )}

          {parentList !== null && (
            <Box>
              {parentRows}
              <Group position="center">
                <Button color="green" mt={"md"} onClick={() => addParent()}>
                  Thêm
                </Button>
              </Group>
            </Box>
          )}
        </Box>
      </Modal>

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
              src={getAvatarImageUrl(props.userStudent?.user.avatar)}
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
                <Text color="#444">{props.userStudent?.user.fullName}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Giới tính:{" "}
                </Text>
                <Text color="#444">
                  {getGenderName(props.userStudent?.user.sex)}
                </Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Ngày sinh:{" "}
                </Text>
                <Text color="#444">
                  {moment(props.userStudent?.user.dateOfBirth)
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
                <Text color="#444">{props.userStudent?.user.address}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Email:{" "}
                </Text>
                <Text color="#444">{props.userStudent?.user.email || "-"}</Text>
              </Group>
              <Space h={10} />
              <Group position="apart">
                <Text weight={600} color="#444" mr={5}>
                  Số điện thoại:{" "}
                </Text>
                <Text color="#444">{props.userStudent?.user.phone || "-"}</Text>
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
            Thông tin phụ huynh
          </Text>
          <Divider />

          {props.userStudent.userParent !== null && (
            <Box mt={"sm"}>
              <Grid>
                <Grid.Col span={2}>
                  <Image
                    withPlaceholder
                    placeholder={
                      <Container
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          maxWidth: "150px",
                        }}
                      >
                        <Loader variant="dots" />
                      </Container>
                    }
                    style={{ maxWidth: "150px" }}
                    radius="md"
                    src={getAvatarImageUrl(
                      props.userStudent?.userParent.user.avatar
                    )}
                    alt="Hình đại diện"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Group position="apart">
                    <Text weight={600} color="#444" mr={5}>
                      Họ và tên:{" "}
                    </Text>
                    <Text color="#444">{props.userStudent?.user.fullName}</Text>
                  </Group>
                  <Space h={10} />
                  <Group position="apart">
                    <Text weight={600} color="#444" mr={5}>
                      Giới tính:{" "}
                    </Text>
                    <Text color="#444">
                      {getGenderName(props.userStudent?.user.sex)}
                    </Text>
                  </Group>
                  <Space h={10} />
                  <Group position="apart">
                    <Text weight={600} color="#444" mr={5}>
                      Ngày sinh:{" "}
                    </Text>
                    <Text color="#444">
                      {moment(props.userStudent?.user.dateOfBirth)
                        .utcOffset(TimeZoneOffset)
                        .format("DD/MM/YYYY")}
                    </Text>
                  </Group>
                </Grid.Col>
                <Grid.Col span={2}></Grid.Col>
                <Grid.Col span={4}>
                  <Group position="apart">
                    <Text weight={600} color="#444" mr={5}>
                      Địa chỉ:{" "}
                    </Text>
                    <Text color="#444">{props.userStudent?.user.address}</Text>
                  </Group>
                  <Space h={10} />
                  <Group position="apart">
                    <Text weight={600} color="#444" mr={5}>
                      Email:{" "}
                    </Text>
                    <Text color="#444">
                      {props.userStudent?.user.email || "-"}
                    </Text>
                  </Group>
                  <Space h={10} />
                  <Group position="apart">
                    <Text weight={600} color="#444" mr={5}>
                      Số điện thoại:{" "}
                    </Text>
                    <Text color="#444">
                      {props.userStudent?.user.phone || "-"}
                    </Text>
                  </Group>
                </Grid.Col>
              </Grid>

              <Group position="center">
                <Button
                  color={"red"}
                  leftIcon={<IconTrash size={14} />}
                  mt="md"
                  onClick={() => {
                    setConfirmDeleteParent(true);
                  }}
                >
                  Xóa
                </Button>
              </Group>
            </Box>
          )}

          {props.userStudent.userParent === null && (
            <Box>
              <Group mt={"sm"} grow align={"center"}>
                <Title order={3} color="gray" align="center">
                  Bạn chưa thêm phụ huynh của mình.
                </Title>
              </Group>
              <Space h={10} />
              <Container
                p={0}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={() => {
                    setAddParentModal(true);
                  }}
                >
                  Thêm
                </Button>
              </Container>
            </Box>
          )}

          <Space h={40} />
          <Text color="#444" weight={700} style={{ fontSize: "1.8rem" }}>
            Lịch sử giao dịch
          </Text>

          <Divider />
          <Space h={40} />
        </Container>
      )}
    </>
  );
};

export default StudentPersonalScreen;

import {
  Avatar,
  Box,
  Button,
  Container,
  Group,
  Modal,
  Text,
  Title,
} from "@mantine/core";
import Head from "next/head";
import { useState } from "react";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";
import { useParent } from "../../../../stores/Parent";

const SelectStudentModal = (props: any) => {
  const [opened, setOpened] = useState(true);
  const students: [] = props.students !== null ? props.students : [];
  const [parentState, setParentState] = useParent();

  return (
    <Box style={{ width: "100%" }}>
      <Modal opened={opened} onClose={() => setOpened(false)} centered withCloseButton = {false}>
        {students.length !== 0 && (
          <Box>
            <Title order={1} align="center">
              Chọn học viên mà bạn muốn theo dõi
            </Title>
            <Group position="center">
              {students.length !== 0 &&
                students.map((student: any) => {
                  return (
                    <Box
                      mt={"sm"}
                      ml={"sm"}
                      key={student.user.id}
                      onClick={() => {
                        setOpened(false);
                        setParentState.setSelectedStudent(student.user.id);
                        props.openedModal(false);
                        props.setSelectedStudent(student);
                      }}
                    >
                      <Avatar
                        m={"auto"}
                        src={getAvatarImageUrl(student.user.avatar)}
                        size={100}
                        alt="it's me"
                      />
                      <Title align="center" order={5}>
                        {student.user.fullName}
                      </Title>
                      <Text align="center">ID: {student.user.id}</Text>
                    </Box>
                  );
                })}
            </Group>
          </Box>
        )}

        {students.length === 0 && (
          <Container>
            <Title order={1} align="center">
              Bạn chưa có học viên phụ thuộc nào.
            </Title>
          </Container>
        )}
      </Modal>

      {!opened && students.length !== 0 && (
        <Container>
          <Title order={1} align="center">
            Vui lòng chọn học viên mà bạn muốn theo dõi
          </Title>
          <Group position="center" mt={"md"}>
            <Button onClick={() => setOpened(true)}>Chọn học viên</Button>
          </Group>
        </Container>
      )}

      {!opened && students.length === 0 && (
        <Container>
          <Title order={1} align="center">
            Bạn chưa có học viên phụ thuộc nào.
          </Title>
        </Container>
      )}
    </Box>
  );
};

export default SelectStudentModal;

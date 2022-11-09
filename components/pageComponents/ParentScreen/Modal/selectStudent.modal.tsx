import { Avatar, Box, Button, Container, Group, Modal, Text, Title } from "@mantine/core";
import Head from "next/head";
import { useState } from "react";
import { getAvatarImageUrl } from "../../../../helpers/image.helper";

const SelectStudentModal = (props: any) => {
  const [opened, setOpened] = useState(true);
	const students:[] = props.students !== null ? props.students : [];

  return ( 
    <Box style={{width: "100%"}}>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
				centered 
				
      >
				<Head>
					<title>Thời khóa biểu</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Title order={1} align="center">Chọn học viên mà bạn muốn theo dõi</Title>
				<Group position="center">
					{
						students.map((student:any) => {
							return (
								<Box 
									mt={"sm"} 
									ml={"sm"} 
									key={student.user.id} 
									onClick={()=> {
										setOpened(false);
										props.openedModal(false);
										props.setSelectedStudent(student);
									}}
								>
									<Avatar m={"auto"} src={getAvatarImageUrl(student.user.avatar)} size={100} alt="it's me" />
									<Title align="center" order={5}>{student.user.fullName}</Title>
									<Text align="center">ID: {student.user.id}</Text>
								</Box>
							);
						})
					}
				</Group>
      </Modal>

			{!opened &&
				<Container >
					<Title order={1} align="center">Vui lòng chọn học viên mà bạn muốn theo dõi</Title>
					<Group position="center" mt={"md"}>
						<Button onClick={()=>setOpened(true)}>Chọn học viên</Button>
					</Group>
				</Container>
			}
			
    </Box>
  );
}

export default SelectStudentModal;
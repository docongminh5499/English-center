import { Container, Space, Text } from "@mantine/core";
import Button from "../../../commons/Button";

interface IProps {
    onDelete: () => void;
}
const DeleteSessionCourseModal = ({ onDelete }: IProps) => {
    return (
        <Container p={0} style={{
            backgroundColor: "white",
            borderRadius: "5px",
            margin: "0 1rem",
        }}>
            <Text color="#444" weight={600} size="xl" align="center">XÓA BUỔI HỌC</Text>
            <Space h={20} />
            <Text color="#444" align="center">Bạn có chắc muốn xóa buổi học này chứ?</Text>
            <Space h={10} />
            <Container style={{ display: "flex", justifyContent: "center" }}>
                <Button color="red" onClick={onDelete}>Xóa buổi học</Button>
            </Container>
        </Container>
    );
};

export default DeleteSessionCourseModal;

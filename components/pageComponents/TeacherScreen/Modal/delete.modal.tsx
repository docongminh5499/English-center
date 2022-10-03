import { Container, Space, Text } from "@mantine/core";
import Button from "../../../commons/Button";

interface IProps {
    title: string;
    message: string;
    onDelete: () => void;
}
const DeleteModal = ({ title, message, onDelete }: IProps) => {
    return (
        <Container p={0} style={{
            backgroundColor: "white",
            borderRadius: "5px",
            margin: "0 1rem",
        }}>
            <Text color="#444" transform="uppercase" weight={600} style={{ fontSize: "2rem" }} align="center">{title}</Text>
            <Space h={20} />
            <Text color="#444" align="center">{message}</Text>
            <Space h={10} />
            <Container style={{ display: "flex", justifyContent: "center" }}>
                <Button color="red" onClick={onDelete}>Xác nhận xóa</Button>
            </Container>
        </Container>
    );
};

export default DeleteModal;

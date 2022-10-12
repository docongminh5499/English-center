import { Button, Container, Space, Text } from "@mantine/core";


interface IProps {
  onSave: () => void;
  onCancel: () => void;
}
const ChangeModifiedLectureModal = ({ onSave, onCancel }: IProps) => {
  return (
    <Container p={0} style={{
      backgroundColor: "white",
      borderRadius: "5px",
      margin: "0 1rem",
    }}>
      <Text color="#444" align="center">
        Bạn chưa lưu bài học hiện tại.
      </Text>
      <Space h={10} />
      <Container style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <Button color="green" onClick={onSave}>Lưu bài học</Button>
        <Button color="red" onClick={onCancel}>Không lưu</Button>
      </Container>

    </Container>
  );
};

export default ChangeModifiedLectureModal;

import { Container, Space, Text } from "@mantine/core";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";

interface IProps {
  loading?: boolean;
  callBack: () => void;
}
const OpenCourseModal = ({ loading, callBack }: IProps) => {
  return (
    <Container p={0} style={{
      backgroundColor: "white",
      borderRadius: "5px",
      margin: "0 1rem",
    }}>
      {loading && (
        <Container style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
        }}>
          <Loading />
        </Container>
      )}

      {!loading && (
        <>
          <Text color="#444" transform="uppercase" weight={600} style={{ fontSize: "2rem" }} align="center">Mở lại khóa học</Text>
          <Space h={20} />
          <Text color="#444" align="center">Bạn có chắc muốn mở lại khóa học không?</Text>
          <Space h={10} />
          <Container style={{ display: "flex", justifyContent: "center" }}>
            <Button color="green" onClick={callBack}>Xác nhận</Button>
          </Container>
        </>
      )}
    </Container>
  );
};

export default OpenCourseModal;

import { Container, Space, Text } from "@mantine/core";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";

interface IProps {
  loading?: boolean;
  title: string;
  message: string;
  buttonLabel: string;
  colorButton?: string;
  callBack: () => void;
}
const CancelModal = ({ loading, title, message, buttonLabel, colorButton, callBack }: IProps) => {
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
          <Text color="#444" transform="uppercase" weight={600} style={{ fontSize: "2rem" }} align="center">{title}</Text>
          <Space h={20} />
          <Text color="#444" align="center">{message}</Text>
          <Space h={10} />
          <Container style={{ display: "flex", justifyContent: "center" }}>
            <Button color={colorButton || "blue"} onClick={callBack}>{buttonLabel}</Button>
          </Container>
        </>
      )}
    </Container>
  );
};

export default CancelModal;

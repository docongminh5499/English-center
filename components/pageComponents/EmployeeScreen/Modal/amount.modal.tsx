import { Container, Text } from "@mantine/core";
import { formatCurrency } from "../../../../helpers/formatCurrency";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";

interface IProps {
  loading?: boolean;
  amount: number;
  title: string;
  message: string;
  callBack: () => void;
}
const AmountModal = ({ loading, callBack, amount, message, title }: IProps) => {
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
          <Text align="center" transform="uppercase" style={{ fontSize: "1.8rem" }} weight={600}>{title}</Text>
            <Text align="center">{message}</Text>
            <Text align="center" style={{ fontSize: "3rem" }} weight={700} mb={20} mt={8}>{formatCurrency(amount)}</Text>
            <Container style={{ display: "flex", justifyContent: "center" }}>
              <Button color="red" onClick={callBack}>Xác nhận</Button>
            </Container>
          </>
      )}
        </Container>
      );
};

      export default AmountModal;

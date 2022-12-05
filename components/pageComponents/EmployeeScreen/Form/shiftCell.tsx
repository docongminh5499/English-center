import { Container } from "@mantine/core";
import { useHover } from "@mantine/hooks";


interface IProps {
  active: boolean;
  firstCellRow: boolean;
  firstCellCol: boolean;
  disbaled: boolean;
  onClick: () => void;
}

const ShiftCell = (props: IProps) => {
  const { hovered, ref } = useHover();

  return (
    <Container style={{
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: props.active ? "#69DB7C" : "#DEE2E6",
      height: "50px",
      width: "100%",
      borderLeftWidth: props.firstCellRow ? 1 : 0,
      borderTopWidth: props.firstCellCol ? 1 : 0,
      backgroundColor: props.active ? "#69DB7C" : (props.disbaled ? "#F1F3F5" : (hovered ? "#4DABF7" : "transparent")),
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: props.disbaled || props.active ? "default" : "pointer",
      transition: "all 0.1s ease-in-out"
    }} onClick={() => !props.active && !props.disbaled && props.onClick()} ref={ref}>
    </Container>
  )
}


export default ShiftCell;
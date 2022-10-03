import { Container, Group, Text } from "@mantine/core";
import Rating from "../Rating";

interface IProps {
  name: string;
  score: number;
  date: string;
  comment: string;
}

const Comment = ({ name, score, date, comment }: IProps) => {
  return (
    <Container size="xl" p={0}>
      <Group>
        <Text color="#444" weight={600}>{name}</Text>
        <Rating score={score} size="1.2rem" />
        <Text color="dimmed" style={{ flexGrow: 1 }} align="right">{date}</Text>
      </Group>
      <Text color="#444" align="justify">
        {comment}
      </Text>
    </Container>
  );
}

export default Comment;
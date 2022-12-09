import { Group, Progress, Text } from "@mantine/core";
import { IconStar } from "@tabler/icons";

interface IProps {
  score: number,
  value: number,
  iconSize?: number | string,
  color?: string
}

const RatingProgress = ({ score, value, iconSize = "1.4rem", color = "#F29D38" }: IProps) => {
  return (
    <Group spacing="xs">
      <Text color="#444">{score}</Text>
      <IconStar size={iconSize} color={color} fill={color} />
      <Progress radius="xl" size="md" value={value} color={color} style={{ flexGrow: 1 }} />
    </Group>
  );
}

export default RatingProgress;
import { Group } from "@mantine/core";
import { IconStar } from "@tabler/icons";

interface IProps {
  score: number,
  spacing?: number,
  size?: number | string
}

const Rating = ({ score, spacing = 4, size }: IProps) => {
  return (
    <Group spacing={spacing}>
      {Array(5).fill(0).map((_, index) => {
        if ((index + 1) <= score)
          return <IconStar key={index} fill="#F29D38" color="#F29D38" size={size} />
        return <IconStar key={index} color="#F29D38" size={size} />
      })}
    </Group>
  );

}

export default Rating;
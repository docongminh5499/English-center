import { Avatar, Group, Text } from "@mantine/core";
import { forwardRef } from "react";

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  avatar: string;
  name: string;
  id: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ avatar, name, id, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={avatar} />
        <div>
          <Text style={{ fontSize: "1.2rem" }}>{name}</Text>
          <Text style={{ fontSize: "1rem" }} color="dimmed">
            Mã số: {id}
          </Text>
        </div>
      </Group>
    </div>
  )
);

export default SelectItem;
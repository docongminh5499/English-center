import { Avatar, Group, Text } from "@mantine/core";
import { forwardRef } from "react";

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  name: string;
  address: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ name, address, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <div>
        <Text style={{ fontSize: "1.2rem" }}>{name}</Text>
        <Text style={{ fontSize: "1rem" }} color="dimmed">
          {address}
        </Text>
      </div>
    </div>
  )
);

export default SelectItem;
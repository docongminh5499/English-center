import { Text } from "@mantine/core";
import { forwardRef } from "react";
import Branch from "../../../../models/branch.model";


interface BranchItemProps extends React.ComponentPropsWithoutRef<'div'> {
  key: number,
  value: number,
  label: string,
  branch: Branch,
}


const BranchSelectItem = forwardRef<HTMLDivElement, BranchItemProps>(
  ({ branch, label, ...others }: BranchItemProps, ref) => {
    return (<div ref={ref} {...others}>
      <div>
        <Text style={{ fontSize: "1.2rem" }}>{label}</Text>
        <Text style={{ fontSize: "1rem" }} color="dimmed" lineClamp={1}>
          {branch.address}
        </Text>
      </div>
    </div>)
  }
);

export default BranchSelectItem;
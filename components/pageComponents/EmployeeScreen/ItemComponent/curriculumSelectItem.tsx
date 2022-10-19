import { Text } from "@mantine/core";
import { forwardRef } from "react";
import { getCurriculumLevel } from "../../../../helpers/getCurriculumLevel";
import Curriculum from "../../../../models/cirriculum.model";

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  key: number,
  value: number,
  label: string,
  curriculum: Curriculum,
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({label, curriculum, ...others }: ItemProps, ref) => {
    let info = [getCurriculumLevel(curriculum.level)];
    info = info.concat(curriculum.tags.map(tag => tag.name));

    return (<div ref={ref} {...others}>
      <div>
        <Text style={{ fontSize: "1.2rem" }}>{label}</Text>
        <Text style={{ fontSize: "1rem" }} color="dimmed" lineClamp={1}>
          {info.join(", ")}
        </Text>
      </div>
    </div>)
  }
);

export default SelectItem;
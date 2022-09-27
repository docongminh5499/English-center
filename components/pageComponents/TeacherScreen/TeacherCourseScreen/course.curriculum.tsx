import { Box, Container, NavLink, Text } from "@mantine/core";
import { useState } from "react";

const data = [
  {
    index: 1,
    label: 'Thì hiện tại đơn',
    detail: 'Detail bài 1'
  },
  {
    index: 2,
    label: 'Thì hiện tại đơn',
    detail: 'Detail bài 2'
  },
  {
    index: 3,
    label: 'Thì hiện tại đơn',
    detail: 'Detail bài 3'
  }
];


const CourseCurriculum = () => {
  const [active, setActive] = useState(0);

  return (
    <Container size="xl" style={{ display: "flex" }} p={0}>
      <Box>
        {data.map(item => (
          <NavLink
            key={item.index}
            active={item.index === active}
            label={
              <Text color="#444">
                <Text weight={600} component="span" color="#444">
                  {"Bài " + item.index + ": "}
                </Text>
                {item.label}
              </Text>
            }
            onClick={() => setActive(item.index)}
          />
        ))}
      </Box>
      <Container style={{ flexGrow: 1 }}>
        {active > 0 && (
          <Text color="#444">{data[active - 1].detail}</Text>
        )}
      </Container>
    </Container>
  );
}

export default CourseCurriculum;
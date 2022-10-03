import { Box, Container, Grid, NavLink, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import RichTextEditor from "../../../commons/RichText";

const data = [
  {
    index: 1,
    label: 'Thì hiện tại đơn long title here',
    detail: `1. <b>Learn in practice everything</b> you need to know about Computer Vision! Build projects step by step using Python!
    Computer Vision is a subarea of Artificial Intelligence focused on creating systems that can process, analyze and identify visual data in a similar way to the human eye. There are many commercial applications in various departments, such as: security, marketing, decision making and production. Smartphones use Computer Vision to unlock devices using face recognition, self-driving cars use it to detect pedestrians and keep a safe distance from other cars, as well as security cameras use it to identify whether there are people in the environment for the alarm to be triggered.
    Computer Vision is a subarea of Artificial Intelligence focused on creating systems that can process, analyze and identify visual data in a similar way to the human eye. There are many commercial applications in various departments, such as: security, marketing, decision making and production. Smartphones use Computer Vision to unlock devices using face recognition, self-driving cars use it to detect pedestrians and keep a safe distance from other cars, as well as security cameras use it to identify whether there are people in the environment for the alarm to be triggered.
    Computer Vision is a subarea of Artificial Intelligence focused on creating systems that can process, analyze and identify visual data in a similar way to the human eye. There are many commercial applications in various departments, such as: security, marketing, decision making and production. Smartphones use Computer Vision to unlock devices using face recognition, self-driving cars use it to detect pedestrians and keep a safe distance from other cars, as well as security cameras use it to identify whether there are people in the environment for the alarm to be triggered.
    Computer Vision is a subarea of Artificial Intelligence focused on creating systems that can process, analyze and identify visual data in a similar way to the human eye. There are many commercial applications in various departments, such as: security, marketing, decision making and production. Smartphones use Computer Vision to unlock devices using face recognition, self-driving cars use it to detect pedestrians and keep a safe distance from other cars, as well as security cameras use it to identify whether there are people in the environment for the alarm to be triggered.`,
  },
  {
    index: 2,
    label: 'Thì hiện tại đơn',
    detail: `2. Learn in practice everything you need to know about Computer Vision! Build projects step by step using Python!
    Computer Vision is a subarea of Artificial Intelligence focused on creating systems that can process, analyze and identify visual data in a similar way to the human eye. There are many commercial applications in various departments, such as: security, marketing, decision making and production. Smartphones use Computer Vision to unlock devices using face recognition, self-driving cars use it to detect pedestrians and keep a safe distance from other cars, as well as security cameras use it to identify whether there are people in the environment for the alarm to be triggered.`,
  },
  {
    index: 3,
    label: 'Thì hiện tại đơn',
    detail: 'Detail bài 3'
  },
  {
    index: 4,
    label: 'Thì hiện tại đơn',
    detail: 'Detail bài 4'
  },
  {
    index: 5,
    label: 'Thì hiện tại đơn',
    detail: 'Detail bài 5'
  },
  {
    index: 6,
    label: 'Thì hiện tại đơn',
    detail: 'Detail bài 6'
  },
  {
    index: 7,
    label: 'Thì hiện tại đơn',
    detail: 'Detail bài 7'
  },
  {
    index: 8,
    label: 'Thì hiện tại đơn',
    detail: 'Detail bài 8'
  },
  {
    index: 9,
    label: 'Thì hiện tại đơn',
    detail: 'Detail bài 9'
  },
  {
    index: 10,
    label: 'Thì hiện tại đơn',
    detail: 'Detail bài 10'
  }
];


const CourseCurriculum = () => {
  const [active, setActive] = useState(1);
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  return (
    <Container size="xl" style={{ display: "flex", flexDirection: isTablet ? "column" : "row" }} p={0}>
      <Grid style={{ width: isTablet ? "100%" : "175px", minWidth: isTablet ? "0px" : "175px" }}>
        {data.map(item => (
          <Grid.Col span={isTablet ? (isMobile ? 4 : 3) : 12} key={item.index}>
            <NavLink
              style={{ borderRadius: 5 }}
              active={item.index === active}
              label={
                isTablet ? (
                  <Text color={item.index === active ? "blue" : "#444"} style={{ fontSize: "1.4rem" }} weight={700}>
                    <Text align="center">Bài {item.index}</Text>
                  </Text>
                ) : (
                  <Text color={item.index === active ? "blue" : "#444"} style={{ fontSize: "1.4rem" }}>
                    <Text weight={600} component="span">
                      {"Bài " + item.index + ": "}
                    </Text>
                    {item.label}
                  </Text>
                )}
              onClick={() => setActive(item.index)}
            />
          </Grid.Col>
        ))}
      </Grid>
      <Container style={{ flexGrow: 1 }} pl={isTablet ? 0 : 8} pr={0} mt={isTablet ? 16 : 0} mx={0}>
        {active > 0 && (
          <Container
            px={isMobile ? 0 : 10}
            size="xl"
            style={{ color: "#444", textAlign: "justify", width: "100%" }}
            dangerouslySetInnerHTML={{ __html: data[active - 1].detail }} />
        )}
      </Container>
    </Container>
  );
}

export default CourseCurriculum;
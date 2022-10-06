import { Container, Grid, NavLink, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import Curriculum from "../../../../models/cirriculum.model";


interface IProps {
  curriculum: Curriculum | undefined;
}


const CourseCurriculum = (props: IProps) => {
  const [active, setActive] = useState(0);
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  return (
    <Container size="xl" p={0}>
      {props.curriculum && (
        <Container size="xl" style={{ display: "flex", flexDirection: isTablet ? "column" : "row" }} p={0}>
          <Grid style={{ width: isTablet ? "100%" : "175px", minWidth: isTablet ? "0px" : "175px" }}>
            {props.curriculum.lectures.map((item, index) => (
              <Grid.Col span={isTablet ? (isMobile ? 4 : 3) : 12} key={index}>
                <NavLink
                  style={{ borderRadius: 5 }}
                  active={index === active}
                  label={
                    isTablet ? (
                      <Text color={index === active ? "blue" : "#444"} style={{ fontSize: "1.4rem" }} weight={700}>
                        <Text align="center">Bài {item.order}</Text>
                      </Text>
                    ) : (
                      <Text color={index === active ? "blue" : "#444"} style={{ fontSize: "1.4rem" }}>
                        <Text weight={600} component="span">
                          {"Bài " + item.order + ": "}
                        </Text>
                        {item.name}
                      </Text>
                    )}
                  onClick={() => setActive(index)}
                />
              </Grid.Col>
            ))}
          </Grid>
          <Container style={{ flexGrow: 1 }} pl={isTablet ? 0 : 8} pr={0} mt={isTablet ? 16 : 0} mx={0}>
            {active >= 0 && (
              <Container
                px={isMobile ? 0 : 10}
                size="xl"
                style={{ color: "#444", textAlign: "justify", width: "100%" }}
                dangerouslySetInnerHTML={{ __html: props.curriculum.lectures[active].detail }} />
            )}
          </Container>
        </Container>
      )}
    </Container>
  );
}

export default CourseCurriculum;
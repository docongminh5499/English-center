import { Button, Container, Grid, Space, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { TimeZoneOffset } from "../../../../helpers/constants";
import StudentParticipateCourse from "../../../../models/studentParticipateCourse.model";
import Comment from "../../../commons/Comment";
import Rating from "../../../commons/Rating";
import RatingProgress from "../../../commons/RatingProgress";

interface IProps {
  studentParticipations?: StudentParticipateCourse[]
}

const CourseRating = (props: IProps) => {
  const router = useRouter();
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');


  const totalScore = useMemo(() => {
    const totalScore = props.studentParticipations?.reduce((total, current) =>
      total += (current.starPoint ? current.starPoint : 0), 0) || 0;
    return totalScore;
  }, [props.studentParticipations]);


  const totalCount = useMemo(() => {
    const totalCount = props.studentParticipations?.reduce((total, current) =>
      total += (current.starPoint ? 1 : 0), 0) || 0;
    return totalCount;
  }, [props.studentParticipations]);


  const average = useMemo(() => {
    if (totalCount == 0) return 0;
    return Math.round(totalScore / totalCount * 10) / 10
  }, [totalCount, totalScore]);


  const eachScoreCount = useMemo(() => {
    const result: any = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    props.studentParticipations?.forEach(item => {
      if (item.starPoint) result[item.starPoint] += 1;
    })
    const total = result[1] + result[2] + result[3] + result[4] + result[5];
    if (total > 0) {
      result[1] = Math.round(result[1] / total * 100);
      result[2] = Math.round(result[2] / total * 100);
      result[3] = Math.round(result[3] / total * 100);
      result[4] = Math.round(result[4] / total * 100);
      result[5] = Math.round(result[5] / total * 100);
    }
    return result;
  }, [props.studentParticipations]);


  const topThreeLatestComments = useMemo(() => {
    const result: StudentParticipateCourse[] = [];
    props.studentParticipations?.forEach(item => {
      if (item.starPoint && result.length < 3) result.push(item);
    })
    return result;
  }, [props.studentParticipations]);

  return (
    <Container size="xl" p={isMobile ? 0 : 10}>
      <Space h={20} />
      <Grid>
        <Grid.Col span={isTablet ? (isMobile ? 12 : 6) : 4} style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem"
        }}>
          <Text style={{ fontSize: "4rem" }} weight={600} align='center' color="#444">
            {average}
          </Text>
          <Rating score={Math.round(average)} size="2.8rem" />
          <Text color="dimmed" align="center">
            ({totalCount} bình luận)
          </Text>
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>
          <Stack spacing="xs" justify="center">
            <RatingProgress score={5} value={eachScoreCount[5]} />
            <RatingProgress score={4} value={eachScoreCount[4]} />
            <RatingProgress score={3} value={eachScoreCount[3]} />
            <RatingProgress score={2} value={eachScoreCount[2]} />
            <RatingProgress score={1} value={eachScoreCount[1]} />
          </Stack>
        </Grid.Col>
      </Grid>

      <Space h={40} />

      {topThreeLatestComments && topThreeLatestComments.length > 0 && (
        <Stack spacing="xl" justify="center">
          {topThreeLatestComments.map((item, index) => (
            <Comment
              key={index}
              name={item.student.user.fullName}
              score={item.starPoint || 0}
              date={moment(item.commentDate).utcOffset(TimeZoneOffset).format("HH:mm DD/MM/YYYY")}
              comment={item.comment || ""}
            />
          ))}
        </Stack>
      )}

      <Space h={40} />

      {totalCount > 3 && (
        <Container style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => router.push(router.asPath + "/allComments")}>
            Xem tất cả
          </Button>
        </Container>
      )}

      <Space h={20} />
    </Container>
  );
}

export default CourseRating;
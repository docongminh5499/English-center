import { Container, Grid, Space, Title, Text, Stack } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { TimeZoneOffset, UserRole } from "../../../../helpers/constants";
import Course from "../../../../models/course.model";
import MaskedComment from "../../../../models/maskedComment.model";
import Comment from "../../../commons/Comment";
import Rating from "../../../commons/Rating";
import RatingProgress from "../../../commons/RatingProgress";

interface IProps {
  userRole?: UserRole | null;
  course: Course | null;
}

const TeacherCourseCommentScreen = (props: IProps) => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const [didMount, setDidMount] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (props.course === null)
      router.replace('/not-found');
    else setDidMount(true);
  }, []);



  const totalScore = useMemo(() => {
    const totalScore = props.course?.maskedComments?.reduce((total, current) =>
      total += (current.starPoint ? current.starPoint : 0), 0) || 0;
    return totalScore;
  }, [props.course?.maskedComments]);


  const totalCount = useMemo(() => {
    const totalCount = props.course?.maskedComments?.reduce((total, current) =>
      total += (current.starPoint ? 1 : 0), 0) || 0;
    return totalCount;
  }, [props.course?.maskedComments]);


  const average = useMemo(() => {
    if (totalCount == 0) return 0;
    return Math.round(totalScore / totalCount * 10) / 10
  }, [totalCount, totalScore]);


  const eachScoreCount = useMemo(() => {
    const result: any = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    props.course?.maskedComments?.forEach(item => {
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
  }, [props.course?.maskedComments]);


  const comments = useMemo(() => {
    const result: MaskedComment[] = [];
    props.course?.maskedComments?.forEach(item => {
      if (item.starPoint) result.push(item);
    })
    return result;
  }, [props.course?.maskedComments]);

  return (
    <>
      <Head>
        <title>Bình luận khóa học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {didMount && (
        <Container p={isMobile ? "xs" : "md"} size="xl" style={{ width: "100%" }}>
          <Title
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/teacher/course/${props.course?.slug}`)}
            size="2.6rem" color="#444" align="center">
            {props.course?.name}
          </Title>
          <Text style={{ fontSize: "1.6rem" }} color="dimmed" align="center">Nhận xét của học viên</Text>
          <Space h={60} />
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

          {comments && comments.length > 0 && (
            <Stack spacing="xl" justify="center">
              {comments.map((item, index) => (
                <Comment
                  key={index}
                  name={item.userFullName || ""}
                  score={item.starPoint || 0}
                  date={moment(item.commentDate).utcOffset(TimeZoneOffset).format("HH:mm DD/MM/YYYY")}
                  comment={item.comment || ""}
                />
              ))}
            </Stack>
          )}

          <Space h={40} />
        </Container>
      )}
    </>
  )
}


export default TeacherCourseCommentScreen;
import { Button, Container, Grid, Loader, Space, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { TeacherConstants, TimeZoneOffset, Url } from "../../../../helpers/constants";
import StarPointTypeCount from "../../../../interfaces/starPointTypeCount.interface";
import MaskedComment from "../../../../models/maskedComment.model";
import { useAuth } from "../../../../stores/Auth";
import Comment from "../../../commons/Comment";
import Rating from "../../../commons/Rating";
import RatingProgress from "../../../commons/RatingProgress";


interface IProps {
  courseSlug?: string
}

const CourseRating = (props: IProps) => {
  const router = useRouter();
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const [authState] = useAuth();
  const [total, setTotal] = useState(0);
  const [avg, setAvg] = useState(0);
  const [commentList, setCommentList] = useState<MaskedComment[]>([]);
  const [starPointTypeCount, setStarPointCount] = useState<StarPointTypeCount>({ "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 });
  const [loading, setLoading] = useState(true);


  const getComments = useCallback(async (limit: number, skip: number) => {
    return await API.post(Url.teachers.getComments, {
      token: authState.token,
      limit: limit,
      skip: skip,
      courseSlug: props.courseSlug
    });
  }, [authState.token, props.courseSlug]);


  useEffect(() => {
    const didMountFunc = async () => {
      try {
        setLoading(true);
        const responses = await getComments(TeacherConstants.maxTopComments, 0);
        setTotal(responses.total);
        setCommentList(responses.comments);
        setAvg(responses.average);
        setStarPointCount(responses.starTypeCount);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
      }
    }
    didMountFunc();
  }, []);



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
            {Math.round(avg * 10) / 10}
          </Text>
          <Rating score={Math.round(avg)} size="2.8rem" />
          <Text color="dimmed" align="center">
            ({total} bình luận)
          </Text>
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>
          <Stack spacing="xs" justify="center">
            <RatingProgress score={5} value={starPointTypeCount[5] / total * 100} />
            <RatingProgress score={4} value={starPointTypeCount[4] / total * 100} />
            <RatingProgress score={3} value={starPointTypeCount[3] / total * 100} />
            <RatingProgress score={2} value={starPointTypeCount[2] / total * 100} />
            <RatingProgress score={1} value={starPointTypeCount[1] / total * 100} />
          </Stack>
        </Grid.Col>
      </Grid>

      <Space h={40} />

      {loading && (
        <Container style={{
          display: "flex",
          justifyContent: "center",
          alignItems: 'center',
          flexGrow: 1,
          height: "80px"
        }}>
          <Loader variant="dots" />
        </Container>
      )}

      {commentList && commentList.length > 0 && (
        <Stack spacing="xl" justify="center">
          {commentList.map((item, index) => (
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

      {total > TeacherConstants.maxTopComments && (
        <Container style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => router.push(router.asPath + "/all-comments")}>
            Xem tất cả
          </Button>
        </Container>
      )}

      <Space h={20} />
    </Container>
  );
}

export default CourseRating;
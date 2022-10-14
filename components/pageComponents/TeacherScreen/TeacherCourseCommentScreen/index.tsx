import { Container, Grid, Space, Title, Text, Stack, Loader, Button } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { TeacherConstants, TimeZoneOffset, Url, UserRole } from "../../../../helpers/constants";
import StarPointTypeCount from "../../../../interfaces/starPointTypeCount.interface";
import Course from "../../../../models/course.model";
import MaskedComment from "../../../../models/maskedComment.model";
import { useAuth } from "../../../../stores/Auth";
import Comment from "../../../commons/Comment";
import Loading from "../../../commons/Loading";
import Rating from "../../../commons/Rating";
import RatingProgress from "../../../commons/RatingProgress";

interface IProps {
  userRole?: UserRole | null;
  course: Course | null;
}

const TeacherCourseCommentScreen = (props: IProps) => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');


  const [authState] = useAuth();
  const [total, setTotal] = useState(0);
  const [avg, setAvg] = useState(0);
  const [commentList, setCommentList] = useState<MaskedComment[]>([]);
  const [starPointTypeCount, setStarPointCount] = useState<StarPointTypeCount>({ "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 });
  const [didMount, setDidMount] = useState(false);
  const [seeMoreLoading, setSeeMoreLoading] = useState(false);
  const router = useRouter();


  const getComments = useCallback(async (limit: number, skip: number) => {
    return await API.post(Url.teachers.getComments + props.course?.slug, {
      token: authState.token,
      limit: limit,
      skip: skip,
      courseSlug: props.course?.slug
    });
  }, [authState.token, props.course?.slug]);



  const seeMoreComments = useCallback(async () => {
    try {
      setSeeMoreLoading(true);
      const responses = await getComments(TeacherConstants.limitComments, commentList.length);
      setTotal(responses.total);
      setCommentList(commentList.concat(responses.comments));
      setAvg(responses.average);
      setStarPointCount(responses.starTypeCount);
      setSeeMoreLoading(false);
    } catch (error) {
      setSeeMoreLoading(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [TeacherConstants.limitComments, commentList]);




  useEffect(() => {
    const didMountFunc = async () => {
      try {
        const responses = await getComments(TeacherConstants.limitComments, 0);
        setTotal(responses.total);
        setCommentList(responses.comments);
        setAvg(responses.average);
        setStarPointCount(responses.starTypeCount);
        setDidMount(true);
      } catch (error) {
        setDidMount(true);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
      }
    }

    if (props.course === null)
      router.replace('/not-found');
    else if (props.course.closingDate === undefined || props.course.closingDate === null)
      router.replace('/not-found');
    else didMountFunc();
  }, []);



  return (
    <>
      <Head>
        <title>Bình luận khóa học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!didMount && (
        <Container p={0} style={{
          display: "flex",
          justifyContent: "center",
          alignItems: 'center',
          flexGrow: 1,
        }}>
          <Loading />
        </Container>
      )}

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

          <Space h={20} />
          <Container style={{
            display: "flex",
            justifyContent: "center",
            alignItems: 'center',
            flexGrow: 1,
          }}>
            {seeMoreLoading && <Loader variant="dots" />}
            {!seeMoreLoading &&
              commentList.length < total &&
              <Button onClick={() => seeMoreComments()}
              >Xem thêm
              </Button>
            }
          </Container>
          <Space h={20} />
        </Container>
      )}
    </>
  )
}


export default TeacherCourseCommentScreen;
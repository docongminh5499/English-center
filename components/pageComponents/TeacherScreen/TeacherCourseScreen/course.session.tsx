import { Badge, Container, Divider, Grid, Loader, Space, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { StudySessionState, TeacherConstants, TimeZoneOffset, Url } from "../../../../helpers/constants";
import { getStudySessionState } from "../../../../helpers/getStudySessionState";
import StudySession from "../../../../models/studySession.model";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Loading from "../../../commons/Loading";


interface IProps {
  courseSlug?: string;
}


const CourseSession = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const router = useRouter();
  const [authState] = useAuth();
  const [listStudySessions, setListStudySessions] = useState<StudySession[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeMoreLoading, setSeeMoreLoading] = useState(false);



  const getStudySessions = useCallback(async (limit: number, skip: number) => {
    return await API.post(Url.teachers.getStudySessions, {
      token: authState.token,
      limit: limit,
      skip: skip,
      courseSlug: props.courseSlug
    });
  }, [authState.token, props.courseSlug]);




  const seeMoreStudySessions = useCallback(async () => {
    try {
      setSeeMoreLoading(true);
      const responses = await getStudySessions(TeacherConstants.limitStudySession, listStudySessions.length);
      setTotal(responses.total);
      setListStudySessions(listStudySessions.concat(responses.studySessions));
      setSeeMoreLoading(false);
    } catch (error) {
      setSeeMoreLoading(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [TeacherConstants.limitStudySession, listStudySessions]);


  useEffect(() => {
    const didMountFunc = async () => {
      try {
        const responses = await getStudySessions(TeacherConstants.limitStudySession, 0);
        setTotal(responses.total);
        setListStudySessions(responses.studySessions);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
      }
    }
    didMountFunc();
  }, []);


  return (
    <>
      <Text color="#444" transform="uppercase" align="center" weight={600} style={{ fontSize: "2.6rem" }}>
        Danh sách buổi học
      </Text>

      {loading && (
        <Container style={{
          display: "flex",
          justifyContent: "center",
          alignItems: 'center',
          flexGrow: 1,
          height: "200px"
        }}>
          <Loading />
        </Container>
      )}

      {!loading && listStudySessions && listStudySessions.length === 0 && (
        <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <Text color="dimmed" align="center" weight={600} style={{ fontSize: "1.8rem" }}>
            Chưa có buổi học
          </Text>
        </Container>
      )}

      {!loading && listStudySessions && listStudySessions.length > 0 && (
        listStudySessions.map((item, index) => (
          <React.Fragment key={index}>
            <Container size="xl" p={isMobile ? "xs" : "md"}>
              <Text weight={600} color="#444">{item.name}</Text>
              <Space h={8} />
              <Grid>
                <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 5}>
                  <Text color="#444">Ngày diễn ra: {moment(item.date).utcOffset(TimeZoneOffset).format("DD/MM/YYYY")}</Text>
                  <Text color="dimmed" style={{ fontSize: "1rem" }}>
                    Ca học: {
                      moment(item.shifts[0].startTime).utcOffset(TimeZoneOffset).format("HH:mm")
                      + "-" + moment(item.shifts[item.shifts.length - 1].endTime).utcOffset(TimeZoneOffset).format("HH:mm")
                    }
                  </Text>

                  <Space h={8} />
                  <Text color="#444">Phòng học: {item.classroom.name}</Text>
                  <Text color="dimmed" style={{ fontSize: "1rem" }}>
                    {item.classroom.branch.name}
                  </Text>
                </Grid.Col>
                <Grid.Col span={isLargeTablet ? (isMobile ? 12 : 6) : 5}>
                  <Text color="#444">Trợ giảng: {item.tutor.worker.user.fullName}</Text>
                  <Text color="dimmed" style={{ fontSize: "1rem" }}>
                    MSTG: {item.tutor.worker.user.id}
                  </Text>
                  <Space h={8} />
                  <Text color="#444">Tình trạng:
                    {getStudySessionState(item) === StudySessionState.Finish && (
                      <Text weight={600} component="span" color="pink"> Đã kết thúc</Text>
                    )}
                    {getStudySessionState(item) === StudySessionState.Ready && (
                      <Text weight={600} component="span" color="gray"> Chưa diễn ra</Text>
                    )}
                    {getStudySessionState(item) === StudySessionState.Start && (
                      <Text weight={600} component="span" color="green"> Đang diễn ra</Text>
                    )}
                  </Text>
                </Grid.Col>
                <Grid.Col span={isLargeTablet ? 12 : 2}>
                  {(getStudySessionState(item) === StudySessionState.Finish ||
                    getStudySessionState(item) === StudySessionState.Start) && (
                      <Button compact={isLargeTablet ? false : true} fullWidth
                        onClick={() => router.push(router.asPath + "/study-session/" + item.id)}>
                        Xem chi tiết
                      </Button>
                    )}
                  {getStudySessionState(item) === StudySessionState.Ready && (
                    <Button color="pink" compact={isLargeTablet ? false : true} fullWidth>Xin nghỉ</Button>
                  )}
                </Grid.Col>
              </Grid>
            </Container>
            {index !== listStudySessions.length - 1 && (
              <Divider />
            )}
          </React.Fragment>
        )))}

      <Space h={20} />
      <Container style={{
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        flexGrow: 1,
      }}>
        {seeMoreLoading && <Loader variant="dots" />}
        {!seeMoreLoading && listStudySessions.length < total && <Button
          onClick={() => seeMoreStudySessions()}
        >Xem thêm</Button>}
      </Container>
      <Space h={20} />
    </>
  );
}

export default CourseSession;
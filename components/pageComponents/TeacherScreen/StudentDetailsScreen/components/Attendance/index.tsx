import { Grid, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks';
import moment from 'moment';
import React from 'react'
import { TimeZoneOffset } from '../../../../../../helpers/constants';
import MakeUpLession from '../../../../../../models/makeUpLesson.model';
import UserAttendStudySession from '../../../../../../models/userAttendStudySession.model';

interface IProps {
  data: UserAttendStudySession;
  makeUpLesson: MakeUpLession | undefined;
}

const Timekeeping = (props: IProps) => {
  const isMobile = useMediaQuery('(max-width: 480px)');
  return (
    <>
      <Grid>
        <Grid.Col span={isMobile ? 4 : 3}><Text color="#222222" weight={500} mr={5}>Buổi học:</Text></Grid.Col>
        <Grid.Col span={isMobile ? 8 : 9}><Text color="#222222" >{props.data.studySession.name || '-'}</Text></Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={isMobile ? 4 : 3}><Text color="#222222" weight={500} mr={5}>Ca học:</Text></Grid.Col>
        <Grid.Col span={isMobile ? 8 : 9}><Text color="#222222" >{
          moment(props.data.studySession.shifts[0].startTime).format("HH:mm")
          + " - " +
          moment(props.data.studySession.shifts[props.data.studySession.shifts.length - 1].endTime).format("HH:mm")}
          <Text color="dimmed" style={{ fontSize: "1.1rem" }} component="span" ml={10}>
            {moment(props.data.studySession.date).utcOffset(TimeZoneOffset).format("DD/MM/YYYY")}
          </Text>
        </Text></Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={isMobile ? 4 : 3}><Text color="#222222" weight={500} mr={5}>Điểm danh:</Text></Grid.Col>
        <Grid.Col span={isMobile ? 8 : 9}><MessTimeKeeping attendence={props.data} makeup={props.makeUpLesson} /></Grid.Col>
      </Grid>
    </>
  )
}

const MessTimeKeeping = ({ attendence, makeup }: { attendence: UserAttendStudySession, makeup: MakeUpLession | undefined }) => {
  enum STATUS {
    PRESENT = 1,
    MISS_MAKE_UP = 2,
    MISS_HAVE_LEARN = 3,
    MISS_NOT_LEARN = 4,
  }
  const COLOR_STATUS = {
    [STATUS.PRESENT]: 'green',
    [STATUS.MISS_MAKE_UP]: 'orange',
    [STATUS.MISS_HAVE_LEARN]: 'blue',
    [STATUS.MISS_NOT_LEARN]: 'pink',
  }
  const MESS_STATUS = {
    [STATUS.PRESENT]: 'Có mặt',
    [STATUS.MISS_MAKE_UP]: 'Vắng - Đã đăng ký bù',
    [STATUS.MISS_HAVE_LEARN]: 'Vắng - Học bù',
    [STATUS.MISS_NOT_LEARN]: 'Vắng - Không bù',
  }

  const convertStatus = () => {
    if (attendence.isAttend) return STATUS.PRESENT;
    if (makeup === undefined) return STATUS.MISS_NOT_LEARN;
    if (moment(makeup.targetStudySession.date).utcOffset(TimeZoneOffset).diff(moment()) >= 0)
      return STATUS.MISS_MAKE_UP;
    if (makeup.isAttend === true)
      return STATUS.MISS_HAVE_LEARN;
    return STATUS.MISS_NOT_LEARN;
  }

  const status = convertStatus() as STATUS;
  return <Text color={COLOR_STATUS[status] || '#444444'} weight={600}>{MESS_STATUS[status]}</Text>
}

export default Timekeeping
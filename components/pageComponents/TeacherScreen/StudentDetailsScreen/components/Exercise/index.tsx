import { Grid, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import moment from 'moment';
import { TimeZoneOffset } from '../../../../../../helpers/constants';
import StudentDoExercise from '../../../../../../models/studentDoExercise.model';

interface IProps {
    data: StudentDoExercise,
}
const Exercise = (props: IProps) => {
    const isMobile = useMediaQuery('(max-width: 480px)');
    return (
        <>
            <Grid>
                <Grid.Col span={isMobile ? 4 : 3}><Text color="#444444" weight={500} mr={5}>Bài tập:</Text></Grid.Col>
                <Grid.Col span={isMobile ? 8 : 9}>
                    <Text color="#444444">{props.data.exercise.name}</Text>
                </Grid.Col>
            </Grid>
            <Grid>
                <Grid.Col span={isMobile ? 4 : 3}><Text color="#444444" weight={500} mr={5}>Từ:</Text></Grid.Col>
                <Grid.Col span={isMobile ? 8 : 9}><Text color="#444444" >
                    {moment(props.data.startTime).utcOffset(TimeZoneOffset).format("HH:mm")}
                    <Text color="dimmed" style={{ fontSize: "1.1rem" }} component="span" ml={10}>
                        {moment(props.data.startTime).utcOffset(TimeZoneOffset).format("DD/MM/YYYY")}
                    </Text>
                </Text></Grid.Col>
            </Grid>
            <Grid>
                <Grid.Col span={isMobile ? 4 : 3}><Text color="#444444" weight={500} mr={5}>Đến:</Text></Grid.Col>
                <Grid.Col span={isMobile ? 8 : 9}><Text color="#444444" >
                    {moment(props.data.endTime).utcOffset(TimeZoneOffset).format("HH:mm")}
                    <Text color="dimmed" style={{ fontSize: "1.1rem" }} component="span" ml={10}>
                        {moment(props.data.endTime).utcOffset(TimeZoneOffset).format("DD/MM/YYYY")}
                    </Text>
                </Text></Grid.Col>
            </Grid>
            <Grid>
                <Grid.Col span={isMobile ? 4 : 3}><Text color="#444444" weight={500} mr={5}>Điểm số:</Text></Grid.Col>
                <Grid.Col span={isMobile ? 8 : 9}><Text color="#2457C5" weight={700} >{props.data.score}</Text></Grid.Col>
            </Grid>
        </>
    )
}

export default Exercise
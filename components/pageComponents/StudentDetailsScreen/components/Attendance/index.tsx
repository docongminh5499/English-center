import { Grid, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks';
import React from 'react'
import { _AttendanceStudent } from '../../_models_'

interface IProps {
    data : _AttendanceStudent,
}

const Timekeeping = (props : IProps) => {
    const isMobile = useMediaQuery('(max-width: 480px)');
    return (
            <>
                <Grid>
                    <Grid.Col span={isMobile ? 4 : 3}><Text color="#222222" weight={500} mr={5}>Buổi học:</Text></Grid.Col>
                    <Grid.Col span={isMobile ? 8 : 9}><Text color="#222222" >{ props.data.studySessionId?.nameStudySession || 'Không có thông tin' }</Text></Grid.Col>
                </Grid>
                <Grid>
                    <Grid.Col span={isMobile ? 4 : 3}><Text color="#222222" weight={500} mr={5}>Ca học:</Text></Grid.Col>
                    <Grid.Col span={isMobile ? 8 : 9}><Text color="#222222" >{ props.data.studySessionId?.shifts?.time || 'Không có thông tin' }</Text></Grid.Col>
                </Grid>
                <Grid>
                    <Grid.Col span={isMobile ? 4 : 3}><Text color="#222222" weight={500} mr={5}>Điểm danh:</Text></Grid.Col>
                    <Grid.Col span={isMobile ? 8 : 9}><MessTimeKeeping isAbsent={props.data.isAbsent || false} isMakeUpStudy={props.data.isMakeUpStudy || false} /></Grid.Col>
                </Grid>
            </>
    )
}

const MessTimeKeeping = ({ isAbsent , isMakeUpStudy } : { isAbsent : boolean, isMakeUpStudy : boolean }) => {
    enum STATUS {
        PRESENT = 1,
        MISS_HAVE_LEARN = 0,
        MISS_NOT_LEARN = -1,
    }
    const COLOR_STATUS = {
        [STATUS.PRESENT]:'#1B8013',
        [STATUS.MISS_HAVE_LEARN]:'#221D94',
        [STATUS.MISS_NOT_LEARN]:'#A82424',
    }
    const MESS_STATUS = {
        [STATUS.PRESENT] : 'Có mặt',
        [STATUS.MISS_HAVE_LEARN] : 'Vắng - Học bù',
        [STATUS.MISS_NOT_LEARN] : 'Vắng - Không bù',
    }

    const convertStatus = () => {
        if(isAbsent) return  STATUS.PRESENT
        if(!isAbsent && !isMakeUpStudy) return STATUS.MISS_NOT_LEARN
        if(!isAbsent && isMakeUpStudy) return STATUS.MISS_HAVE_LEARN
    }

    const status = convertStatus() as STATUS
    return <Text color={COLOR_STATUS[status] || '#222222'} >{ MESS_STATUS[status] }</Text>
}

export default Timekeeping
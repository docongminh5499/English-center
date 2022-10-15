import { Grid, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks';
import React from 'react'

enum STATUS {
    PRESENT = 1,
    MISS_HAVE_LEARN = 0,
    MISS_NOT_LEARN = -1,
}

const MESS_STATUS = {
    [STATUS.PRESENT] : 'Có mặt',
    [STATUS.MISS_HAVE_LEARN] : 'Vắng - Học bù',
    [STATUS.MISS_NOT_LEARN] : 'Vắng - Không bù',
}

interface IProps {
    name : string,
    time: string,
    status : STATUS
}

const Timekeeping = (props : IProps) => {
    const isMobile = useMediaQuery('(max-width: 480px)');
    return (
            <>
                <Grid>
                    <Grid.Col span={isMobile ? 4 : 3}><Text color="#222222" weight={500} mr={5}>Buổi học:</Text></Grid.Col>
                    <Grid.Col span={isMobile ? 8 : 9}><Text color="#222222" >Family</Text></Grid.Col>
                </Grid>
                <Grid>
                    <Grid.Col span={isMobile ? 4 : 3}><Text color="#222222" weight={500} mr={5}>Ca học:</Text></Grid.Col>
                    <Grid.Col span={isMobile ? 8 : 9}><Text color="#222222" >10:00 - 12:00 - 01/01/2022 </Text></Grid.Col>
                </Grid>
                <Grid>
                    <Grid.Col span={isMobile ? 4 : 3}><Text color="#222222" weight={500} mr={5}>Điểm danh:</Text></Grid.Col>
                    <Grid.Col span={isMobile ? 8 : 9}><MessTimeKeeping status={props.status} /></Grid.Col>
                </Grid>
            </>
    )
}

const MessTimeKeeping = ({ status } : { status : STATUS }) => {
    let colorMess = '#222222'
    if(status === STATUS.PRESENT) colorMess = '#1B8013'
    else if (status === STATUS.MISS_HAVE_LEARN) colorMess = '#221D94'
    else if (status === STATUS.MISS_NOT_LEARN) colorMess = '#A82424'
    return <Text color={colorMess} >{ MESS_STATUS[status] }</Text>
}

export default Timekeeping
import { Grid, Text } from '@mantine/core'
import React from 'react'
import { useMediaQuery } from '@mantine/hooks';
import Button from '../../../../commons/Button'
import { _Exercise } from '../../_models_'

interface IProps {
    data : _Exercise,
}
const Exercise = (props : IProps) => {
    const isMobile = useMediaQuery('(max-width: 480px)');
    return (
        <>
            <Grid>
                <Grid.Col span={isMobile ? 4 : 3}><Text color="#222222" weight={500} mr={5}>Bài tập:</Text></Grid.Col>
                <Grid.Col span={isMobile ? 8 : 9}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Text color="#222222" >{props.data.name}</Text>
                        <Button size="xs" >Xem chi tiết</Button>
                    </div>
                </Grid.Col>
            </Grid>
            <Grid>
                <Grid.Col span={isMobile ? 4 : 3}><Text color="#222222" weight={500} mr={5}>Ngày làm bài:</Text></Grid.Col>
                <Grid.Col span={isMobile ? 8 : 9}><Text color="#222222" >{ props.data.time }</Text></Grid.Col>
            </Grid>
            <Grid>
                <Grid.Col span={isMobile ? 4 : 3}><Text color="#222222" weight={500} mr={5}>Điểm số:</Text></Grid.Col>
                <Grid.Col span={isMobile ? 8 : 9}><Text color="#2457C5" weight={700} >{props.data.scores}</Text></Grid.Col>
            </Grid>
        </>
    )
}

export default Exercise
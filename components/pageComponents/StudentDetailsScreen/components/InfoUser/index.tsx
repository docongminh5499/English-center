import { Grid, Space, Text, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks';
import React from 'react'


interface IProps {
    title : string,
    data : any
}

const InfoUser = (props : IProps) => {
    const isLargeTablet = useMediaQuery('(max-width: 1024px)');
    return (
        <div style={{ width: "100%" }} >
            <Title transform="uppercase" color="#222222" size="2.6rem" mt={20} align="left">
                { props.title }
            </Title>
            <Space h={30} />
            <Grid>
                <Grid.Col span={isLargeTablet ? 12 : 6}>
                    <Grid>
                        <Grid.Col span={isLargeTablet ? 12 : 4}>
                            Ảnh đại diện
                        </Grid.Col>
                        <Grid.Col span={isLargeTablet ? 12 : 8}>
                            <Grid>
                                <Grid.Col span={4}><Text color="#222222" weight={500} mr={5}>Họ tên:</Text></Grid.Col>
                                <Grid.Col span={8}><Text color="#222222" >{ props.data.fullname || '' }</Text></Grid.Col>
                            </Grid>
                            <Grid>
                                <Grid.Col span={4}><Text color="#222222" weight={500} mr={5}>Giới tính:</Text></Grid.Col>
                                <Grid.Col span={8}><Text color="#222222" >{ props.data.gender || '' }</Text></Grid.Col>
                            </Grid>
                            <Grid>
                                <Grid.Col span={4}><Text color="#222222" weight={500} mr={5}>Ngày sinh:</Text></Grid.Col>
                                <Grid.Col span={8}><Text color="#222222">{ props.data.birthday || '' }</Text></Grid.Col>
                            </Grid>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col span={isLargeTablet ? 12 : 6}>
                    <Grid>
                        <Grid.Col span={4}><Text color="#222222" weight={500} mr={5}>Email:</Text></Grid.Col>
                        <Grid.Col span={8}><Text color="#222222" >{ props.data.email || '' }</Text></Grid.Col>
                    </Grid>
                    <Grid>
                        <Grid.Col span={4}><Text color="#222222" weight={500} mr={5}>Địa chỉ thường trú: </Text></Grid.Col>
                        <Grid.Col span={8}><Text color="#222222" >{ props.data.address || '' }</Text></Grid.Col>
                    </Grid>
                    <Grid>
                        <Grid.Col span={4}><Text color="#222222" weight={500} mr={5}>Số điện thoại:</Text></Grid.Col>
                        <Grid.Col span={8}><Text color="#222222" >{ props.data.phone || '' }</Text></Grid.Col>
                    </Grid>
                </Grid.Col>
            </Grid>
        </div>
    )
}

export default InfoUser
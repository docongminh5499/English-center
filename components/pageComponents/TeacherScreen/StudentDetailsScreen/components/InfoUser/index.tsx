import { Container, Grid, Image, Loader, Space, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import moment from "moment";
import { TimeZoneOffset } from "../../../../../../helpers/constants";
import { getGenderName } from '../../../../../../helpers/getGenderName';
import { getAvatarImageUrl } from "../../../../../../helpers/image.helper";
import User from '../../../../../../models/user.model';

interface IProps {
  title: string,
  data?: User,
}
const InfoUser = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  return (
    <div style={{ width: "100%" }} >
      <Title transform="uppercase" color="#444444" size="2.6rem" mt={20} align="left">
        {props.title}
      </Title>
      <Space h={30} />

      {!props.data && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "150px"
        }}>
          <Text style={{ fontSize: "2.4rem", color: "#CED4DA" }} weight={600}>
            Không có dữ liệu
          </Text>
        </Container>
      )}

      {props.data && (
        <Grid align="center" >
          <Grid.Col span={isLargeTablet ? 12 : 6}>
            <Grid align="center" justify="center">
              <Grid.Col span={isLargeTablet ? 12 : 4}>
                <Image
                  withPlaceholder
                  placeholder={
                    <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "300px" }}>
                      <Loader variant="dots" />
                    </Container>
                  }
                  style={{ maxWidth: "300px", marginLeft: 'auto', marginRight: 'auto' }}
                  radius="md"
                  src={getAvatarImageUrl(props.data.avatar)}
                  alt="Hình đại diện"
                />
              </Grid.Col>
              <Grid.Col span={isLargeTablet ? 12 : 8}>
                <Grid>
                  <Grid.Col span={4}><Text color="#444444" weight={500} mr={5}>Họ tên:</Text></Grid.Col>
                  <Grid.Col span={8}><Text color="#444444" >{props.data.fullName || ''}</Text></Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={4}><Text color="#444444" weight={500} mr={5}>Giới tính:</Text></Grid.Col>
                  <Grid.Col span={8}><Text color="#444444" >{getGenderName(props.data.sex)}</Text></Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={4}><Text color="#444444" weight={500} mr={5}>Ngày sinh:</Text></Grid.Col>
                  <Grid.Col span={8}><Text color="#444444">{moment(props.data.dateOfBirth).utcOffset(TimeZoneOffset).format("DD/MM/YYYY") || ''}</Text></Grid.Col>
                </Grid>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={isLargeTablet ? 12 : 6}>
            <Grid>
              <Grid.Col span={4}><Text color="#444444" weight={500} mr={5}>Email:</Text></Grid.Col>
              <Grid.Col span={8}><Text color="#444444" >{props.data.email || ''}</Text></Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={4}><Text color="#444444" weight={500} mr={5}>Địa chỉ thường trú: </Text></Grid.Col>
              <Grid.Col span={8}><Text color="#444444" >{props.data.address || ''}</Text></Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={4}><Text color="#444444" weight={500} mr={5}>Số điện thoại:</Text></Grid.Col>
              <Grid.Col span={8}><Text color="#444444" >{props.data.phone || ''}</Text></Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      )}
    </div>
  )
}

export default InfoUser
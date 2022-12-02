import { Grid, Space, Text, Title, Image, Container, Loader, Button, Modal, Group } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks';
import React, { useCallback, useState } from 'react'
import { getAvatarImageUrl } from "../../../../../../helpers/image.helper";
import { TimeZoneOffset } from "../../../../../../helpers/constants";
import moment from "moment";
import User from '../../../../../../models/user.model';
import { getGenderName } from '../../../../../../helpers/getGenderName';
import FindParentModal from '../../../Modal/findParent.modal';
import ConfirmChooseModal from '../../../Modal/modal';
import UserParent from '../../../../../../models/userParent.model';

interface IProps {
  title: string,
  data?: User,
  onChooseParent: (parentId: number) => Promise<void>,
  onRemoveParent: () => Promise<void>,
}

const InfoUserParent = (props: IProps) => {
  const isLargeTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [currentParent, setCurrentParent] = useState<UserParent | null>(null);

  const [isSendingRemoveParentRequest, setIsSendingRemoveParentRequest] = useState(false);
  const [isOpenConfirmRemoveParentModal, setIsOpenConfirmRemoveParentModal] = useState(false);

  const onChooseParent = useCallback(async (parent: UserParent) => {
    setCurrentParent(parent);
    setIsOpenConfirmModal(true);
  }, []);



  const onConfirmChooseParent = useCallback(async () => {
    if (currentParent === null) throw 'Invalid parent';
    setIsOpenConfirmModal(false);
    setIsSendingRequest(true);
    await props.onChooseParent(currentParent.user.id);
    setIsSendingRequest(false);
    setIsOpenModal(false);
  }, [props.onChooseParent, currentParent]);


  
  const onConfirmRemoveParent = useCallback(async () => {
    setIsOpenConfirmRemoveParentModal(true);
    await props.onRemoveParent();
    setIsOpenConfirmRemoveParentModal(false);
    setIsOpenConfirmRemoveParentModal(false);
  }, []);


  return (
    <Container style={{ width: "100%" }} mt={20} p={0} size="xl">
      <Container style={{
        width: "100%",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center"
      }} p={0} size="xl">
        <Title transform="uppercase" color="#444444" size="2.6rem" align="left">
          {props.title}
        </Title>
        <Group ml={isMobile ? 0 : 20} mt={isMobile ? 10 : 0}>
          <Button
            variant='light'
            size="xs" compact
            onClick={() => setIsOpenModal(true)}>
            Thay đổi phụ huynh</Button>
          {props.data && (
            <Button
              color="red"
              variant='light'
              size="xs" compact
              onClick={() => setIsOpenConfirmRemoveParentModal(true)}>
              Xóa</Button>
          )}
        </Group>

      </Container>
      <Space h={30} />
      <Modal
        opened={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <FindParentModal
          onChooseParent={onChooseParent}
          loading={isSendingRequest}
        />
      </Modal>
      <Modal
        opened={isOpenConfirmModal}
        onClose={() => setIsOpenConfirmModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <ConfirmChooseModal
          title='Thay đổi phụ huynh'
          message={`Bạn có muốn thay đổi phụ huynh thành "${currentParent?.user.fullName}" chứ?`}
          buttonLabel="Xác nhận"
          colorButton='red'
          loading={false}
          callBack={onConfirmChooseParent}
        />
      </Modal>


      <Modal
        opened={isOpenConfirmRemoveParentModal}
        onClose={() => setIsOpenConfirmRemoveParentModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <ConfirmChooseModal
          title='Xóa phụ huynh'
          message={`Bạn có muốn xóa liên kết giữa phụ huynh và học viên chứ?`}
          buttonLabel="Xác nhận"
          colorButton='red'
          loading={isSendingRemoveParentRequest}
          callBack={onConfirmRemoveParent}
        />
      </Modal>

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
    </Container>
  )
}

export default InfoUserParent
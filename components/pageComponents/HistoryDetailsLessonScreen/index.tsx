import Head from "next/head";
import { Container, Title, Text, Space, Grid, Group, Checkbox } from "@mantine/core";
import styles from "./historyDetailsLesson.module.module.css";
import { TimeZoneOffset } from "../../../helpers/constants";
import { useEffect, useState } from "react";
import Button from "../../commons/Button";
import Table from "../../commons/Table";
import { useMediaQuery } from "@mantine/hooks";
import { infoStudySession_mock, dataAttendanceStudent_mock } from './_mock_/index'
import moment from "moment";

const COLUMN_ATTENDANCE = {
  HO_TEN : 'col_1',
  MSHV : 'col_2',
  HOC_BU : 'col_3',
  VANG : 'col_4',
  GHI_CHU : 'col_5',
}
const columnTable = [
  { _idColumn: COLUMN_ATTENDANCE.HO_TEN, titleColumn : 'Họ và tên', widthColumn : '20%' },
  { _idColumn: COLUMN_ATTENDANCE.MSHV, titleColumn : 'MSHV', widthColumn : '10%' },
  { _idColumn: COLUMN_ATTENDANCE.HOC_BU, titleColumn : 'Học bù', widthColumn : '10%' },
  { _idColumn: COLUMN_ATTENDANCE.VANG, titleColumn : 'Vắng', widthColumn : '10%' },
  { _idColumn: COLUMN_ATTENDANCE.GHI_CHU, titleColumn : 'Ghi chú', widthColumn : '50%' },
]

interface IProps {
}
const TempleteScreen = (props: IProps) => {
  const [didMount, setDidMount] = useState(false);
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isSmallTablet = useMediaQuery('(max-width: 768px)');
  
  const [infoStudySession, setInfoStudySession] = useState(infoStudySession_mock);
  const [dataAttendance, setDataAttendance] = useState(dataAttendanceStudent_mock);
  const [dataTable, setDataTable] = useState<Array<any>>([]);

  useEffect(() => {
    if(!dataAttendance || dataAttendance.length === 0) return setDataTable([])

    const dataTableTemp = dataAttendance.map(e => {
      if(!columnTable || columnTable.length == 0) return []
      return columnTable.map(_e => {
        if(_e._idColumn === COLUMN_ATTENDANCE.HO_TEN) return { _idColumn : COLUMN_ATTENDANCE.HO_TEN, valueRow : e.nameStudent }
        if(_e._idColumn === COLUMN_ATTENDANCE.MSHV) return { _idColumn : COLUMN_ATTENDANCE.MSHV, valueRow : e.pseudoIdStudent }
        if(_e._idColumn === COLUMN_ATTENDANCE.HOC_BU) return { _idColumn : COLUMN_ATTENDANCE.HOC_BU, templateRow : <TemplateCheckBoxStudy status={e.isMakeUpStudy} /> }
        if(_e._idColumn === COLUMN_ATTENDANCE.VANG) return { _idColumn : COLUMN_ATTENDANCE.VANG, templateRow : <TemplateCheckBoxAbsent status={e.isAbsent} /> }
        if(_e._idColumn === COLUMN_ATTENDANCE.GHI_CHU) return { _idColumn : COLUMN_ATTENDANCE.GHI_CHU, valueRow : e.note }
        return {}
      })
    })

    setDataTable(dataTableTemp)
   }, [dataAttendance])
  
  useEffect(() => {
    setDidMount(true);
  }, []);

  const TemplateCheckBoxStudy = ({ status } : { status : boolean }) => {
    return <Checkbox
      checked={status}
      transitionDuration={0}
    />
  }

  const TemplateCheckBoxAbsent = ({ status } : { status : boolean }) => {
    return <Checkbox
      checked={status}
      transitionDuration={0}
    />
  }

  return (
    <>
      <Head>
        <title>Chi tiết lịch sử buổi học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {didMount && (
          <Container size="xl" style={{ width: "100%" }}>
          <Title transform="uppercase" color="#222222" size="2.6rem" mt={20} align="left">
            { infoStudySession.nameStudySession || "" }
          </Title>
          <Text weight={600} color="#666666" style={{ fontSize: '1.6rem' }} align="justify">
            { infoStudySession.nameCourse || "" }
          </Text>
          <Space h={30} />
          <Grid>
            <Grid.Col span={isSmallTablet ? 12 : 4}>
              <Group position={isSmallTablet ? "apart" : "left"}>
                <Text color="#222222" mr={5}>Trợ giảng:</Text>
                <Text color="#222222">{ infoStudySession.nameTeacher || "Không có thông tin" }</Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={isSmallTablet ? 12 : 4}>
              <Group position={isSmallTablet ? 'apart' : 'center'}>
                <Text color="#222222" mr={5}>Ngày: </Text>
                <Text color="#222222">{ moment(infoStudySession.dateStart).utcOffset(TimeZoneOffset).format("DD/MM/YYYY") || 'Không có thông tin' }</Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={isSmallTablet ? 12 : 4}>
              <Group position={isSmallTablet ? 'apart' : 'right'} align="flex-start" >
                <Text color="#222222" mr={5}>Ca học: </Text>
                {
                  infoStudySession.shifts ?
                  <div>
                    <Text color="#222222" >{ infoStudySession.shifts.name || '' }</Text>
                    <Text color="#434343" size={12}>{  infoStudySession.shifts.time || ''}</Text>
                  </div> :
                  <Text color="#222222">Không có thông tin</Text>
                }
              </Group>
            </Grid.Col>
          </Grid>
          <Space h={15} />
          <Text color="#222222" weight={700} style={{ fontSize: "1.8rem" }}>Ghi chú</Text>
          <Container
            p={0}
            pt={10}
            size="xl"
            style={{ color: "#222222", textAlign: "justify" }}
            dangerouslySetInnerHTML={{ __html: infoStudySession.notes || 'Không có thông tin' }} />
          <Space h={20} />
          <Text color="#222222" weight={700} style={{ fontSize: "1.8rem" }}>Điểm danh</Text>
          <Space h={20} />
          {
            !dataTable || dataTable.length == 0 ?
            <Text color="#222222">Không có thông tin</Text> :
            <Table
              columnTable={columnTable}
              rowTable={dataTable}
              heightTable={isMobile ? 500 : 300}
            />
          }

          <Container my={20} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={() => {}}
            >Chỉnh sửa</Button>
          </Container>
          </Container>
      )}
    </>
  );
};

export default TempleteScreen;

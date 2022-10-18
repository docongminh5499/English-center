import Head from "next/head";
import * as yup from "yup";
import { Container, Title, Text, Space, Textarea, Checkbox, Grid, Group } from "@mantine/core";
import { UserRole, TimeZoneOffset } from "../../../helpers/constants";
import styles from "./LessonInProgress.module.css";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../stores/Auth";
import Button from "../../commons/Button";
import Table from "../../commons/Table";
import { useMediaQuery } from "@mantine/hooks";
import { useForm, yupResolver } from '@mantine/form';
import { toast } from "react-toastify";
import moment from "moment";

import { 
  dataAttendanceStudent_mock,
  infoStudySession_mock
} from './_mock_'
import {
  _AttendanceStudent
} from './_models_'


interface IProps {
  userRole?: UserRole | null;
}

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

const schema = yup.object().shape({
  notes: yup.string().required("Vui lòng nhập mô tả"),
});

// NHỮNG HÀNG NÀO ĐƯỢC UPDATE ĐƯỢC ĐƯA VÀO ( Dạng object: { [idRow] : {...dataUpdate} } ). Khi submit form dùng Object.value() để lấy mảng hàng cần update
let dataUpdateAttendance : Record<any, any> = {}

const LessonInProgress = (props: IProps) => {
  
  const [authState] = useAuth();
  const router = useRouter();
  const [didMount, setDidMount] = useState(false);
  const [infoStudySession, setInfoStudySession] = useState(infoStudySession_mock);

  // LƯU DATA BACKEND TRẢ VỀ
  const [dataAttendance, setDataAttendance] = useState(dataAttendanceStudent_mock);

  // CONVERT DATA từ dataAttendance để render cho table
  const [dataTable, setDataTable] = useState<Array<any>>([]);

  const isMobile = useMediaQuery('(max-width: 480px)');
  const isSmallTablet = useMediaQuery('(max-width: 768px)');
  const form = useForm({
    validate: yupResolver(schema),
  });

  useEffect(() => {
    setDidMount(true);
  }, []);

  useEffect(() => {
    if(!dataAttendance || dataAttendance.length === 0) return setDataTable([])

    const dataTableTemp = dataAttendance.map((e, index) => {
      if(!columnTable || columnTable.length == 0) return []
      return columnTable.map(_e => {
        if(_e._idColumn === COLUMN_ATTENDANCE.HO_TEN) return { _idColumn : COLUMN_ATTENDANCE.HO_TEN, valueRow : e.nameStudent }
        if(_e._idColumn === COLUMN_ATTENDANCE.MSHV) return { _idColumn : COLUMN_ATTENDANCE.MSHV, valueRow : e.pseudoIdStudent }
        if(_e._idColumn === COLUMN_ATTENDANCE.HOC_BU) return { _idColumn : COLUMN_ATTENDANCE.HOC_BU, templateRow : <TemplateCheckBoxStudy onChange={(data : any) => handleDataUpdateAttendance(data) } value={e.isMakeUpStudy} idRow={index} /> }
        if(_e._idColumn === COLUMN_ATTENDANCE.VANG) return { _idColumn : COLUMN_ATTENDANCE.VANG, templateRow : <TemplateCheckBoxAbsent onChange={(data : any) => handleDataUpdateAttendance(data) } value={e.isAbsent} idRow={index} /> }
        if(_e._idColumn === COLUMN_ATTENDANCE.GHI_CHU) return { _idColumn : COLUMN_ATTENDANCE.GHI_CHU, templateRow : <TemplateNotes  onChange={(data : any) => handleDataUpdateAttendance(data)} value={e.note} idRow={index} /> }
        return {}
      })
    })

    setDataTable(dataTableTemp)
   }, [dataAttendance])

  useEffect(() => {
    if (authState.loggingOut) return;

    if (props.userRole === UserRole.TEACHER)
      router.replace("/teacher/course");
    else if (props.userRole === UserRole.EMPLOYEE)
      router.replace("/employee");
    else if (props.userRole === UserRole.STUDENT)
      router.push("/student/timetable");

  }, [props.userRole]);

  const handleSubmit = async (values: any) => {
    
    try {
        let dataSumit : any = { notes : values.notes }
        if(Object.keys(dataUpdateAttendance).length > 0) {
          const attendance = Object.keys(dataUpdateAttendance).map(idRow => ({
            id : idRow,
            ...dataUpdateAttendance[idRow]
          }))

          dataSumit['attendance'] = attendance
        }

        console.log('dataSumit== ', dataSumit)
    }catch(err){
      console.log(err);
      toast.error("Hệ thống gặp sự cố, vui lòng thử lại sau!");
    }
  }

  const handleDataUpdateAttendance = (data : any) => {
    const { dataUpdate, idRow } = data
    if(!dataUpdate) return
    if(!dataUpdateAttendance[idRow]) dataUpdateAttendance = { ...dataUpdateAttendance, [idRow]: {...dataUpdate} }
    else dataUpdateAttendance[idRow] = { ...dataUpdateAttendance[idRow], ...dataUpdate }
  }

  const TemplateCheckBoxStudy = ({ onChange, value, idRow } : { onChange : any, value : boolean, idRow : number }) => {

    const handleChange = (e : any) => {
      let dataUpdate = {
        isMakeUpStudy : e.target.checked
      }
      onChange({ dataUpdate, idRow })
    }

    return <Checkbox
      onChange={(e) => handleChange(e)}
      defaultChecked={value}
    />
  }

  const TemplateCheckBoxAbsent =({ onChange, value, idRow } : { onChange : any, value : boolean, idRow : number }) => {

    const handleChange = (e : any) => {
      let dataUpdate = {
        isAbsent : e.target.checked
      }
      onChange({ dataUpdate, idRow })
    }

    return <Checkbox
      onChange={(e) => handleChange(e)}
      defaultChecked={value}
      transitionDuration={0}
    />
  }

  const TemplateNotes = React.memo(({ onChange, value, idRow } : { onChange: any, value? : string, idRow : number }) => {
    const [isEdit, setIsEdit] = useState(false)
    const [txtEdit, setTxtEdit] = useState(value || '')
    const [txtView, setTxtView] = useState(value || '')

    const handleSubmitEdit = () => {
      let dataUpdate = {
        note : txtEdit || ''
      }
      onChange({ dataUpdate, idRow })
      setIsEdit(false)
      setTxtView(txtEdit)
    }

    return isEdit ?
    <div>
       <Textarea
        autosize={false}
        defaultValue={isEdit ? txtEdit : txtView}
        placeholder="Ghi chú học viên"
        minRows={2}
        onChange={(e)=> setTxtEdit(e.target.value)}
      />
      <Group spacing={5} mt={5} >
        <Button type="button" size="xs"  onClick={() => handleSubmitEdit()} >Lưu</Button>
        <Button color='red' size="xs" onClick={() => setIsEdit(false)} >Hủy</Button>
      </Group>
    </div>
    :
    <p>{ txtView || "" } <button type="button" onClick={() => setIsEdit(true)} className={styles.buttonEditNotes}>{ !txtView || txtView.length === 0 ? 'Thêm' : 'Thay đổi' }</button></p>
  })

  return (
    <>
      <Head>
        <title>Buổi học đang diễn ra</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {didMount && (
          <Container size="xl" style={{ width: "100%" }}>
            <form
                onSubmit={form.onSubmit((values) => handleSubmit(values))}
                style={{ width: "100%" }}
              >
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
                <Space h={10} />
                <Textarea
                  withAsterisk
                  placeholder="Ghi chú về buổi học"
                  minRows={6}
                  {...form.getInputProps('notes')}
                />

                <Space h={20} />
                <Text color="#222222" weight={700} style={{ fontSize: "1.8rem" }}>Điểm danh</Text>
                <Space h={20} />
                {
                  !dataTable || dataTable.length === 0 ?
                  <Text color="#222222">Không có thông tin</Text> :
                  <Table
                    columnTable={columnTable}
                    rowTable={dataTable}
                    heightTable={isMobile ? 500 : 300}
                  />
                }
                <Container my={20} style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
                  <Button type="submit" 
                  >Lưu thông tin</Button>
                  <Button onClick={() => {}} color='red'>
                    Kết thúc buổi học
                  </Button>
                </Container>
            </form>
          </Container>
      )}
    </>
  );
};

export default LessonInProgress;

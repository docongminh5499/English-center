import { Checkbox, Container, Divider, Grid, Group, Modal, Space, Text, Textarea, Title } from "@mantine/core";
import { useForm, yupResolver } from '@mantine/form';
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import { StudySessionState, TimeZoneOffset, Url, UserRole } from "../../../../helpers/constants";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import Table from "../../../commons/Table";
import styles from "./modifyStudySession.module.css";

import API from "../../../../helpers/api";
import { getStudySessionState } from "../../../../helpers/getStudySessionState";
import MakeUpLession from "../../../../models/makeUpLesson.model";
import StudySession from "../../../../models/studySession.model";
import UserAttendStudySession from "../../../../models/userAttendStudySession.model";
import Loading from "../../../commons/Loading";
import SaveModal from "../Modal/save.modal";


interface IProps {
  userRole: UserRole | null,
  studySession: StudySession | null,
  attendences: UserAttendStudySession[],
  makeups: MakeUpLession[],
  ownMakeups: MakeUpLession[],
}


const COLUMN_ATTENDANCE = {
  HO_TEN: 'col_1',
  MSHV: 'col_2',
  HOC_BU: 'col_3',
  VANG: 'col_4',
  GHI_CHU: 'col_5',
}


const columnTable = [
  { _idColumn: COLUMN_ATTENDANCE.HO_TEN, titleColumn: 'Họ và tên', widthColumn: '20%' },
  { _idColumn: COLUMN_ATTENDANCE.MSHV, titleColumn: 'MSHV', widthColumn: '10%' },
  { _idColumn: COLUMN_ATTENDANCE.HOC_BU, titleColumn: 'Học bù', widthColumn: '10%' },
  { _idColumn: COLUMN_ATTENDANCE.VANG, titleColumn: 'Vắng', widthColumn: '10%' },
  { _idColumn: COLUMN_ATTENDANCE.GHI_CHU, titleColumn: 'Ghi chú', widthColumn: '50%' },
]


const schema = yup.object().shape({
  notes: yup.string().required("Vui lòng nhập mô tả"),
});


// NHỮNG HÀNG NÀO ĐƯỢC UPDATE ĐƯỢC ĐƯA VÀO ( Dạng object: { [idRow] : {...dataUpdate} } ). Khi submit form dùng Object.value() để lấy mảng hàng cần update
let dataUpdateAttendance: Record<any, any> = {}
let dataUpdateMakeUps: Record<any, any> = {}



const ModifyStudySessionScreen = (props: IProps) => {
  const [authState] = useAuth();
  const router = useRouter();
  const [didMount, setDidMount] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpenSaveModal, setIsOpenSaveModal] = useState(false);
  const [formData, setFormData] = useState<any>();
  const [infoStudySession, setInfoStudySession] = useState(props.studySession);
  // LƯU DATA BACKEND TRẢ VỀ
  const [dataAttendance, setDataAttendance] = useState(props.attendences);
  const [dataMakeUpLessons, setDataMakeUpLessons] = useState(props.makeups);
  // CONVERT DATA từ dataAttendance để render cho table
  const [dataTable, setDataTable] = useState<Array<any>>([]);
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isSmallTablet = useMediaQuery('(max-width: 768px)');
  const isLargetTablet = useMediaQuery('(max-width: 1024px)');
  // FORM
  const form = useForm({
    initialValues: {
      notes: infoStudySession?.notes
    },
    validate: yupResolver(schema),
  });
  // CHECK ON DID MOUNT
  useEffect(() => {
    if (props.studySession === null)
      router.replace("/not-found");
    else setDidMount(true);
  }, []);


  useEffect(() => {
    let dataTableTemp: any[] = [];
    // Attendance data
    if (dataAttendance && dataAttendance.length > 0) {
      const attendances = dataAttendance.map((e, index) => {
        if (!columnTable || columnTable.length == 0) return [];

        const foundOwnMakeUps = props.ownMakeups.find(makeup => makeup.student.user.id === e.student.user.id);
        return columnTable.map(_e => {
          if (_e._idColumn === COLUMN_ATTENDANCE.HO_TEN)
            return { _idColumn: COLUMN_ATTENDANCE.HO_TEN, valueRow: e.student.user.fullName }
          if (_e._idColumn === COLUMN_ATTENDANCE.MSHV)
            return { _idColumn: COLUMN_ATTENDANCE.MSHV, valueRow: e.student.user.id }
          if (_e._idColumn === COLUMN_ATTENDANCE.HOC_BU)
            return { _idColumn: COLUMN_ATTENDANCE.HOC_BU, templateRow: <TemplateCheckBoxStudy value={false} disabled={true} /> }
          if (_e._idColumn === COLUMN_ATTENDANCE.VANG)
            return { _idColumn: COLUMN_ATTENDANCE.VANG, templateRow: foundOwnMakeUps ? <TemplateCheckBoxAbsent onChange={(data: any) => handleDataUpdateAttendance(data)} idRow={index} value={!foundOwnMakeUps.isAttend} disabled={true} /> : <TemplateCheckBoxAbsent onChange={(data: any) => handleDataUpdateAttendance(data)} value={!e.isAttend} idRow={index} disabled={false} /> }
          if (_e._idColumn === COLUMN_ATTENDANCE.GHI_CHU)
            return { _idColumn: COLUMN_ATTENDANCE.GHI_CHU, valueRow: foundOwnMakeUps ? <TemplateComment makeupLesson={foundOwnMakeUps} comment={e.commentOfTeacher} /> : <TemplateNotes onChange={(data: any) => handleDataUpdateAttendance(data)} value={e.commentOfTeacher} idRow={index} /> }
          return {}
        })
      });
      dataTableTemp = dataTableTemp.concat(attendances);
    }
    // Make up data
    if (dataMakeUpLessons && dataMakeUpLessons.length > 0) {
      const makeups = dataMakeUpLessons.map((e, index) => {
        if (!columnTable || columnTable.length == 0) return []
        return columnTable.map(_e => {
          if (_e._idColumn === COLUMN_ATTENDANCE.HO_TEN)
            return { _idColumn: COLUMN_ATTENDANCE.HO_TEN, valueRow: e.student.user.fullName }
          if (_e._idColumn === COLUMN_ATTENDANCE.MSHV)
            return { _idColumn: COLUMN_ATTENDANCE.MSHV, valueRow: e.student.user.id }
          if (_e._idColumn === COLUMN_ATTENDANCE.HOC_BU)
            return { _idColumn: COLUMN_ATTENDANCE.HOC_BU, templateRow: <TemplateCheckBoxStudy value={true} disabled={true} /> }
          if (_e._idColumn === COLUMN_ATTENDANCE.VANG)
            return { _idColumn: COLUMN_ATTENDANCE.VANG, templateRow: <TemplateCheckBoxAbsent disabled={false} onChange={(data: any) => handleDataUpdateMakeUps(data)} value={!e.isAttend} idRow={index} /> }
          if (_e._idColumn === COLUMN_ATTENDANCE.GHI_CHU)
            return { _idColumn: COLUMN_ATTENDANCE.GHI_CHU, valueRow: <TemplateNotes onChange={(data: any) => handleDataUpdateMakeUps(data)} value={e.commentOfTeacher} idRow={index} /> }
          return {}
        })
      });
      dataTableTemp = dataTableTemp.concat(makeups);
    }
    setDataTable(dataTableTemp)
  }, [])



  const handleSubmit = async (values: any) => {
    let studySession = { ...infoStudySession, notes: values.notes };
    let dataSumit: any = { studySession: studySession }
    const attendance: UserAttendStudySession[] = Object.keys(dataUpdateAttendance).map((idRow: any) => ({
      ...dataAttendance[idRow],
      commentOfTeacher: dataUpdateAttendance[idRow].note === undefined ? dataAttendance[idRow].commentOfTeacher : dataUpdateAttendance[idRow].note,
      isAttend: dataUpdateAttendance[idRow].isAbsent === undefined ? dataAttendance[idRow].isAttend : !dataUpdateAttendance[idRow].isAbsent
    }));
    const makeups: MakeUpLession[] = Object.keys(dataUpdateMakeUps).map((idRow: any) => ({
      ...dataMakeUpLessons[idRow],
      commentOfTeacher: dataUpdateMakeUps[idRow].note === undefined ? dataMakeUpLessons[idRow].commentOfTeacher : dataUpdateMakeUps[idRow].note,
      isAttend: dataUpdateMakeUps[idRow].isAbsent === undefined ? dataMakeUpLessons[idRow].isAttend : !dataUpdateMakeUps[idRow].isAbsent
    }));
    dataSumit['makeups'] = makeups;
    dataSumit['attendance'] = attendance;
    setIsOpenSaveModal(true);
    setFormData(dataSumit);
  }


  const onSave = useCallback(async (formData: any) => {
    try {
      setIsSaving(true);
      const responses: any = await API.post(Url.teachers.modifyStudySessionDetail, {
        token: authState.token,
        ...formData
      });
      if (responses) {
        const urlArray = router.asPath.split("/");
        urlArray.pop();
        router.push(urlArray.join("/"));
        setIsOpenSaveModal(false);
        setIsSaving(false);
        toast.success("Lưu buổi học thành công.");
      } else {
        setIsOpenSaveModal(false);
        setIsSaving(false);
        toast.error("Lưu buổi học thất bại.");
      }
    } catch (error: any) {
      setIsOpenSaveModal(false);
      setIsSaving(false);
      if (error.status < 500) {
        if (error.data.message && typeof error.data.message === "string")
          toast.error(error.data.message);
        else if (error.data.message && Array.isArray(error.data.message)) {
          const messages: any[] = Array.from(error.data.message);
          if (messages.length > 0 && typeof messages[0] === "string")
            toast.error(messages[0]);
          else if (messages.length > 0 && Array.isArray(messages))
            toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại");
          else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.");
        } else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
      } else toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [authState.token]);


  const handleDataUpdateAttendance = (data: any) => {
    const { dataUpdate, idRow } = data
    if (!dataUpdate) return
    if (!dataUpdateAttendance[idRow]) dataUpdateAttendance = { ...dataUpdateAttendance, [idRow]: { ...dataUpdate } }
    else dataUpdateAttendance[idRow] = { ...dataUpdateAttendance[idRow], ...dataUpdate }
  }


  const handleDataUpdateMakeUps = (data: any) => {
    const { dataUpdate, idRow } = data
    if (!dataUpdate) return
    if (!dataUpdateMakeUps[idRow]) dataUpdateMakeUps = { ...dataUpdateMakeUps, [idRow]: { ...dataUpdate } }
    else dataUpdateMakeUps[idRow] = { ...dataUpdateMakeUps[idRow], ...dataUpdate }
  }


  const TemplateCheckBoxStudy = ({ value, disabled }: { value: boolean, disabled: boolean }) => {
    return <Checkbox
      readOnly
      disabled={disabled}
      checked={value}
    />
  }


  const TemplateCheckBoxAbsent = ({ onChange, value, idRow, disabled }: { onChange: any, value: boolean, idRow: number, disabled: boolean }) => {
    if (disabled)
      return <Checkbox
        readOnly
        disabled={disabled}
        checked={value}
      />

    const handleChange = (e: any) => {
      let dataUpdate = {
        isAbsent: e.target.checked
      }
      onChange({ dataUpdate, idRow })
    }
    return <Checkbox
      onChange={(e) => handleChange(e)}
      defaultChecked={value}
      transitionDuration={0}
    />
  }


  const TemplateNotes = React.memo(({ onChange, value, idRow }: { onChange: any, value?: string, idRow: number }) => {
    const [isEdit, setIsEdit] = useState(false)
    const [txtEdit, setTxtEdit] = useState(value || '')
    const [txtView, setTxtView] = useState(value || '')
    const handleSubmitEdit = () => {
      let dataUpdate = {
        note: txtEdit || ''
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
          onChange={(e) => setTxtEdit(e.target.value)}
        />
        <Group spacing={5} mt={5} >
          <Button type="button" size="xs" onClick={() => handleSubmitEdit()} >Lưu</Button>
          <Button color='red' size="xs" onClick={() => {
            setIsEdit(false);
            setTxtEdit(txtView);
          }} >Hủy</Button>
        </Group>
      </div>
      :
      <p>{txtView || ""} <button type="button" onClick={() => setIsEdit(true)} className={styles.buttonEditNotes}>{!txtView || txtView.length === 0 ? 'Thêm' : 'Thay đổi'}</button></p>
  })



  const TemplateComment = ({ makeupLesson, comment }: { makeupLesson: MakeUpLession | undefined, comment: string }) => {
    if (makeupLesson === undefined)
      return <Text>{comment}</Text>
    return <Container p={0}>
      <Text style={{ fontSize: "1.1rem" }} weight={600} color="dimmed">Học bù buổi khác
        <Text style={{ fontSize: "1.1rem" }} component="span" ml={8}>{moment(makeupLesson.targetStudySession.shifts[0].startTime).utcOffset(TimeZoneOffset).format("HH:mm") +
          "-" + moment(makeupLesson.targetStudySession.shifts[makeupLesson.targetStudySession.shifts.length - 1].endTime).utcOffset(TimeZoneOffset).format("HH:mm")}
        </Text>
        <Text style={{ fontSize: "1.1rem" }} component="span" ml={8}>{moment(makeupLesson.targetStudySession.date).utcOffset(TimeZoneOffset).format("DD/MM/YYYY")}</Text>
      </Text>
      <Text style={{ fontSize: "1.1rem" }} lineClamp={1} weight={600} color="dimmed">Khóa học:
        <Text weight={400} component="span" ml={8}>
          {makeupLesson.targetStudySession.course.name}
        </Text>
      </Text>
      {makeupLesson.commentOfTeacher && makeupLesson.commentOfTeacher.trim().length > 0 && (
        <Divider />
      )}
      {makeupLesson.commentOfTeacher && makeupLesson.commentOfTeacher.trim().length > 0 && (
        <Text>{makeupLesson.commentOfTeacher}</Text>
      )}
      {makeupLesson.commentOfTeacher && makeupLesson.commentOfTeacher.trim().length > 0 && (
        <Text style={{ fontSize: "1.1rem" }} align="right" color="dimmed" mr={8}> -- GV: {makeupLesson.targetStudySession.teacher.worker.user.fullName}</Text>
      )}
    </Container>
  }


  return (
    <>
      <Head>
        <title>Chỉnh sửa buổi học</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal
        opened={isOpenSaveModal}
        onClose={() => setIsOpenSaveModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <SaveModal
          loading={isSaving}
          title="Xác nhận lưu buổi học"
          message={`Bạn có chắc muốn lưu buổi học này chứ?`}
          buttonLabel="Xác nhận"
          onSave={() => onSave(formData)}
        />
      </Modal>

      {!didMount && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Loading />
        </Container>
      )}

      {didMount && (
        <Container size="xl" style={{ width: "100%" }}>
          <form
            onSubmit={form.onSubmit((values) => handleSubmit(values))}
            style={{ width: "100%" }}
          >
            <Title transform="uppercase" color="#444444" size="2.6rem" mt={20} align="left">
              {infoStudySession?.name || ""}
            </Title>
            <Text transform="uppercase" weight={600} color="#666666" style={{ fontSize: '1.6rem' }} align="justify">
              Khóa học: {infoStudySession?.course.name || ""}
            </Text>
            <Space h={30} />
            <Grid>
              <Grid.Col span={isLargetTablet ? (isSmallTablet ? 12 : 6) : 3}>
                <Group position={isSmallTablet ? "apart" : "left"} align="flex-start">
                  <Text color="#444444" mr={5}>Trợ giảng:</Text>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: isSmallTablet ? "flex-end" : "flex-start" }}>
                    <Text color="#444444">{infoStudySession?.tutor.worker.user.fullName || "-"}</Text>
                    <Text color="dimmed" style={{ fontSize: "1rem" }}>MSTG: {infoStudySession?.tutor.worker.user.id}</Text>
                  </div>
                </Group>
              </Grid.Col>
              <Grid.Col span={isLargetTablet ? (isSmallTablet ? 12 : 6) : 3}>
                <Group position={isSmallTablet ? 'apart' : 'left'} align="flex-start">
                  <Text color="#444444" mr={5}>Ngày: </Text>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: isSmallTablet ? "flex-end" : "flex-start" }}>
                    <Text color="#444444">{moment(infoStudySession?.date).utcOffset(TimeZoneOffset).format("DD/MM/YYYY") || '-'}</Text>
                    {
                      infoStudySession && infoStudySession.shifts && infoStudySession.shifts.length > 0 ?
                        <div>
                          <Text color="dimmed" style={{ fontSize: "1rem" }}>{
                            moment(infoStudySession.shifts[0].startTime).utcOffset(TimeZoneOffset).format("HH:mm")
                            + "-" + moment(infoStudySession.shifts[infoStudySession.shifts.length - 1].endTime).utcOffset(TimeZoneOffset).format("HH:mm")
                          }</Text>
                        </div> :
                        <Text color="dimmed" style={{ fontSize: "1rem" }}>--/--/----</Text>
                    }
                  </div>
                </Group>
              </Grid.Col>
              <Grid.Col span={isLargetTablet ? (isSmallTablet ? 12 : 6) : 3}>
                <Group position={isSmallTablet ? 'apart' : 'left'} align="flex-start" >
                  <Text color="#444444" mr={5}>Tình trạng: </Text>
                  {!infoStudySession && (
                    <Text color="#444444">-</Text>
                  )}
                  {infoStudySession &&
                    getStudySessionState(infoStudySession) === StudySessionState.Finish && (
                      <Text weight={600} component="span" color="pink"> Đã kết thúc</Text>
                    )}
                  {infoStudySession &&
                    getStudySessionState(infoStudySession) === StudySessionState.Ready && (
                      <Text weight={600} component="span" color="gray"> Chưa diễn ra</Text>
                    )}
                  {infoStudySession &&
                    getStudySessionState(infoStudySession) === StudySessionState.Start && (
                      <Text weight={600} component="span" color="green"> Đang diễn ra</Text>
                    )}
                </Group>
              </Grid.Col>
              <Grid.Col span={isLargetTablet ? (isSmallTablet ? 12 : 6) : 3}>
                <Group position={isSmallTablet ? 'apart' : 'left'} align="flex-start">
                  <Text color="#444">Phòng học:</Text>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: isSmallTablet ? "flex-end" : "flex-start" }}>
                    <Text color="#444">{infoStudySession?.classroom?.name || "-"}</Text>
                    {infoStudySession?.classroom && (
                      <Text color="dimmed" style={{ fontSize: "1rem" }}>{infoStudySession?.classroom.branch.name}</Text>
                    )}
                  </div>
                </Group>
              </Grid.Col>
            </Grid>
            <Space h={15} />
            <Text color="#444444" weight={700} style={{ fontSize: "1.8rem" }}>Ghi chú</Text>
            <Space h={10} />
            <Textarea
              withAsterisk
              placeholder="Ghi chú về buổi học"
              minRows={6}
              {...form.getInputProps('notes')}
            />

            <Space h={20} />
            <Text color="#444444" weight={700} style={{ fontSize: "1.8rem" }}>Điểm danh</Text>
            <Space h={20} />
            {
              !dataTable || dataTable.length === 0 ?
                <Text color="#444444">Không có thông tin</Text> :
                <Table
                  columnTable={columnTable}
                  rowTable={dataTable}
                  heightTable={isMobile ? 500 : 300}
                />
            }
            <Container my={20} style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
              <Button type="submit">Lưu thông tin</Button>
            </Container>
          </form>
        </Container>
      )}
    </>
  );
};

export default ModifyStudySessionScreen;

import { Checkbox, Container, Group, Modal, ScrollArea, Stack, Text, Title } from "@mantine/core";
import moment from "moment";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { Url, Weekday } from "../../../../helpers/constants";
import { getWeekdayName } from "../../../../helpers/getWeekdayName";
import Shift from "../../../../models/shift.model";
import { useAuth } from "../../../../stores/Auth";
import Button from "../../../commons/Button";
import ModalComponent from "../Modal/modal";

const weekDays = [
  Weekday.Monday,
  Weekday.Tuesday,
  Weekday.Wednesday,
  Weekday.Thursday,
  Weekday.Friday,
  Weekday.Saturday,
  Weekday.Sunday,
];
const startHourFirstShift = 7;
const startHourLastShift = 20;


interface IProps {
  allShifts: Shift[];
  freeShifts: Shift[];
}


const TutorRegisterShiftScreen = (props: IProps) => {
  const [authState] = useAuth();
  const [isOpenResetDataModal, setIsOpenResetDataModal] = useState(false);
  const [isOpenSaveDataModal, setIsOpenSaveDataModal] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isChange, setIsChange] = useState(false);                            // Detect start modifying data or not
  const [propsFreeShifts, setPropsFreeShifts] = useState(props.freeShifts);   // Backup
  const [freeShifts, setFreeShifts] = useState(props.freeShifts);             // Modified data and use for build shifts (table)
  const [shifts, setShifts] = useState<{ [key: string]: Shift[] }>({          // Use for build table
    [Weekday.Monday]: [],
    [Weekday.Tuesday]: [],
    [Weekday.Wednesday]: [],
    [Weekday.Thursday]: [],
    [Weekday.Friday]: [],
    [Weekday.Saturday]: [],
    [Weekday.Sunday]: [],
  });


  const hours = useMemo(() => {
    const result: any = [];
    for (let index = startHourFirstShift; index <= startHourLastShift; index++) {
      const startTime = new Date(0);
      const endTime = new Date(0);
      startTime.setHours(index);
      endTime.setHours(index + 1);
      result.push({ startTime: startTime, endTime: endTime });
    };
    return result;
  }, []);



  const loadData = useCallback(() => {
    // Classified shifts into weekdays
    const classifiedShift: { [key: string]: Shift[] } = {};
    props.allShifts.forEach((shift: Shift) => {
      if (!classifiedShift[shift.weekDay])
        classifiedShift[shift.weekDay] = [];
      classifiedShift[shift.weekDay].push(shift);
    });
    // Classified free shifts into weekdays
    const classifiedFreeShift: { [key: string]: Shift[] } = {};
    freeShifts.forEach((shift: Shift) => {
      if (!classifiedFreeShift[shift.weekDay])
        classifiedFreeShift[shift.weekDay] = [];
      classifiedFreeShift[shift.weekDay].push(shift);
    });
    // Create shifts tables
    const result: { [key: string]: Shift[] } = {};
    weekDays.forEach(weekday => {
      let currentFreeShiftIndex = 0;
      let currentShiftIndex = 0;
      result[weekday] = [];

      for (let index = startHourFirstShift; index <= startHourLastShift; index++) {
        let free = false;
        let id = -1;
        let startTime = new Date(0);
        let endTime = new Date(0);
        startTime.setHours(index);
        endTime.setHours(index + 1);

        if (classifiedShift[weekday] && classifiedShift[weekday].length > currentShiftIndex) {
          const shiftStartTime = new Date(classifiedShift[weekday][currentShiftIndex].startTime);
          const shiftEndTime = new Date(classifiedShift[weekday][currentShiftIndex].endTime);
          if (shiftStartTime.getHours() === index && shiftEndTime.getHours() === index + 1) {
            startTime = shiftStartTime;
            endTime = shiftEndTime;
            id = classifiedShift[weekday][currentShiftIndex].id;
            free = false;
            currentShiftIndex = currentShiftIndex + 1;
          }
        }
        if (classifiedFreeShift[weekday] && classifiedFreeShift[weekday].length > currentFreeShiftIndex) {
          const freeShiftStartTime = new Date(classifiedFreeShift[weekday][currentFreeShiftIndex].startTime);
          const freeShiftEndTime = new Date(classifiedFreeShift[weekday][currentFreeShiftIndex].endTime);
          if (freeShiftStartTime.getHours() === index && freeShiftEndTime.getHours() === index + 1) {
            startTime = freeShiftStartTime;
            endTime = freeShiftEndTime;
            id = classifiedFreeShift[weekday][currentFreeShiftIndex].id;
            free = true;
            currentFreeShiftIndex = currentFreeShiftIndex + 1;
          }
        }
        result[weekday].push({
          id: id,
          weekDay: weekday,
          startTime: startTime,
          endTime: endTime,
          free: free
        });
      }
    });
    setShifts(result);
  }, [props.allShifts, freeShifts, weekDays, startHourFirstShift, startHourLastShift]);


  const updateFreeShift = useCallback((shift: Shift) => {
    const foundShift = freeShifts.find(s => s.id === shift.id);
    const found = foundShift !== undefined;
    if (found == true) {
      const updatedFreeShifts = freeShifts.filter(s => s.id !== shift.id);
      setFreeShifts(updatedFreeShifts);
    } else {
      const updatedFreeShifts = freeShifts.concat(shift);
      updatedFreeShifts.sort((prev, next) => {
        const prevIndex = props.allShifts.findIndex(s => s.id === prev.id);
        const nextIndex = props.allShifts.findIndex(s => s.id === next.id);
        return prevIndex - nextIndex;
      })
      setFreeShifts(updatedFreeShifts);
    }
    setIsChange(true);
  }, [freeShifts, props.allShifts]);



  const resetData = useCallback(() => {
    setIsChange(false);
    setIsOpenResetDataModal(false);
    setFreeShifts(propsFreeShifts);
  }, [propsFreeShifts]);



  const onSaveData = useCallback(async () => {
    try {
      setIsSendingRequest(true);
      await API.post(Url.tutors.updateFreeShifts, {
        token: authState.token,
        shiftIds: freeShifts.map(s => s.id),
      });
      setPropsFreeShifts(freeShifts);
      setIsChange(false);
      setIsSendingRequest(false);
      setIsOpenSaveDataModal(false);
      toast.success("Cập nhật thành công.")
    } catch (error: any) {
      setIsSendingRequest(false);
      setIsOpenSaveDataModal(false);
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

  }, [freeShifts])


  useEffect(() => {
    loadData();
  }, [freeShifts]);


  return (
    <>
      <Head>
        <title>Đăng ký ca rảnh</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal
        opened={isOpenResetDataModal}
        onClose={() => setIsOpenResetDataModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <ModalComponent
          loading={false}
          callBack={resetData}
          buttonLabel="Hủy thay đổi"
          colorButton="red"
          title="Hủy thay đổi vừa thực hiện"
          message="Bạn có chắc muốn hủy thay đổi vừa thực hiện?"
        />
      </Modal>

      <Modal
        opened={isOpenSaveDataModal}
        onClose={() => setIsOpenSaveDataModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <ModalComponent
          loading={false}
          callBack={onSaveData}
          buttonLabel="Lưu thay đổi"
          colorButton="green"
          title="Lưu thay đổi vừa thực hiện"
          message="Bạn có chắc muốn lưu thay đổi vừa thực hiện?"
        />
      </Modal>


      <Container size="xl" style={{ width: "100%" }}>
        <Title transform="uppercase" align="center" size="2.6rem" my={20} color="#444">
          Đăng ký ca học rảnh
        </Title>
        <ScrollArea style={{ width: "100%" }}>
          <Group grow spacing={0} style={{ width: "100%", minWidth: "700px" }}>
            <Stack spacing={0}>
              <Text align="center" py={15} color="transparent" weight={600}>Giờ</Text>
              {hours.map((hour: any, hourIndex: number) => (
                <Container style={{
                  height: "50px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }} key={hourIndex} p={0}>
                  <Text style={{ fontSize: "1.1rem" }} color="dimmed">
                    {moment(hour.startTime).format("HH:mm") + " - " + moment(hour.endTime).format("HH:mm")}
                  </Text>
                </Container>
              ))}
            </Stack>
            {weekDays.map((weekday, weekdayIndex) => (
              <Stack key={weekdayIndex} spacing={0}>
                <Text align="center" py={15} color="#444" weight={600}>
                  {getWeekdayName(weekday)}
                </Text>
                {shifts[weekday].map((shift: Shift, shiftIndex: number) => {
                  const disbaled = shift.id == -1;
                  const firstCellRow = weekdayIndex === 0;
                  const firstCellCol = shiftIndex === 0;
                  return (
                    <Container key={shiftIndex} style={{
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: "#DEE2E6",
                      height: "50px",
                      width: "100%",
                      borderLeftWidth: firstCellRow ? 1 : 0,
                      borderTopWidth: firstCellCol ? 1 : 0,
                      backgroundColor: disbaled ? "#F1F3F5" : "transparent",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      transition: "all 0.1s ease-in-out"
                    }}>
                      <Checkbox checked={shift.free} onChange={() => updateFreeShift(shift)} />
                    </Container>
                  )
                })}
              </Stack>
            ))}
          </Group>
        </ScrollArea>
        <Container p={0} style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem"
        }} my={30}>
          <Button color="green" disabled={!isChange} onClick={() => setIsOpenSaveDataModal(true)}>Lưu thay đổi</Button>
          <Button color="red" disabled={!isChange} onClick={() => setIsOpenResetDataModal(true)}>Hủy</Button>
        </Container>
      </Container>
    </>
  );
}


export default TutorRegisterShiftScreen;
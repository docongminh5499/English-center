import { Container, Group, Modal, ScrollArea, Stack, Text } from "@mantine/core"
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import { Url, Weekday } from "../../../../helpers/constants";
import { getWeekdayName } from "../../../../helpers/getWeekdayName";
import Classroom from "../../../../models/classroom.model";
import Shift from "../../../../models/shift.model";
import UserTutor from "../../../../models/userTutor.model";
import { useAuth } from "../../../../stores/Auth";
import Loading from "../../../commons/Loading";
import StudySessionModal from "../Modal/session.modal";
import ShiftCell from "./shiftCell";

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
  branchId: number;
  numberShiftsPerSession: number,
  teacherId: number,
  beginingDate: Date,
  activeShiftIds: number[],
  onAddTimeTable: (shifts: Shift[], tutor: UserTutor, classroom: Classroom) => void;
}

const ShiftForm = (props: IProps) => {
  const [authState] = useAuth();
  const [loading, setLoading] = useState(true);
  const [chooseShifts, setChooseShifts] = useState<Shift[]>([]);
  const [isOpenStudySessionModal, setIsOpenStudySessionModal] = useState(false);
  const [shifts, setShifts] = useState<{ [key: string]: Shift[] }>({
    [Weekday.Monday]: [],
    [Weekday.Tuesday]: [],
    [Weekday.Wednesday]: [],
    [Weekday.Thursday]: [],
    [Weekday.Friday]: [],
    [Weekday.Saturday]: [],
    [Weekday.Sunday]: [],
  });


  const onSubmitModal = useCallback((data: any) => {
    setIsOpenStudySessionModal(false);
    props.onAddTimeTable(chooseShifts, data.tutor, data.classroom);
  }, [chooseShifts, chooseShifts.length]);


  const isDisabled = useCallback((weekDay: Weekday, index: number): boolean => {
    const currentDayShifs = shifts[weekDay];
    if (currentDayShifs.length < props.numberShiftsPerSession + index) return true;
    const slice = currentDayShifs.slice(index, index + props.numberShiftsPerSession);
    return !slice.reduce((acc, cur: Shift) =>
      acc && cur.free && props.activeShiftIds.indexOf(cur.id) === -1, true);
  }, [props.numberShiftsPerSession, shifts, props.activeShiftIds]);


  const loadFreeShifts = useCallback(async () => {
    try {
      setLoading(true);
      // Send API to get free shifts
      const responses: Shift[] = await API.post(Url.employees.getTeacherFreeShift, {
        token: authState.token,
        teacherId: props.teacherId,
        beginingDate: props.beginingDate,
      });
      // Classified free shifts into weekdays
      const classifiedFreeShift: { [key: string]: Shift[] } = {};
      responses.forEach((shift: Shift) => {
        if (!classifiedFreeShift[shift.weekDay])
          classifiedFreeShift[shift.weekDay] = [];
        classifiedFreeShift[shift.weekDay].push(shift);
      });

      // Create shifts tables
      const result: { [key: string]: Shift[] } = {};
      weekDays.forEach(weekday => {
        let currentIndex = 0;
        result[weekday] = [];

        for (let index = startHourFirstShift; index <= startHourLastShift; index++) {
          if (classifiedFreeShift[weekday] && classifiedFreeShift[weekday].length > currentIndex) {
            const freeShiftStartTime = new Date(classifiedFreeShift[weekday][currentIndex].startTime);
            const freeShiftEndTime = new Date(classifiedFreeShift[weekday][currentIndex].endTime);
            if (freeShiftStartTime.getHours() === index && freeShiftEndTime.getHours() === index + 1) {
              result[weekday].push({
                id: classifiedFreeShift[weekday][currentIndex].id,
                weekDay: weekday,
                startTime: freeShiftStartTime,
                endTime: freeShiftEndTime,
                free: true
              });
              currentIndex = currentIndex + 1;
              continue;
            }
          }
          const startTime = new Date(0);
          const endTime = new Date(0);
          startTime.setHours(index);
          endTime.setHours(index + 1);
          result[weekday].push({
            id: -1,
            weekDay: weekday,
            startTime: startTime,
            endTime: endTime,
            free: false
          });
        }
      });
      setShifts(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Hệ thống gặp sự cố. Vui lòng thử lại.")
    }
  }, [authState.token, props.teacherId, props.beginingDate, weekDays, startHourFirstShift, startHourLastShift]);



  useEffect(() => {
    loadFreeShifts();
  }, []);


  useEffect(() => {
    loadFreeShifts();
  }, [props.teacherId, props.numberShiftsPerSession, props.beginingDate])



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


  return (
    <>
      <Modal
        padding={16}
        opened={isOpenStudySessionModal}
        onClose={() => setIsOpenStudySessionModal(false)}
        centered
        closeOnClickOutside={true}
        overlayOpacity={0.55}
        overlayBlur={3}>
        <StudySessionModal
          branchId={props.branchId}
          beginingDate={props.beginingDate}
          shifts={chooseShifts}
          onSubmit={onSubmitModal}
        />
      </Modal>

      {loading && (
        <Container style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "500px"
        }} p={10} size="xl">
          <Loading />
        </Container>
      )}

      {!loading && (
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
                {shifts[weekday].map((shift: Shift, shiftIndex: number) => (
                  <ShiftCell
                    key={shiftIndex}
                    active={props.activeShiftIds.indexOf(shift.id) > -1}
                    firstCellRow={weekdayIndex === 0}
                    firstCellCol={shiftIndex === 0}
                    disbaled={isDisabled(weekday, shiftIndex)}
                    onClick={() => {
                      setChooseShifts(shifts[weekday].slice(shiftIndex, shiftIndex + props.numberShiftsPerSession))
                      setIsOpenStudySessionModal(true);
                    }}
                  />
                ))}
              </Stack>
            ))}
          </Group>
        </ScrollArea>
      )}
    </>
  )
}


export default ShiftForm;
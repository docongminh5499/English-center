import { Weekday } from "./constants";

export function getWeekdayName(weekDay?: Weekday) {
  switch (weekDay) {
    case Weekday.Monday:
      return "Thứ 2";
    case Weekday.Tuesday:
      return "Thứ 3";
    case Weekday.Wednesday:
      return "Thứ 4";
    case Weekday.Thursday:
      return "Thứ 5";
    case Weekday.Friday:
      return "Thứ 6";
    case Weekday.Saturday:
      return "Thứ 7";
    case Weekday.Sunday:
      return "Chủ nhật";
  }
}

import { SidebarItem } from "../../../interfaces/sidebarItem.interface";
import {
  IconCertificate,
  IconNotebook,
  IconSchool,
  IconCalendar,
  IconLamp2,
  IconUsers,
} from '@tabler/icons';
import { UserRole } from "../../../helpers/constants";

export const teacherSidebar: Array<SidebarItem> = [
  {
    src: IconCertificate,
    name: "Khóa học",
    href: "/teacher/course",
  },
  {
    src: IconNotebook,
    name: "Nhật ký",
    href: "/teacher/schedule",
  },
  {
    src: IconSchool,
    name: "Chương trình dạy",
    href: "/teacher/curriculum",
  },
];

export const tutorSidebar: Array<SidebarItem> = [
  {
    src: IconCertificate,
    name: "Khóa học",
    href: "/tutor/course",
  },
  {
    src: IconNotebook,
    name: "Nhật ký",
    href: "/tutor/schedule",
  },
  {
    src: IconCalendar,
    name: "Đăng ký ca rảnh",
    href: "/tutor/register-free-shifts",
  }
];

export const employeeSidebar: Array<SidebarItem> = [
  {
    src: IconCertificate,
    name: "Khóa học",
    href: "/employee/course",
  },
  {
    src: IconLamp2,
    name: "Phòng học",
    href: "/employee/classroom",
  },
  {
    src: IconUsers,
    name: "Học viên",
    href: "/employee/student",
  }
];

export const studentSidebar: Array<SidebarItem> = [
  {
    src: IconCalendar,
    name: "Thời khóa biểu",
    href: "/student/timetable",
  },
  {
    src: IconNotebook,
    name: "Khóa học của tôi",
    href: "/student/course",
  },
];
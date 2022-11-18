import { SidebarItem } from "../../../interfaces/sidebarItem.interface";
import {
  IconCertificate,
  IconNotebook,
  IconSchool,
  IconCalendar,
  IconLamp2,
  IconUsers,
  IconBrandCashapp,
  IconCoin,
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
  },
  {
    src: IconCoin,
    name: "Giao dịch",
    href: "/employee/transactions",
  },
  {
    src: IconUsers,
    name: "Nhân sự",
    href: "/employee/workers",
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

export const parentSidebar: Array<SidebarItem> = [
  {
    src: IconCalendar,
    name: "Thời khóa biểu",
    href: "/parent/timetable",
  },
  {
    src: IconNotebook,
    name: "Khóa học",
    href: "/parent/course",
  },
  {
    src: IconBrandCashapp,
    name: "Lịch sử thanh toán",
    href: "/parent/payment-history",
  },
];
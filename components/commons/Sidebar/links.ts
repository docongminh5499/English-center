import { SidebarItem } from "../../../interfaces/sidebarItem.interface";
import {
  IconCertificate,
  IconNotebook,
  IconSchool,
  IconCalendar,
} from '@tabler/icons';
import { UserRole } from "../../../helpers/constants";

export const teacherSidebar: Array<SidebarItem> = [
  {
    src: IconCertificate ,
    name: "Khóa học",
    href: "/teacher",
  },
  {
    src: IconNotebook,
    name: "Nhật ký",
    href: "/teacher/teaching-history",
  },
  {
    src: IconSchool ,
    name: "Chương trình dạy",
    href: "/teacher/curriculum",
  },
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
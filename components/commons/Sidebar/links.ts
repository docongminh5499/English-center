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
    href: "#!",
  },
  {
    src: IconSchool ,
    name: "Chương trình dạy",
    href: "#!",
  },
];

export const studentSidebar: Array<SidebarItem> = [
  {
    src: IconCalendar,
    name: "Thời khóa biểu",
    href: "#!",
  },
  {
    src: IconNotebook,
    name: "Khóa học của tôi",
    href: "#!",
  },
];

export function firstClickItem(role: UserRole | undefined){
  switch (role){
    case UserRole.STUDENT:
      return "Thời khóa biểu";
    case UserRole.TEACHER:
      return "Khóa học";
    default:
      return "";
  }
}
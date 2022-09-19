import { SidebarItem } from "../../../interfaces/sidebarItem.interface";
import {
  IconCertificate,
  IconNotebook,
  IconSchool,
} from '@tabler/icons';

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

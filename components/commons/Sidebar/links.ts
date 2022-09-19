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
    href: "#!",
  },
  {
    src: IconSchool ,
    name: "Chương trình dạy",
    href: "#!",
  },
];

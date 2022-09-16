import { NextPage } from "next/types";
import { UserRole } from "../helpers/constants";

export type CustomNextPage = NextPage & {
  allowUsers?: UserRole[];
  displaySidebar?: Boolean;
};

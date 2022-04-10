import { AppProps } from "next/app";
import { CustomNextPage } from "./page.interface";

export type CustomAppProps = AppProps & {
  Component: CustomNextPage;
};

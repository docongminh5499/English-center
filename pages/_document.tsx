import { createGetInitialProps } from '@mantine/next';
import {
  getCspInitialProps,
  provideComponents,
} from "@next-safe/middleware/dist/document";
import Document, { Html, Main } from 'next/document';

const mantineGetInitialProps = createGetInitialProps();
export default class _Document extends Document {
  static async getInitialProps(ctx: any) {
    const mantineInitialProps = await mantineGetInitialProps(ctx);
    const cspInitialProps = await getCspInitialProps({ ctx });
    return { ...mantineInitialProps, ...cspInitialProps };
  }

  render() {
    const { Head, NextScript } = provideComponents(this.props);
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
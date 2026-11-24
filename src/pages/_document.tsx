import { Html, Head, Main, NextScript } from "next/document";

import ThemeConfig from "../../theme.config.json";

const FaviconVersion = `helio-os-${ThemeConfig.palette}`;

function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="icon"
          href={`/favicon.ico?v=${FaviconVersion}`}
          sizes="16x16 32x32 48x48 64x64"
        />
        <link
          rel="icon"
          href={`/favicon.svg?v=${FaviconVersion}`}
          type="image/svg+xml"
          sizes="any"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;

import { Html, Head, Main, NextScript } from "next/document";

function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="icon"
          href="/favicon.ico?v=helio-os"
          sizes="16x16 32x32 48x48 64x64"
        />
        <link
          rel="icon"
          href="/favicon.svg?v=helio-os"
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

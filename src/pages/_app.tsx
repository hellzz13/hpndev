import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { ThemeContextProvider } from "@/context/AppThemeContext";

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeContextProvider>
      <Component {...pageProps} />
      <Analytics mode="production" />
    </ThemeContextProvider>
  );
}

export default App;

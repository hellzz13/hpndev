import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { ThemeContextProvider } from "@/context/AppThemeContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeContextProvider>
      <Component {...pageProps} />
      <Analytics mode="production" />
    </ThemeContextProvider>
  );
}

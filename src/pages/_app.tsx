import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "@/components/ui/provider";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logo.png" />
        <title>Telekvis</title>
      </Head>
      <div className="font-poppins">
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

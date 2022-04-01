import "../styles/globals.css";

import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../common/theme";
import {
  defaultChains,
  defaultL2Chains,
  developmentChains,
  InjectedConnector,
  Provider,
} from "wagmi";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { SWRConfig } from "swr";
import { Fonts } from "@/components/UtilityComponents/Fonts";
import Script from "next/script";
import { CheckIfConnected } from "@/components/UtilityComponents/CheckIfConnected";

function MyApp({ Component, pageProps }: AppProps) {
  const chains = [...defaultChains, ...defaultL2Chains, ...developmentChains];
  const connectors = [
    new InjectedConnector({ chains: chains }),
    new WalletConnectConnector({
      chains: chains,
      options: {
        infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
        qrcode: true,
      },
    }),
  ];
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"
        strategy="beforeInteractive"
      />

      <Script src="/scripts/CustomEase.min.js" strategy="beforeInteractive" />
      <Script src="/scripts/gsap.min.js" strategy="beforeInteractive" />
      <Script
        src="/scripts/MorphSVGPlugin.min.js"
        strategy="beforeInteractive"
      />
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <Provider
          autoConnect
          connectorStorageKey="collectrWallet"
          connectors={connectors}
        >
          <Component {...pageProps} />
        </Provider>
      </SWRConfig>
    </ChakraProvider>
  );
}

export default MyApp;

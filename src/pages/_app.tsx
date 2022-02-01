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

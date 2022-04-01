// Button.stories.js|jsx

import { Box, PlacementWithLogical } from "@chakra-ui/react";
import React from "react";

import { AskTwitter } from "./AskTwitter";
import { Inner as ConnectedButton } from "./Connected";
import { Inner as ConnectWallet } from "./ConnectWallet";
import { Inner as Mint } from "./Mint";
import { PassCTAButton } from "./PassCTA";
import { PreviewGalleryButton } from "./PreviewGallery";
import { action } from "@storybook/addon-actions";
import { TransactionReceipt } from "@ethersproject/abstract-provider";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Button",
  subcomponents: { AskTwitter, ConnectedButton, ConnectWallet },
};

export const AskTwitterButton = () => (
  <Box width="200px" height="50px">
    <AskTwitter />
  </Box>
);

const ConnectWalletTemplate = (
  args: JSX.IntrinsicAttributes & { connectors: any; connect: any }
) => {
  const connectors = [
    { ready: true, name: "MetaMask" },
    { ready: true, name: "WalletConnect" },
  ];
  return (
    <Box width="200px" height="50px">
      <ConnectWallet connectors={connectors} {...args} />
    </Box>
  );
};

export const ConnectWalletButton = ConnectWalletTemplate.bind({});
ConnectWalletButton.args = {
  connect: action("Connect!"),
};

const ConnectedWalletTemplate = (
  args: JSX.IntrinsicAttributes & {
    placement: any;
    accountName: any;
    disconnect: any;
  }
) => (
  <Box width="200px" height="50px">
    <ConnectedButton {...args} />
  </Box>
);
export const ConnectedWalletButton = ConnectedWalletTemplate.bind({});
ConnectedWalletButton.args = {
  accountName: "testAccount",
  disconnect: action("Logout!"),
};

const MintTemplate = (
  args: JSX.IntrinsicAttributes & {
    connected: boolean;
    mintCollectr: () => Promise<void>;
    waitingForTx: boolean;
    data: TransactionReceipt;
    error: Error;
  }
) => (
  <Box width="200px" height="50px">
    <Mint {...args} />
  </Box>
);
export const MintButton = MintTemplate.bind({});
MintButton.args = {
  name: "Not Connected",
  connected: false,
  mintCollectr: action("Mint Collectr"),
  waitingForTx: false,
  data: undefined as TransactionReceipt,
  error: undefined,
};

MintButton.parameters = { controls: { exclude: ["mintCollectr"] } };

export const PassCTA = () => (
  <Box width="200px" height="50px">
    <PassCTAButton />
  </Box>
);

export const PreviewGallery = () => (
  <Box width="200px" height="50px">
    <PreviewGalleryButton />
  </Box>
);

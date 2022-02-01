import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
  Button,
  PlacementWithLogical,
} from "@chakra-ui/react";
import React from "react";
import { useAccount, useConnect, useEnsLookup } from "wagmi";
import { RiArrowDownSLine } from "react-icons/ri";
import { truncateAddress } from "../../../common/utils";
import { Logout } from "../../SVG";
export const ConnectedButton = ({
  placement = "bottom-start",
}: {
  placement?: PlacementWithLogical;
}) => {
  const [{ data, loading: loadingAccount }, disconnect] = useAccount();

  const [{ data: ens }] = useEnsLookup({
    address: loadingAccount ? "" : data?.address,
  });
  const accountName =
    (ens && ens.length > 11 ? truncateAddress(ens, 4) : ens) ||
    "0x" + truncateAddress(data?.address.slice(2), 3);

  const ConnectedIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="7.99992" cy="8.00016" r="6.66667" fill="#21DF21" />
    </svg>
  );

  return (
    <Menu placement={placement} gutter={0}>
      <MenuButton
        as={Button}
        bg="#F2F2F2"
        width="100%"
        height="100%"
        color="#000000"
        borderRadius="none"
        border="2px solid #F2F2F2"
        rightIcon={<RiArrowDownSLine />}
      >
        <Box display="flex" alignItems="center">
          <ConnectedIcon /> <Box pl="10px">{accountName}</Box>
        </Box>
      </MenuButton>
      <MenuList color="black" maxW="180px">
        <MenuItem
          _hover={{ bg: "#FFFFFF" }}
          _focus={{ bg: "#FFFFFF" }}
          onClick={disconnect}
        >
          <Logout width={24} height={24} />
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

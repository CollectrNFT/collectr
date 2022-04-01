import {
  Box,
  Link,
  Stack,
  Text,
  useBreakpointValue as getBreakpoints,
} from "@chakra-ui/react";
import React from "react";
import { SiDiscord, SiTwitter } from "react-icons/si";
import { FooterLogo, Opensea } from "../SVG";
interface Props {}

export const Footer = ({ borderTop = false }) => {
  const navItems = [
    { title: "About", link: "/about" },
    { title: "Terms of Use", link: "/tos" },
    { title: "Privacy Policy", link: "/privacy" },
    { title: "Help", link: "/help" },
  ];

  const externalNavItems = [
    { title: "Opensea", link: "/", icon: <Opensea /> },
    {
      title: "Discord",
      link: "/",
      icon: <SiDiscord size="24px" color="#000000" />,
    },
    {
      title: "Twitter",
      link: "/",
      icon: <SiTwitter size="24px" color="#000000" />,
    },
  ];
  const TextBP = getBreakpoints({
    base: "24",
    md: "32",
    lg: "32",
    xl: "32",
    "2xl": "32",
  });
  return (
    <Box
      px={["32px", null, "72px"]}
      borderTop={borderTop ? "2px solid black" : ""}
    >
      <Box
        display={"flex"}
        justifyContent="space-between"
        flexWrap={"wrap"}
        flexDir={["column", null, null, "row"]}
        pt={["62px", null, null, "148px"]}
        pb={["57px", null, null, "164px"]}
      >
        <Stack
          direction={["column", null, null, "row"]}
          gap={["31px", null, null, "103px"]}
          mb={["56px"]}
          mr="20px"
          justifyContent={"space-between"}
        >
          {navItems.map((item) => {
            return (
              <Link href={item.link} key={item.title}>
                <Text variant={TextBP}>{item.title}</Text>
              </Link>
            );
          })}
        </Stack>
        <Stack direction={"row"} alignItems="flex-start" gap="65px" mt="11px">
          {externalNavItems.map((item) => {
            return (
              <Link href={item.link} key={item.title}>
                {item.icon}
              </Link>
            );
          })}
        </Stack>
      </Box>
      <Box position="absolute" bg="white" left={0} right={0}>
        <FooterLogo />
      </Box>
    </Box>
  );
};

import { Box, Link, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { SiDiscord, SiTwitter } from "react-icons/si";
import { FooterLogo, Opensea } from "../SVG";
interface Props {}

export const Footer = () => {
  const navItems = [
    { title: "About", link: "/" },
    { title: "Terms of Use", link: "/" },
    { title: "Privacy Policy", link: "/" },
    { title: "Help", link: "/" },
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
  return (
    <Box px={["32px", null, "72px"]}>
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
              <Link
                fontSize={["1.5rem", null, null, null, "2rem"]}
                href={item.link}
                key={item.title}
              >
                {item.title}
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

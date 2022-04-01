import { parseNFTImage } from "@/common/utils";
import { Box, Image } from "@chakra-ui/react";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";

interface IImageContainer {
  collectionSize: number;
  image: string;
}

export const ImageContainer: FC<IImageContainer> = ({
  collectionSize,
  image,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const isSquare =
    imageRef.current?.naturalWidth === imageRef.current?.naturalHeight;
  return (
    <Box
      width={`${collectionSize}px`}
      height={`${collectionSize}px`}
      display="flex"
      justifyContent="center"
    >
      <Box display="flex" alignItems="center" objectFit="contain">
        <Box
          sx={{
            "& > img": {
              maxW: `${collectionSize}px`,
              maxH: `${collectionSize}px`,
              ...(isSquare && {
                height: "auto",
                width: `${0.75 * collectionSize}px`,
              }),
            },
            "& > div > svg": {
              width: `${collectionSize}px`,
              height: `${collectionSize}px`,
              ...(isSquare && {
                height: "auto",
                width: `${0.75 * collectionSize}px`,
              }),
            },
          }}
        >
          {parseNFTImage(image)}
        </Box>
      </Box>
    </Box>
  );
};
{
  /* <Image
            alt="image"
            src={image}
            maxW={`${collectionSize}px`}
            maxH={`${collectionSize}px`}
            sx={{
              ...(isSquare && {
                height: "auto",
                width: `${0.75 * collectionSize}px`,
              }),
            }}
            ref={imageRef}
          /> */
}

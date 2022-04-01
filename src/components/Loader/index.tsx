import { Box } from "@chakra-ui/react";
import React from "react";
import styles from "./Loader.module.css";
import Script from "next/script";

const Loader = ({ size = "80px" }) => {
  return (
    <>
      <Script src="/scripts/scripts.js" strategy="afterInteractive" />
      <Box id="loader-wrapper">
        <div style={{ position: "relative", width: size, height: size }}>
          {/* <!-- background --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
            <path id="bg-1" fill="#000000" d="M0 0h300v300H0V0z" />
          </svg>

          {/* <!-- square --> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.squareShape}
            viewBox="0 0 300 300"
          >
            <path id="square-1" fill="#FFF" d="M150 150h150v150H150V150z" />
            <path id="square-2" d="M0 150h300v300H0V150z" />
            <path
              id="square-3"
              d="m150 150 212.1 212.1L150 574.3-62.1 362.1 150 150z"
            />
            <path
              id="square-4"
              d="M2.6 297.6 300.1 0l297.6 297.6-297.6 297.5L2.6 297.6z"
            />
            <path
              id="square-5"
              d="M150 150.1 362.1-62l212.1 212.1-212.1 212.2L150 150.1z"
            />
            <path id="square-6" d="M150 0h300v300H150V0z" />
            <path id="square-7" fill="#FFF" d="M150 75h150v150H150V75z" />
          </svg>

          <svg className={styles.circleShape} width="300" viewBox="0 0 300 300">
            <path
              id="circle-1"
              d="M150 0c82.8 0 150 67.2 150 150s-67.2 150-150 150S0 232.8 0 150 67.2 0 150 0z"
            />
            <path
              id="circle-2"
              d="M75 150c41.4 0 75 33.6 75 75s-33.6 75-75 75-75-33.6-75-75 33.6-75 75-75z"
            />
            <path
              id="circle-3"
              d="M0 150c82.8 0 150 67.2 150 150S82.8 450 0 450s-150-67.2-150-150S-82.8 150 0 150z"
            />
            <path
              id="circle-4"
              d="M300 226.5C300 267.093 267.093 300 226.5 300C185.907 300 153 267.093 153 226.5C153 185.907 185.907 153 226.5 153C267.093 153 300 185.907 300 226.5Z"
            />
            <path
              id="circle-5"
              d="M75 75c41.4 0 75 33.6 75 75s-33.6 75-75 75-75-33.6-75-75 33.6-75 75-75z"
            />
            <path
              id="circle-6"
              d="M150 0c82.8 0 150 67.2 150 150s-67.2 150-150 150S0 232.8 0 150 67.2 0 150 0z"
            />
            <path
              id="circle-7"
              d="M225 75c41.4 0 75 33.6 75 75s-33.6 75-75 75-75-33.6-75-75 33.6-75 75-75z"
            />
          </svg>
        </div>
      </Box>
    </>
  );
};

export default Loader;

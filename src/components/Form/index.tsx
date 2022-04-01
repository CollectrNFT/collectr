import {
  Box,
  Input as ChakraInput,
  Checkbox as ChakraCheckbox,
  Textarea as ChakraTextarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

export const Input = ({ label, ...props }) => {
  const [field, meta] = useField(props as any);
  return (
    <>
      <ChakraInput
        isInvalid={meta.touched && Boolean(meta.error)}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? <Box color="red">{meta.error}</Box> : null}
    </>
  );
};

export const Checkbox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...(props as any), type: "checkbox" });
  return (
    <Box display="flex" sx={{ columnGap: "8px" }}>
      <ChakraCheckbox
        isInvalid={meta.touched && Boolean(meta.error)}
        {...field}
        {...props}
      />
      {children}
      {meta.touched && meta.error ? <Box color="red">{meta.error}</Box> : null}
    </Box>
  );
};
export const Textarea = ({ label, ...props }) => {
  const [field, meta] = useField(props as any);
  return (
    <>
      <ChakraTextarea
        isInvalid={meta.touched && Boolean(meta.error)}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? <Box color="red">{meta.error}</Box> : null}
    </>
  );
};

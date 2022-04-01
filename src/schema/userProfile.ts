import * as Yup from "yup";

const userProfileSchema = Yup.object({
  username: Yup.string()
    .max(15, "Must be 15 characters or less")
    .required("Username Required"),
  bio: Yup.string().max(250, "Must be 250 characters or less").nullable(),
  email: Yup.string().email("Invalid email address").nullable(),
  sendEmail: Yup.boolean().required(),
});
export default userProfileSchema;

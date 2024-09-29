const { z } = require("zod");

const registrationValidationSchema = z.object(
  {
    userName: z
      .string({ required_error: "username is required" })
      .trim()
      .min(3, { message: "minimum 3 characters in username" }),
    password: z
      .string({ required_error: "password is required" })
      .min(5, { message: "minimum 5 characters in password" }),
  }
);
module.exports = registrationValidationSchema;
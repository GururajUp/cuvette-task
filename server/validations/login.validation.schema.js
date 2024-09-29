const { z } = require("zod");

const loginValidationSchema = z.object({
  userName: z.string().trim().min(1, { message: "username is required" }),
  password:z.string().trim().min(1, { message: "password is required" })
});

module.exports = loginValidationSchema;
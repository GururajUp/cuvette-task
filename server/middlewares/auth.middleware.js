const { z } = require("zod");

const validate = (schema) => async (req, res, next) => {
  console.log("schema access : ",req.body);
  try {
    if (!schema instanceof z.ZodType) {
      return res.status(422).json({ message: "zod schema error" });
    } else {
      const parseBody = await schema.parseAsync(req.body);
      console.log("parse Body from auth middleware : ", parseBody);
      next();
    }
  } catch (err) {
    const status = 422;
    const message = "please give proper input";
    const extraDetails = err.errors[0].message;
    const error = { status, message, extraDetails };
    // console.log(err);
    next(error);
  }
};
module.exports = validate;
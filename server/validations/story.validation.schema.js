const { z } = require("zod");

const storyValidationSchema = z.object({
  slides: z.array(
    z.object({
      heading: z.string({required_error:"heading is required"}).min(1), 
      description: z.string({required_error:"description is required"}).min(1), 
      imageUrl: z.string({required_error:"imageUrl is required"}).url(), 
      categories: z.string({required_error:"categories is required"}),
    })
  ),
  likes: z.array(z.string()).optional(), // Array of strings (User IDs)
});

module.exports = storyValidationSchema;
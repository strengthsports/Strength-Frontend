import { z } from "zod"

const signupSchema = z.object({
  name: z
  .string()
  .nonempty('Name is required'),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters long")
})
export default signupSchema

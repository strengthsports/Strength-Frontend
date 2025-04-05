import { z } from "zod";

const loginSchema = z
  .object({
    email: z.string().email("Invalid email").optional(),
    username: z.string().optional(),
    password: z.string().nonempty("Password is required"),
  })
  .refine((data) => data.email || data.username, {
    message: "Either email or username is required",
    path: ["email"], // You can also use ["username"] or []
  });
export default loginSchema;

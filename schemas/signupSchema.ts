import { z } from "zod"

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  },  { message: "Invalid date format. Use 'YYYY-MM-DD'." }),
  gender: z.enum(["Male", "Female"], { errorMap: () => ({ message: "Invalid gender value" }) })

  // password: z
  //   .string()
  //   .nonempty("Password is required")
  //   .min(6, "Password must be at least 6 characters long")
})
export default signupSchema

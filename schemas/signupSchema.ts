import { z } from "zod"

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  },  { message: "Invalid date format. Use 'YYYY-MM-DD'." }),
  gender: z.enum(["male", "female"], { errorMap: () => ({ message: "Invalid gender value" }) })

  // password: z
  //   .string()
  //   .nonempty("Password is required")
  //   .min(6, "Password must be at least 6 characters long")
})

export const otpSchema = z.object({
  OTP: z
    .string()
    .regex(/^\d+$/, "OTP must contain only numbers.")
    .length(6, "OTP must be exactly 6 digits."),
  userId: z.string().nonempty("User ID is required."),
})

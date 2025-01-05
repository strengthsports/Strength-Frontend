import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  dateOfBirth: z
    .string()
    .nonempty("Date of birth is required")
    .refine(
      (date) => {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
      },
      { message: "Invalid date format. Use 'YYYY-MM-DD'." }
    ),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender is required" }),
  }),

  // password: z
  //   .string()
  //   .nonempty("Password is required")
  //   .min(6, "Password must be at least 6 characters long")
});

export const otpSchema = z.object({
  OTP: z
    .string()
    .regex(/^\d+$/, "OTP must contain only numbers.")
    .length(6, "OTP must be exactly 6 digits."),
  userId: z.string().nonempty("User ID is required."),
});
export const resendOtpSchema = z.object({
  userId: z.string().nonempty("User ID is required."),
  email: z.string()
});
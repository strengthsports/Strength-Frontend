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
    .optional()
    .refine(
      (date) => {
        if (date === "") return true;

        const regex = /^\d{2}-\d{2}-\d{4}$/;
        if (!regex.test(date)) return false;

        const [day, month, year] = date.split("-").map(Number);
        const parsedDate = new Date(year, month - 1, day);

        // Validate that parsed date components match exactly
        return (
          !isNaN(parsedDate.getTime()) &&
          parsedDate.getDate() === day &&
          parsedDate.getMonth() === month - 1 &&
          parsedDate.getFullYear() === year
        );
      },
      { message: "Invalid date format. Use 'DD-MM-YYYY'." }
    ),

  gender: z.union([z.enum(["male", "female"]), z.literal("")]).optional(),

  userType: z.string().nonempty("User type is required"),

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
  email: z.string(),
});

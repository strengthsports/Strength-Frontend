import { z } from "zod";

export const usernameSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required.")
    .refine(
      (value) => /^[a-z0-9._]*$/.test(value),
      { message: "Username can only contain lowercase letters, numbers, periods, and underscores." }
    )
    .refine(
      (value) => !/[A-Z]/.test(value),
      { message: "Username must not contain uppercase letters." }
    )
    .refine(
      (value) => {
        if (value.startsWith("_") || value.startsWith(".")) {
          return value.length > 1 && /^[a-z0-9]/.test(value[1]);
        }
        return true;
      },
      { message: "Username cant be only underscore(_) or period(.)." }
    ),
});

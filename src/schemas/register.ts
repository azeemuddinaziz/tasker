import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(6, "Username at least have 6 charecters.")
    .max(20, "Username max charecter limit is 20."),
  email: z.string().email({ message: "Enter a valid email id." }),
  password: z.string().min(6, "Password at least have 6 charecters."),
});

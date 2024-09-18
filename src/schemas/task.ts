import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(5, "Title must have at least 5 charecters."),
  description: z.string(),
  status: z.string(),
  priority: z.string(),
  dueDate: z.date(),
});

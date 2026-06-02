import { z } from "zod";
import { scenarios } from "@/types/analysis";

export const analyzeRequestSchema = z.object({
  message: z.string().trim().min(2, "请输入至少 2 个字").max(3000, "消息不能超过 3000 字"),
  scenario: z.enum(scenarios),
});

export const analysisResultSchema = z.object({
  realIntent: z.array(z.string()).min(1),
  tasks: z.array(z.string()).min(1),
  priority: z.enum(["高", "中", "低", "需要确认"]),
  priorityReason: z.string().min(1),
  deadline: z.string().min(1),
  risks: z.array(z.string()),
  suggestedReply: z.string().min(1),
  replyVariants: z.object({
    stronger: z.string().min(1),
    softer: z.string().min(1),
    professional: z.string().min(1),
  }),
  needsConfirmation: z.array(z.string()),
});

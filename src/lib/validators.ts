import { z } from "zod";
import { identities, outputFormats } from "@/types/analysis";

export const analyzeRequestSchema = z
  .object({
    message: z.string().trim().max(3000, "文字内容不能超过 3000 字").optional().default(""),
    imageDataUrl: z.string().trim().optional(),
    identity: z.enum(identities),
    outputFormat: z.enum(outputFormats).optional(),
    personName: z.string().trim().max(40, "人物名称不能超过 40 个字").optional(),
  })
  .refine((value) => value.message.length >= 2 || Boolean(value.imageDataUrl), {
    message: "请粘贴至少 2 个字，或上传一张聊天截图",
    path: ["message"],
  });

export const analysisResultSchema = z.object({
  realIntent: z.array(z.string()).min(1),
  solutionOutline: z.array(z.string()),
  risks: z.array(z.string()),
  reply: z.string().nullable().optional(),
  personProfileUpdate: z.string().nullable().optional(),
  userProfileUpdate: z.string().nullable().optional(),
});

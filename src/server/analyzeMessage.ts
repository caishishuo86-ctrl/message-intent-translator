import { analyzeWithModel } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { analyzeRequestSchema } from "@/lib/validators";

export async function analyzeMessage(input: unknown) {
  const payload = analyzeRequestSchema.parse(input);
  const result = await analyzeWithModel(payload.message, payload.scenario);

  if (process.env.DATABASE_URL) {
    await prisma.analysis.create({
      data: {
        inputMessage: payload.message,
        scenario: payload.scenario,
        analysisResult: result,
      },
    });
  }

  return result;
}

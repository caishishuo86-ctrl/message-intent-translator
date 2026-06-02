import { analyzeWithModel } from "@/lib/ai";
import { readPersonProfile, updatePersonProfile } from "@/lib/people";
import { prisma } from "@/lib/prisma";
import { analyzeRequestSchema } from "@/lib/validators";

export async function analyzeMessage(input: unknown) {
  const payload = analyzeRequestSchema.parse(input);
  const personProfile = await readPersonProfile(payload.personName);
  const result = await analyzeWithModel({ ...payload, personProfile });

  if (payload.personName) {
    await updatePersonProfile(payload.personName, payload.message, result);
  }

  if (process.env.DATABASE_URL) {
    await prisma.analysis.create({
      data: {
        inputMessage: payload.message || "[image input]",
        scenario: payload.personName ? `${payload.identity}/${payload.personName}` : payload.identity,
        analysisResult: result,
      },
    });
  }

  return result;
}

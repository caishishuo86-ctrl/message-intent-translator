import { analyzeWithModel } from "@/lib/ai";
import { readPersonProfile, updatePersonProfile } from "@/lib/people";
import { prisma } from "@/lib/prisma";
import { readUserProfile, updateUserProfile } from "@/lib/userProfile";
import { analyzeRequestSchema } from "@/lib/validators";

export async function analyzeMessage(input: unknown) {
  const payload = analyzeRequestSchema.parse(input);
  const [personProfile, userProfile] = await Promise.all([
    readPersonProfile(payload.personName),
    readUserProfile(),
  ]);
  const result = await analyzeWithModel({ ...payload, personProfile, userProfile });

  await Promise.all([
    payload.personName ? updatePersonProfile(payload.personName, payload.message, result) : Promise.resolve(),
    updateUserProfile(result),
  ]);

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

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { AnalysisResult } from "@/types/analysis";

const userDir = path.join(process.cwd(), "data", "user");
const userProfilePath = path.join(userDir, "agent.md");

export async function readUserProfile() {
  try {
    return await readFile(userProfilePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
}

export async function updateUserProfile(result: AnalysisResult) {
  if (!result.userProfileUpdate?.trim()) return;

  await mkdir(userDir, { recursive: true });

  const previous = await readUserProfile();
  const now = new Date().toISOString().slice(0, 10);
  const content = previous?.trim()
    ? `${previous.trim()}\n\n## ${now} 更新\n\n${result.userProfileUpdate.trim()}\n`
    : `# 用户语言画像\n\n## 沟通偏好\n\n${result.userProfileUpdate.trim()}\n`;

  await writeFile(userProfilePath, content, "utf8");
}

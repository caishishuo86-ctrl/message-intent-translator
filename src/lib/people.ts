import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { AnalysisResult } from "@/types/analysis";

const peopleRoot = path.join(process.cwd(), "data", "people");

function safePersonName(personName: string) {
  return personName.trim().replace(/[\\/:*?"<>|]/g, "").slice(0, 40);
}

function personDir(personName: string) {
  const safeName = safePersonName(personName);
  if (!safeName) {
    throw new Error("人物名称不能为空");
  }
  return path.join(peopleRoot, safeName);
}

export async function listPeople() {
  try {
    const entries = await readdir(peopleRoot, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort((a, b) => a.localeCompare(b, "zh-CN"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function readPersonProfile(personName?: string) {
  if (!personName?.trim()) return undefined;

  try {
    return await readFile(path.join(personDir(personName), "agent.md"), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
}

export async function updatePersonProfile(personName: string, message: string, result: AnalysisResult) {
  const safeName = safePersonName(personName);
  if (!safeName || !result.personProfileUpdate?.trim()) return;

  const dir = personDir(safeName);
  await mkdir(dir, { recursive: true });

  const previous = await readPersonProfile(safeName);
  const now = new Date().toISOString().slice(0, 10);
  const content = previous?.trim()
    ? `${previous.trim()}\n\n## ${now} 更新\n\n${result.personProfileUpdate.trim()}\n\n### 样本摘要\n\n${result.realIntent.join("；")}\n`
    : `# ${safeName}\n\n## 沟通画像\n\n${result.personProfileUpdate.trim()}\n\n## ${now} 样本摘要\n\n${result.realIntent.join("；")}\n`;

  await writeFile(path.join(dir, "agent.md"), content, "utf8");
}

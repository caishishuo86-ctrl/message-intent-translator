"use client";

import type { ReactNode } from "react";
import { AlertTriangle, Copy, Lightbulb, MessageSquareText, Target, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult as AnalysisResultType } from "@/types/analysis";

type Props = {
  result: AnalysisResultType;
};

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="rounded-md border border-zinc-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-950">
        {icon}
        {title}
      </div>
      {children}
    </section>
  );
}

function List({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (items.length === 0) {
    return <p className="text-sm leading-6 text-zinc-500">{emptyText}</p>;
  }

  return (
    <ul className="space-y-2 text-sm leading-6 text-zinc-700">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function AnalysisResult({ result }: Props) {
  const copyText = [
    `真实意图：${result.realIntent.join("；")}`,
    `解决方案纲要：${result.solutionOutline.join("；") || "暂无具体行动项"}`,
    `风险提示：${result.risks.join("；") || "暂无明显风险"}`,
    result.reply ? `回复：${result.reply}` : "",
    result.personProfileUpdate ? `人物画像更新：${result.personProfileUpdate}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-zinc-500">分析结果</p>
          <p className="mt-1 text-sm text-zinc-700">按真实意图、解决方案纲要、风险提示和可选回复整理。</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigator.clipboard.writeText(copyText)}
        >
          <Copy size={16} />
          复制结果
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section icon={<Target size={17} />} title="1. 真实意图">
          <List items={result.realIntent} emptyText="暂无明确意图。" />
        </Section>
        <Section icon={<Lightbulb size={17} />} title="2. 解决方案纲要">
          <List items={result.solutionOutline} emptyText="暂无具体行动项。" />
        </Section>
        <Section icon={<AlertTriangle size={17} />} title="3. 风险提示">
          <List items={result.risks} emptyText="暂无明显风险。" />
        </Section>
        {result.reply ? (
          <Section icon={<MessageSquareText size={17} />} title="4. 回复">
            <p className="rounded-md bg-zinc-50 p-4 text-sm leading-7 text-zinc-800">{result.reply}</p>
          </Section>
        ) : null}
        {result.personProfileUpdate ? (
          <Section icon={<UserRound size={17} />} title="5. 人物画像更新">
            <p className="whitespace-pre-wrap rounded-md bg-zinc-50 p-4 text-sm leading-7 text-zinc-800">
              {result.personProfileUpdate}
            </p>
          </Section>
        ) : null}
      </div>
    </div>
  );
}

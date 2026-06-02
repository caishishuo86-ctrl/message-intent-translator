"use client";

import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Copy, ListChecks, Target } from "lucide-react";
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

function List({ items }: { items: string[] }) {
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
    `明确任务：${result.tasks.join("；")}`,
    `优先级：${result.priority}，${result.priorityReason}`,
    `截止时间：${result.deadline}`,
    `风险提醒：${result.risks.join("；")}`,
    `建议回复：${result.suggestedReply}`,
  ].join("\n");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-zinc-500">优先级</p>
          <div className="mt-1 flex items-center gap-3">
            <span className="rounded-md bg-amber-100 px-2.5 py-1 text-sm font-semibold text-amber-900">
              {result.priority}
            </span>
            <span className="text-sm text-zinc-600">{result.priorityReason}</span>
          </div>
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
        <Section icon={<Target size={17} />} title="真实意图">
          <List items={result.realIntent} />
        </Section>
        <Section icon={<ListChecks size={17} />} title="明确任务">
          <List items={result.tasks} />
        </Section>
        <Section icon={<Clock3 size={17} />} title="截止时间">
          <p className="text-sm leading-6 text-zinc-700">{result.deadline}</p>
        </Section>
        <Section icon={<AlertTriangle size={17} />} title="风险提醒">
          <List items={result.risks} />
        </Section>
      </div>

      <Section icon={<CheckCircle2 size={17} />} title="建议回复">
        <p className="rounded-md bg-zinc-50 p-4 text-sm leading-7 text-zinc-800">
          {result.suggestedReply}
        </p>
      </Section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Section title="更强硬" icon={<CheckCircle2 size={17} />}>
          <p className="text-sm leading-7 text-zinc-700">{result.replyVariants.stronger}</p>
        </Section>
        <Section title="更委婉" icon={<CheckCircle2 size={17} />}>
          <p className="text-sm leading-7 text-zinc-700">{result.replyVariants.softer}</p>
        </Section>
        <Section title="更专业" icon={<CheckCircle2 size={17} />}>
          <p className="text-sm leading-7 text-zinc-700">{result.replyVariants.professional}</p>
        </Section>
      </div>

      <Section icon={<AlertTriangle size={17} />} title="需要确认">
        <List items={result.needsConfirmation} />
      </Section>
    </div>
  );
}

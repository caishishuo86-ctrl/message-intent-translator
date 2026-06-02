"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { AnalysisResult } from "@/components/AnalysisResult";
import { MessageInput } from "@/components/MessageInput";
import { ScenarioSelector } from "@/components/ScenarioSelector";
import { Button } from "@/components/ui/button";
import type { AnalysisResult as AnalysisResultType, Scenario } from "@/types/analysis";

export function AnalyzerApp() {
  const [message, setMessage] = useState("你先看一下这个，别太复杂，最好这周能有个版本。");
  const [scenario, setScenario] = useState<Scenario>("老板/老师");
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, scenario }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "分析失败");
      }

      setResult(data.result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "分析失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3 border-b border-zinc-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-950 text-sm font-semibold text-white">
            AI
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-zinc-950">
              消息意图翻译 Agent
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              输入一段含蓄消息，输出真实意图、任务、优先级、风险和可直接发送的回复。
            </p>
          </div>
        </div>
      </header>

      <main className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <section className="h-fit rounded-md border border-zinc-200 bg-zinc-50 p-4">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">消息内容</label>
              <MessageInput value={message} onChange={setMessage} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">沟通场景</label>
              <ScenarioSelector value={scenario} onChange={setScenario} />
            </div>
            <Button
              type="button"
              className="w-full"
              onClick={analyze}
              disabled={loading || message.trim().length < 2}
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              开始分析
            </Button>
            {error ? (
              <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}
          </div>
        </section>

        <section className="min-h-[560px]">
          {result ? (
            <AnalysisResult result={result} />
          ) : (
            <div className="flex min-h-[560px] items-center justify-center rounded-md border border-dashed border-zinc-300 bg-white p-8 text-center">
              <div>
                <p className="text-base font-medium text-zinc-800">等待分析</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  选择场景后点击开始分析，结果会以结构化卡片展示，并可一键复制。
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

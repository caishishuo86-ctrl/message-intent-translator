"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2, Send, UserRoundPlus, X } from "lucide-react";
import { AnalysisResult } from "@/components/AnalysisResult";
import { MessageInput } from "@/components/MessageInput";
import { ScenarioSelector } from "@/components/ScenarioSelector";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { outputFormats, type AnalysisResult as AnalysisResultType, type Identity, type OutputFormat } from "@/types/analysis";

function addPerson(people: string[], person: string) {
  const cleanPerson = person.trim();
  if (!cleanPerson || people.includes(cleanPerson)) return people;
  return [...people, cleanPerson].sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function extractPersonFromMessage(message: string) {
  const firstLine = message.trim().split(/\n/)[0] ?? "";
  const match = firstLine.match(/^([一-龥]{1,4}(?:老师|老板|总|经理|主任|导师|同学|师兄|师姐|博士|教授|客户|哥|姐|叔|阿姨))\s*(?:说|发来|问|让我|叫我|希望|要求|：|:)/);
  const person = match?.[1]?.trim() ?? "";

  if (["导师", "老师", "老板", "客户", "同学"].includes(person)) return "";
  return person;
}

export function AnalyzerApp() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("导师说：你这周把 SAGA 的实验复现进度整理一下，顺便把下一步计划写清楚。");
  const [imageDataUrl, setImageDataUrl] = useState<string>();
  const [imageName, setImageName] = useState("");
  const [identity, setIdentity] = useState<Identity>("上级");
  const [personName, setPersonName] = useState("");
  const [people, setPeople] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat | undefined>("微信");
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canAnalyze = message.trim().length >= 2 || Boolean(imageDataUrl);
  const detectedPerson = useMemo(() => extractPersonFromMessage(message), [message]);

  useEffect(() => {
    async function loadPeople() {
      const response = await fetch("/api/people");
      if (response.ok) {
        const data = await response.json();
        setPeople(Array.isArray(data.people) ? data.people : []);
      }
    }

    loadPeople();
  }, []);

  function updateMessage(nextMessage: string, options?: { commitPersonDetection?: boolean }) {
    const nextPerson = options?.commitPersonDetection ? extractPersonFromMessage(nextMessage) : "";
    setMessage(nextMessage);

    if (nextPerson) {
      setPeople((current) => addPerson(current, nextPerson));
      setPersonName(nextPerson);
    }
  }

  async function analyze() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, imageDataUrl, identity, outputFormat, personName: personName.trim() || undefined }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "分析失败");
      }

      setResult(data.result);
      if (personName.trim()) {
        setPeople((current) => addPerson(current, personName));
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "分析失败");
    } finally {
      setLoading(false);
    }
  }

  function uploadImage(file?: File) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageDataUrl(reader.result);
        setImageName(file.name);
      }
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageDataUrl(undefined);
    setImageName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
              支持聊天截图或文字粘贴，分析单方任务、双方对话和邮件内容，并按身份与具体人物画像生成处理建议。
            </p>
          </div>
        </div>
      </header>

      <main className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <section className="h-fit rounded-md border border-zinc-200 bg-zinc-50 p-4">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">消息内容</label>
              <MessageInput value={message} onChange={updateMessage} />
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                可以粘贴单方叙事、双方对话、邮件正文；首行写“黄老师说：……”会自动生成人物标签。
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">聊天记录截屏</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => uploadImage(event.target.files?.[0])}
              />
              {imageDataUrl ? (
                <div className="rounded-md border border-zinc-200 bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageDataUrl} alt="聊天截图预览" className="max-h-48 w-full rounded object-contain" />
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="truncate text-sm text-zinc-600">{imageName}</span>
                    <Button type="button" variant="secondary" onClick={removeImage}>
                      <X size={16} />
                      移除
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus size={16} />
                  上传截图
                </Button>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">指定身份</label>
              <ScenarioSelector value={identity} onChange={setIdentity} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">具体人物（可选）</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <UserRoundPlus className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input
                    value={personName}
                    onChange={(event) => setPersonName(event.target.value)}
                    placeholder="例如：黄老板"
                    className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
                    list="known-people"
                  />
                  <datalist id="known-people">
                    {people.map((person) => (
                      <option key={person} value={person} />
                    ))}
                  </datalist>
                </div>
                {personName ? (
                  <Button type="button" variant="secondary" onClick={() => setPersonName("")}>
                    <X size={16} />
                  </Button>
                ) : null}
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                从消息内容自动识别人名并生成标签；也可以手动输入。选中人物后，本次聊天特征会写入该人物的 agent.md。
              </p>
              {detectedPerson ? (
                <p className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  已从消息内容识别到：{detectedPerson}
                </p>
              ) : null}
              {people.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {people.slice(0, 8).map((person) => (
                    <button
                      key={person}
                      type="button"
                      onClick={() => setPersonName(person)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        personName === person
                          ? "border-zinc-950 bg-zinc-950 text-white"
                          : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
                      )}
                    >
                      {person}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">回复形式（可选）</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setOutputFormat(undefined)}
                  className={cn(
                    "h-10 rounded-md border px-3 text-sm font-medium transition-colors",
                    !outputFormat
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
                  )}
                >
                  不生成
                </button>
                {outputFormats.map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => setOutputFormat(format)}
                    className={cn(
                      "h-10 rounded-md border px-3 text-sm font-medium transition-colors",
                      outputFormat === format
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
                    )}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <Button type="button" className="w-full" onClick={analyze} disabled={loading || !canAnalyze}>
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
                  输入文字或上传截图后点击开始分析，结果会展示真实意图、解决方案纲要、风险提示和可选回复；指定人物后会更新人物画像。
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

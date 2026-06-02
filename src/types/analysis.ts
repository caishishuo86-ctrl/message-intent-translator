export const scenarios = [
  "老板/老师",
  "客户",
  "同事",
  "合作方",
  "家人朋友",
] as const;

export type Scenario = (typeof scenarios)[number];

export type Priority = "高" | "中" | "低" | "需要确认";

export type ReplyVariants = {
  stronger: string;
  softer: string;
  professional: string;
};

export type AnalysisResult = {
  realIntent: string[];
  tasks: string[];
  priority: Priority;
  priorityReason: string;
  deadline: string;
  risks: string[];
  suggestedReply: string;
  replyVariants: ReplyVariants;
  needsConfirmation: string[];
};

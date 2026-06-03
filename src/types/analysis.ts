export const identities = ["上级", "客户", "同事", "家人朋友", "对象"] as const;

export const outputFormats = ["微信", "邮件"] as const;

export type Identity = (typeof identities)[number];

export type OutputFormat = (typeof outputFormats)[number];

export type AnalysisResult = {
  realIntent: string[];
  solutionOutline: string[];
  risks: string[];
  reply?: string | null;
  personProfileUpdate?: string | null;
  userProfileUpdate?: string | null;
};

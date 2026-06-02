# Message Intent Translator

中文办公沟通意图分析 Agent。输入一段消息并选择场景，系统会输出真实意图、明确任务、优先级、截止时间、风险提醒、建议回复，以及更强硬、更委婉、更专业的回复版本。

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- OpenAI-compatible Chat Completions API

## Getting Started

1. npm install
2. npm run dev
3. Open http://localhost:3000

## Environment

Copy .env.example to .env.local and configure the model provider when you want real AI calls. Without AI_API_KEY, the app uses a local rule-based fallback so the MVP can run immediately.

Required variables:

- AI_API_KEY
- AI_BASE_URL
- AI_MODEL
- DATABASE_URL

## Scripts

- npm run dev
- npm run lint
- npm run build
- npx prisma generate

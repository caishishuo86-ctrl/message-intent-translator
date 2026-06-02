# Message Intent Translator

中文沟通意图分析 Agent。用户可以粘贴聊天记录、邮件内容、单方任务叙述，也可以上传微信、飞书、邮件等聊天截图；系统会结合对方身份输出真实意图、解决方案纲要、风险提示，并可按微信或邮件格式生成回复。

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

Copy .env.example to .env.local and configure the model provider. The app requires a configured OpenAI-compatible Chat Completions API. Screenshot input requires a vision-capable model, such as the configured Qwen2.5-VL-7B-Instruct.

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

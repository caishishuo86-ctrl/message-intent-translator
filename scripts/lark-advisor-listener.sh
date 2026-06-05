#!/usr/bin/env bash
set -euo pipefail

PROFILE="${LARK_CLI_PROFILE:-message-intent-translator}"
PROCESS_URL="${LARK_PROCESS_URL:-https://message-intent-translator-github-la.vercel.app/api/lark/process}"
TIMEOUT="${LARK_LISTENER_TIMEOUT:-0}"

lark-cli --profile "$PROFILE" event consume im.message.receive_v1 \
  --as bot \
  --timeout "$TIMEOUT" \
  --jq 'select((.chat_type == "group" or .chat_type == "p2p") and .message_type == "text") | {event:{message:{chat_id:.chat_id, chat_type:.chat_type, content:.content, message_type:.message_type}, sender:{sender_id:{open_id:.sender_id}}}}' \
  < <(tail -f /dev/null) |
while IFS= read -r event; do
  printf '收到飞书消息事件，转发到 %s\n' "$PROCESS_URL" >&2
  curl -sS -X POST "$PROCESS_URL" \
    -H 'Content-Type: application/json' \
    --data "$event"
  printf '\n' >&2
done

type Props = {
  value: string;
  onChange: (value: string, options?: { commitPersonDetection?: boolean }) => void;
};

export function MessageInput({ value, onChange }: Props) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value, { commitPersonDetection: event.nativeEvent instanceof InputEvent && event.nativeEvent.inputType === "insertFromPaste" })}
      onCompositionEnd={(event) => onChange(event.currentTarget.value, { commitPersonDetection: true })}
      onBlur={(event) => onChange(event.currentTarget.value, { commitPersonDetection: true })}
      placeholder="粘贴聊天记录、邮件内容或单方任务，例如：导师说：你这周把 SAGA 的实验复现进度整理一下，顺便把下一步计划写清楚。"
      className="min-h-44 w-full resize-y rounded-md border border-zinc-200 bg-white p-4 text-base leading-7 text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
    />
  );
}

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function MessageInput({ value, onChange }: Props) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="粘贴一段消息，例如：你先看一下这个，别太复杂，最好这周能有个版本。"
      className="min-h-44 w-full resize-y rounded-md border border-zinc-200 bg-white p-4 text-base leading-7 text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
    />
  );
}

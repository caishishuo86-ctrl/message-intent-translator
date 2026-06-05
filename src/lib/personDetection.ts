const genericPeople = ["导师", "老师", "老板", "客户", "同学"];

export function extractPersonFromMessage(message: string) {
  const firstLine = message.trim().split(/\n/)[0] ?? "";
  const match = firstLine.match(/^([一-龥]{1,4}(?:老师|老板|总|经理|主任|导师|同学|师兄|师姐|博士|教授|客户|哥|姐|叔|阿姨))\s*(?:说|发来|问|让我|叫我|希望|要求|：|:)/);
  const person = match?.[1]?.trim() ?? "";

  if (genericPeople.includes(person)) return "";
  return person;
}

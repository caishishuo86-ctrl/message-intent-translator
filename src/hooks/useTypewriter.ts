"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * 打字机效果 Hook
 * @param text 要逐字输出的完整文本
 * @param speed 每个字符的间隔 (ms)，默认 30
 * @param enabled 是否启动打字，默认 true
 */
export function useTypewriter(text: string, speed = 30, enabled = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 重置
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;
  }, [text]);

  // 打字
  useEffect(() => {
    if (!enabled || !text) return;

    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed, enabled]);

  // 跳过 → 直接显示全部
  const skip = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    indexRef.current = text.length;
    setDisplayed(text);
    setDone(true);
  }, [text]);

  return { displayed, done, skip };
}

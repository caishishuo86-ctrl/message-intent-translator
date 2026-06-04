"use client";

import { useState, useEffect, useCallback } from "react";

export interface Person {
  id: string;
  name: string;
  role: string;
  createdAt: number;
}

const STORAGE_KEY = "mit-contacts";

function load(): Person[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(people: Person[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
  } catch { /* quota exceeded, silently fail */ }
}

export function useContacts() {
  const [people, setPeople] = useState<Person[]>([]);

  // 初始化加载
  useEffect(() => {
    setPeople(load());
  }, []);

  // 每次变化写入
  useEffect(() => {
    save(people);
  }, [people]);

  const addPerson = useCallback((name: string, role: string) => {
    const person: Person = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      role,
      createdAt: Date.now(),
    };
    setPeople((prev) => [person, ...prev]);
  }, []);

  const removePerson = useCallback((id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { people, addPerson, removePerson };
}

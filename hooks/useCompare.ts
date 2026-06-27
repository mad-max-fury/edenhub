"use client";

import { useEffect, useState } from "react";
import type { ICatalogProduct } from "@/redux/api/catalog";

const KEY = "compareList";
const MAX = 4;
const EVENT = "compare:update";

const read = (): ICatalogProduct[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ICatalogProduct[]) : [];
  } catch {
    return [];
  }
};

const write = (items: ICatalogProduct[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
};

export const addToCompare = (product: ICatalogProduct) => {
  const list = read();
  if (list.some((p) => p._id === product._id)) return false;
  if (list.length >= MAX) return false;
  write([...list, product]);
  return true;
};

export const removeFromCompare = (productId: string) => {
  write(read().filter((p) => p._id !== productId));
};

export const clearCompare = () => {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
};

export const isInCompare = (productId: string) =>
  read().some((p) => p._id === productId);

export const useCompare = () => {
  const [items, setItems] = useState<ICatalogProduct[]>([]);

  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return items;
};

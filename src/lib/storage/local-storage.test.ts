import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getLocalStorage,
  setLocalStorage,
} from "@/lib/storage/local-storage";

describe("getLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns the default value when the key does not exist", () => {
    const result = getLocalStorage("missing-key", 42);
    expect(result).toBe(42);
  });

  it("returns the default value when the key does not exist (object)", () => {
    const defaultObj = { name: "default" };
    const result = getLocalStorage("missing-key", defaultObj);
    expect(result).toEqual(defaultObj);
  });

  it("returns the parsed value when the key exists", () => {
    localStorage.setItem("my-key", JSON.stringify({ score: 100 }));
    const result = getLocalStorage<{ score: number }>("my-key", { score: 0 });
    expect(result).toEqual({ score: 100 });
  });

  it("returns the default value when stored JSON is corrupted", () => {
    localStorage.setItem("bad-key", "not valid json {{");
    const result = getLocalStorage("bad-key", "fallback");
    expect(result).toBe("fallback");
  });

  it("returns the default value when window is undefined (SSR)", () => {
    const original = globalThis.window;
    // @ts-expect-error simulate SSR
    delete globalThis.window;
    try {
      const result = getLocalStorage("any-key", "ssr-default");
      expect(result).toBe("ssr-default");
    } finally {
      globalThis.window = original;
    }
  });
});

describe("setLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("writes a string value that can be read back", () => {
    setLocalStorage("str-key", "hello");
    const raw = localStorage.getItem("str-key");
    expect(raw).toBe(JSON.stringify("hello"));
  });

  it("writes an object that can be read back correctly", () => {
    const data = { name: "Alice", age: 30 };
    setLocalStorage("obj-key", data);
    const result = getLocalStorage<typeof data>("obj-key", { name: "", age: 0 });
    expect(result).toEqual(data);
  });

  it("write/read roundtrip preserves data fidelity for arrays", () => {
    const arr = [1, 2, 3, "four"];
    setLocalStorage("arr-key", arr);
    const result = getLocalStorage<typeof arr>("arr-key", []);
    expect(result).toEqual(arr);
  });

  it("overwrites an existing value", () => {
    setLocalStorage("ow-key", "first");
    setLocalStorage("ow-key", "second");
    const result = getLocalStorage("ow-key", "default");
    expect(result).toBe("second");
  });

  it("is a no-op when window is undefined (SSR)", () => {
    const original = globalThis.window;
    // @ts-expect-error simulate SSR
    delete globalThis.window;
    try {
      expect(() => setLocalStorage("any-key", "value")).not.toThrow();
    } finally {
      globalThis.window = original;
    }
  });

  it("silently ignores storage errors (e.g. quota exceeded)", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
      throw new DOMException("QuotaExceededError");
    });
    expect(() => setLocalStorage("any-key", "value")).not.toThrow();
  });
});

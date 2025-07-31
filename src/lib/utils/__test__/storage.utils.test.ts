import { describe, it, expect, beforeEach } from "vitest";
import { storageHelper } from "../storage.util";

describe("SecureStorageUtil", () => {
  const key = "testKey";

  beforeEach(() => {
    localStorage.clear();
  });

  it("should store and retrieve a string value", () => {
    const value = "testValue";
    storageHelper.setItem(key, value);
    const result = storageHelper.getItem<string>(key);
    expect(result).toBe(value);
  });

  it("should store and retrieve an object", () => {
    const obj = { foo: "bar" };
    storageHelper.setItem(key, obj);
    const result = storageHelper.getItem<typeof obj>(key);
    expect(result).toEqual(obj);
  });

  it("should return null for a non-existent item", () => {
    const result = storageHelper.getItem<string>("nonexistent");
    expect(result).toBeNull();
  });

  it("should remove an item", () => {
    storageHelper.setItem(key, "value");
    storageHelper.removeItem(key);
    const result = storageHelper.getItem<string>(key);
    expect(result).toBeNull();
  });

  it("should clear all items", () => {
    storageHelper.setItem("a", "1");
    storageHelper.setItem("b", { x: true });
    storageHelper.clear();
    expect(storageHelper.getItem("a")).toBeNull();
    expect(storageHelper.getItem("b")).toBeNull();
  });

  it("should return true if item exists", () => {
    storageHelper.setItem(key, "value");
    expect(storageHelper.hasItem(key)).toBe(true);
  });

  it("should return false if item does not exist", () => {
    expect(storageHelper.hasItem("nonexistent")).toBe(false);
  });
});

import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatDateShort,
  getWeekRange,
  getMonthRange,
  getQuarterRange,
  calculateProgress,
  getDaysBetween,
  isToday,
  isPastDue,
  generateWeekDays,
  isSameDay,
  cn,
  getPriorityColor,
  getStatusBadgeColor,
} from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("merges tailwind conflicts", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });
});

describe("formatDate", () => {
  it("formats date in pt-BR", () => {
    const result = formatDate(new Date(2026, 0, 15));
    expect(result).toBe("15/01/2026");
  });

  it("formats date string", () => {
    const result = formatDate("2026-06-01T00:00:00Z");
    expect(result).toMatch(/01\/06\/2026|31\/05\/2026/);
  });
});

describe("getWeekRange", () => {
  it("returns correct week range for Monday start", () => {
    // Wednesday Jan 15, 2026
    const date = new Date(2026, 0, 14);
    const { start, end } = getWeekRange(date, 1);

    expect(start.getDay()).toBe(1); // Monday
    expect(end.getDay()).toBe(0); // Sunday
    expect(start.getHours()).toBe(0);
    expect(end.getHours()).toBe(23);
  });

  it("returns correct week range for Sunday start", () => {
    const date = new Date(2026, 0, 14);
    const { start, end } = getWeekRange(date, 0);

    expect(start.getDay()).toBe(0); // Sunday
    expect(end.getDay()).toBe(6); // Saturday
  });

  it("week span is always 7 days", () => {
    const date = new Date(2026, 5, 15);
    const { start, end } = getWeekRange(date, 1);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    expect(Math.round(diff)).toBe(7);
  });
});

describe("getMonthRange", () => {
  it("returns first and last day of month", () => {
    const date = new Date(2026, 1, 15); // February
    const { start, end } = getMonthRange(date);

    expect(start.getDate()).toBe(1);
    expect(start.getMonth()).toBe(1);
    expect(end.getDate()).toBe(28); // 2026 is not a leap year
    expect(end.getMonth()).toBe(1);
  });

  it("handles months with 31 days", () => {
    const date = new Date(2026, 0, 10); // January
    const { start, end } = getMonthRange(date);

    expect(start.getDate()).toBe(1);
    expect(end.getDate()).toBe(31);
  });
});

describe("getQuarterRange", () => {
  it("Q1 starts Jan 1 and ends Mar 31", () => {
    const date = new Date(2026, 1, 15); // February = Q1
    const { start, end } = getQuarterRange(date);

    expect(start.getMonth()).toBe(0); // January
    expect(end.getMonth()).toBe(2); // March
    expect(end.getDate()).toBe(31);
  });

  it("Q4 starts Oct 1 and ends Dec 31", () => {
    const date = new Date(2026, 11, 1); // December = Q4
    const { start, end } = getQuarterRange(date);

    expect(start.getMonth()).toBe(9); // October
    expect(end.getMonth()).toBe(11); // December
    expect(end.getDate()).toBe(31);
  });
});

describe("calculateProgress", () => {
  it("returns correct percentage", () => {
    expect(calculateProgress(3, 10)).toBe(30);
    expect(calculateProgress(10, 10)).toBe(100);
    expect(calculateProgress(0, 10)).toBe(0);
  });

  it("caps at 100%", () => {
    expect(calculateProgress(15, 10)).toBe(100);
  });

  it("returns 0 when target is 0", () => {
    expect(calculateProgress(5, 0)).toBe(0);
  });
});

describe("getDaysBetween", () => {
  it("calculates days between dates", () => {
    const start = new Date(2026, 0, 1);
    const end = new Date(2026, 0, 10);
    expect(getDaysBetween(start, end)).toBe(9);
  });

  it("works regardless of order", () => {
    const start = new Date(2026, 0, 10);
    const end = new Date(2026, 0, 1);
    expect(getDaysBetween(start, end)).toBe(9);
  });
});

describe("isToday", () => {
  it("returns true for today", () => {
    expect(isToday(new Date())).toBe(true);
  });

  it("returns false for yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday)).toBe(false);
  });
});

describe("isPastDue", () => {
  it("returns true for past dates", () => {
    const past = new Date(2020, 0, 1);
    expect(isPastDue(past)).toBe(true);
  });

  it("returns false for future dates", () => {
    const future = new Date(2030, 0, 1);
    expect(isPastDue(future)).toBe(false);
  });
});

describe("generateWeekDays", () => {
  it("generates 7 days starting from given date", () => {
    const start = new Date(2026, 0, 5); // Monday
    const days = generateWeekDays(start);

    expect(days).toHaveLength(7);
    expect(days[0].getDate()).toBe(5);
    expect(days[6].getDate()).toBe(11);
  });
});

describe("isSameDay", () => {
  it("returns true for same day", () => {
    const d1 = new Date(2026, 5, 15, 10, 30);
    const d2 = new Date(2026, 5, 15, 22, 0);
    expect(isSameDay(d1, d2)).toBe(true);
  });

  it("returns false for different days", () => {
    const d1 = new Date(2026, 5, 15);
    const d2 = new Date(2026, 5, 16);
    expect(isSameDay(d1, d2)).toBe(false);
  });
});

describe("getPriorityColor", () => {
  it("returns correct color for each priority", () => {
    expect(getPriorityColor("high")).toBe("text-red-500");
    expect(getPriorityColor("medium")).toBe("text-yellow-500");
    expect(getPriorityColor("low")).toBe("text-green-500");
    expect(getPriorityColor("unknown")).toBe("text-gray-500");
  });
});

describe("getStatusBadgeColor", () => {
  it("returns correct color for each status", () => {
    expect(getStatusBadgeColor("done")).toContain("green");
    expect(getStatusBadgeColor("achieved")).toContain("green");
    expect(getStatusBadgeColor("in_progress")).toContain("blue");
    expect(getStatusBadgeColor("todo")).toContain("gray");
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { validateEmailConfig } from "./email";

describe("validateEmailConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("reports issue when RESEND_API_KEY is missing", () => {
    delete process.env.RESEND_API_KEY;
    const result = validateEmailConfig();

    expect(result.isConfigured).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues[0]).toContain("RESEND_API_KEY");
  });

  it("reports issue when RESEND_API_KEY has wrong format", () => {
    process.env.RESEND_API_KEY = "invalid-key";
    const result = validateEmailConfig();

    expect(result.isConfigured).toBe(false);
    expect(result.issues[0]).toContain("re_");
  });

  it("passes when RESEND_API_KEY is valid", () => {
    process.env.RESEND_API_KEY = "re_valid_key_123";
    process.env.EMAIL_FROM = "test <noreply@example.com>";
    process.env.NEXT_PUBLIC_APP_URL = "https://example.com";
    const result = validateEmailConfig();

    expect(result.isConfigured).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("warns when using sandbox address", () => {
    process.env.RESEND_API_KEY = "re_valid_key_123";
    process.env.EMAIL_FROM = "pulse <onboarding@resend.dev>";
    const result = validateEmailConfig();

    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings.some((w) => w.includes("sandbox") || w.includes("resend.dev"))).toBe(true);
  });

  it("warns when EMAIL_FROM is not set", () => {
    process.env.RESEND_API_KEY = "re_valid_key_123";
    delete process.env.EMAIL_FROM;
    const result = validateEmailConfig();

    expect(result.warnings.some((w) => w.includes("EMAIL_FROM"))).toBe(true);
  });

  it("warns when NEXT_PUBLIC_APP_URL is not set", () => {
    process.env.RESEND_API_KEY = "re_valid_key_123";
    process.env.EMAIL_FROM = "test <noreply@example.com>";
    delete process.env.NEXT_PUBLIC_APP_URL;
    const result = validateEmailConfig();

    expect(result.warnings.some((w) => w.includes("NEXT_PUBLIC_APP_URL"))).toBe(true);
  });

  it("no warnings for fully configured production setup", () => {
    process.env.RESEND_API_KEY = "re_valid_key_123";
    process.env.EMAIL_FROM = "pulse <noreply@pulseprodutividade.com.br>";
    process.env.NEXT_PUBLIC_APP_URL = "https://pulseprodutividade.com.br";
    const result = validateEmailConfig();

    expect(result.isConfigured).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });
});

import { describe, expect, it } from "vitest"

import { EntityValidationError } from "./errors"
import { requireSafeHref } from "./url"

describe("safe URLs", () => {
  it("accepts internal paths and HTTP URLs", () => {
    expect(requireSafeHref("/sobre")).toBe("/sobre")
    expect(requireSafeHref("https://example.com/portfolio")).toBe(
      "https://example.com/portfolio",
    )
  })

  it("rejects unsafe protocols and protocol-relative URLs", () => {
    expect(() => requireSafeHref("javascript:alert(1)")).toThrow(
      EntityValidationError,
    )
    expect(() => requireSafeHref("//example.com")).toThrow(EntityValidationError)
  })
})

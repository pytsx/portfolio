import { describe, expect, it } from "vitest"

import { DEFAULT_PAGE_WIDTH, parsePageWidth } from "./page-width"

describe("page width", () => {
  it.each(["narrow", "standard", "wide", "full"] as const)(
    "accepts the %s preset",
    (width) => {
      expect(parsePageWidth(width)).toBe(width)
    },
  )

  it("uses the default for missing and unsupported values", () => {
    expect(parsePageWidth(undefined)).toBe(DEFAULT_PAGE_WIDTH)
    expect(parsePageWidth("custom")).toBe(DEFAULT_PAGE_WIDTH)
  })
})

import { describe, expect, it } from "vitest"

import { pageBelongsToCollection } from "./collection-membership"

const groups = [{ id: "blog-id", slug: "blog" }]

describe("page collection membership", () => {
  it("matches pages associated by group id", () => {
    expect(pageBelongsToCollection({ groupId: "blog-id" }, "blog-id", groups)).toBe(true)
    expect(pageBelongsToCollection({ groupId: "other-id" }, "blog-id", groups)).toBe(false)
  })

  it("supports legacy pages associated by group slug", () => {
    expect(pageBelongsToCollection({ groupSlug: "blog" }, "blog-id", groups)).toBe(true)
    expect(pageBelongsToCollection({ groupSlug: "work" }, "blog-id", groups)).toBe(false)
  })

  it("does not let a legacy slug override an explicit group id", () => {
    expect(pageBelongsToCollection({ groupId: "other-id", groupSlug: "blog" }, "blog-id", groups)).toBe(false)
  })
})

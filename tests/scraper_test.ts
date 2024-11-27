// deno-lint-ignore-file no-explicit-any
import { assertSpyCalls, returnsNext, stub } from "@std/testing/mock";
import { Page } from "puppeteer";

import { assertEquals } from "@std/assert";
import { scrapeRecipe } from "../src/scraper.ts";

const page: Page = {} as Page;

Deno.test(
  "scrapeRecipe should extract recipe content from a web page",
  async () => {
    const gotoStub = stub(page, "goto", returnsNext([Promise.resolve(null)]));
    const closeStub = stub(page, "close", returnsNext([Promise.resolve()]));
    const waitForSelectorNullableStub = stub(
      page,
      "$",
      returnsNext([
        Promise.resolve({
          evaluate: (_fn: () => string) => "Test Recipe",
        } as any),
        Promise.resolve({
          evaluate: (_fn: () => string) => "Delicious recipe description",
        } as any),
        Promise.resolve({
          evaluate: (_fn: () => string) => "tag1, tag2, tag3",
        } as any),
        Promise.resolve({
          $$eval: (_selector: string, _fn: (elements: any[]) => string[]) => [
            "1 cup flour",
            "2 eggs",
          ],
        } as any),
        Promise.resolve({
          $$eval: (_selector: string, _fn: (elements: any[]) => string[]) => [
            "Mix ingredients",
            "Bake for 20 minutes",
          ],
        } as any),
      ])
    );

    const result = await scrapeRecipe(page, "http://example.com/recipe");

    assertEquals(
      result,
      "---\ntitle: Test Recipe\nurl: http://example.com/recipe\ntags:\n  - tag1\n  - tag2\n  - tag3\n---\n# Test Recipe\n[http://example.com/recipe](http://example.com/recipe)\n\nDelicious recipe description\n\n## Ingredients:\n\n- 1 cup flour\n- 2 eggs\n\n## Steps\n\n1. Mix ingredients\n2. Bake for 20 minutes\n"
    );

    assertSpyCalls(gotoStub, 1);
    assertSpyCalls(closeStub, 1);
    assertSpyCalls(waitForSelectorNullableStub, 5);
  }
);

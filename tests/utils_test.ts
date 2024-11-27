import { assertEquals } from "@std/assert";
import { Recipe, recipeToMarkdown } from "../src/utils.ts";

Deno.test("recipeToMarkdown should convert recipe to markdown format", () => {
  const recipe: Recipe = {
    title: "Test Recipe",
    link: "http://example.com",
    description: "This is a test recipe.",
    ingredients: ["1 cup of flour", "2 eggs"],
    steps: ["Mix ingredients", "Bake for 20 minutes"],
    tags: ["test", "recipe"],
  };

  const expectedMarkdown = `---
title: Test Recipe
url: http://example.com
tags:
  - test
  - recipe
---
# Test Recipe
[http://example.com](http://example.com)

This is a test recipe.

## Ingredients:

- 1 cup of flour
- 2 eggs

## Steps

1. Mix ingredients
2. Bake for 20 minutes
`;

  const result = recipeToMarkdown(recipe);
  assertEquals(result, expectedMarkdown);
});

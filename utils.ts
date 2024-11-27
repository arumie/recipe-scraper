import { Page } from "puppeteer";

export interface Recipe {
  title: string;
  link: string;
  description?: string;
  ingredients?: string[];
  steps?: string[];
  tags?: string[];
}

const getPropertyList = (recipe: Recipe) => {
  return `---\ntitle: ${recipe.title}\nurl: ${recipe.link}\ntags:${recipe.tags
    ?.map((tag) => `\n  - ${tag.toLowerCase().trim().replaceAll(" ", "-")}`)
    .join("")}\n---\n`;
};

export function recipeToMarkdown(recipe: Recipe) {
  const link = recipe.link;
  const doc: string[] = [];
  const properties = getPropertyList(recipe);
  doc.push(properties);
  doc.push(`# ${recipe.title}\n`);
  doc.push(`[${link}](${link})\n`);
  doc.push(`\n${recipe.description}\n\n`);
  if ((recipe.ingredients?.length ?? 0) > 0) {
    doc.push(`## Ingredients:\n\n`);
    recipe.ingredients?.forEach((ing) => {
      doc.push(`- ${ing}\n`);
    });
    doc.push(`\n`);
  }
  if ((recipe.steps?.length ?? 0) > 0) {
    doc.push(`## Steps\n\n`);
    recipe.steps?.forEach((step, i) => {
      doc.push(`${i + 1}. ${step.replace("<br>", "")}\n`);
    });
  }
  return doc.join("");
}

export async function waitForSelectorNullable(page: Page, selector: string) {
  try {
    const selectedElement = await page.$(selector);
    if (selectedElement == null) {
      throw new Error("Element not found");
    }
    return selectedElement;
  } catch (e) {
    console.log(`Selector ${selector} not found`);
    return null;
  }
}

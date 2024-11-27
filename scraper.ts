import { Page } from "puppeteer";
import { Recipe, recipeToMarkdown, waitForSelectorNullable } from "./utils.ts";

/**
 * Scrapes a recipe from the given web page link.
 *
 * @param {Page} page - The Puppeteer page instance to use for scraping.
 * @param {string} link - The URL of the recipe page to scrape.
 * @returns {Promise<string>} - A promise that resolves to the scraped recipe in Markdown format.
 * @throws Will throw an error if the recipe content cannot be extracted.
 *
 * The function performs the following steps:
 * 1. Navigates to the provided link.
 * 2. Extracts the title, description, tags, ingredients, and steps from the page.
 * 3. Closes the page.
 * 4. Constructs a Recipe object and converts it to Markdown format if it contains valid content.
 * 5. Logs the success or failure of the extraction process.
 */
export async function scrapeRecipe(
  page: Page,
  link: string,
): Promise<string> {
  try {
    console.log(`Navigating to ${link}`);
    await page.goto(link, { waitUntil: "domcontentloaded" });

    const [title, description, tags, ingredients, steps] = await Promise.all([
      extractTitle(page),
      extractDescription(page),
      extractTags(page),
      extractIngredients(page),
      extractSteps(page),
    ]);

    await page.close();
    const res: Recipe = { link, title, description, tags, steps, ingredients };

    if (
      (res.ingredients && res.ingredients.length > 0) ||
      (res.steps && res.steps.length > 0) ||
      (res.tags && res.tags.length > 0)
    ) {
      console.log("Recipe extraction successful");
      return recipeToMarkdown(res);
    } else {
      console.log(`No content for ${title} - ${link}`);
      throw new Error(`No content for ${title} - ${link}`);
    }

  } catch (e) {
    await page.close();
    console.log(`Failed getting content for ${link}`);
    console.log(e);
    throw e;
  }
}

async function extractIngredients(page: Page) {
  const ingredientsContainer = await waitForSelectorNullable(
    page,
    ".Recipe__ingredients"
  );
  let ingredients: string[] = [];
  if (ingredientsContainer != null) {
    ingredients = await ingredientsContainer.$$eval(
      ".Ingredients__ingredient > div > div > span",
      (elements) => elements.map((el) => el.innerHTML)
    );
  }
  return ingredients;
}

async function extractSteps(page: Page) {
  const stepsContainer = await waitForSelectorNullable(
    page,
    ".Recipe__steps"
  );
  let steps: string[] = [];
  if (stepsContainer != null) {
    steps = await stepsContainer.$$eval(
      ".Step__description > p",
      (elements) => elements.map((el) => el.innerHTML)
    );
  }
  return steps;
}

async function extractTags(page: Page) {
  const keywordsEl = await waitForSelectorNullable(page, "[name='keywords']");
  const keywords = await keywordsEl?.evaluate((el) => el.getAttribute("content"));
  const tags = keywords?.split(",").map((tag: string) => tag.trim()) ?? [];
  return tags;
}

async function extractDescription(page: Page) {
  const descriptionEl = await waitForSelectorNullable(page, ".RecipeHero__details > div > div > div > div.body-text-sm > div");
  const description = await descriptionEl?.evaluate((el) => el.innerHTML);
  return description;
}

async function extractTitle(page: Page) {
  const titleEl = await waitForSelectorNullable(page, ".MainHeading");
  const title = await titleEl?.evaluate((el) => el.innerHTML);
  return title;
}

import puppeteer from "puppeteer";
import { scrapeRecipe } from "./scraper.ts";

const link = Deno.args[0];
const headless = (Deno.args[1] ?? "true") === "true";

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  if (link == null || Deno.args.includes("--help") || Deno.args.includes("-h")) {
    console.log("Usage: deno task run <recipe_url> [headless]");
    console.log("Options:");
    console.log("--help, -h: Show this help message");
    console.log("Arguments:");
    console.log("<recipe_url>: URL of the recipe from Mob Kitchen to scrape (required)");
    console.log("[headless]: Whether to run the browser in headless mode (default: true)");
    console.log("Example: deno task run https://www.mob.co.uk/recipes/pizza true");
    Deno.exit(0);
  }
  console.log(`Scraping recipe from ${link}`);
  console.log(`Headless: ${headless}`);
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();
  const recipeMarkdown = await scrapeRecipe(page, link);
  console.log(recipeMarkdown);
  browser.close();
  Deno.exit(0);
}

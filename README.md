# Recipe Scraper

This project is a recipe scraper that extracts recipe information from a given
URL and converts it into Markdown format. It uses Puppeteer for web scraping and
Deno as the runtime environment.

## Features

- Scrapes recipe title, description, tags, ingredients, and steps.
- Converts the scraped recipe into Markdown format.
- Supports headless and non-headless browser modes.

## Installation

1. Install [Deno](https://deno.land/#installation).
2. Clone this repository:

```sh
git clone https://github.com/your-username/recipe-scraper.git
cd recipe-scraper
deno install -A
```

## Usage

To run the scraper, use the following command:

```sh
deno task run <recipe_url> [headless]
```

### Arguments

- `<recipe_url>`: URL of the recipe to scrape (required).
- `[headless]`: Whether to run the browser in headless mode (default: true).

### Example

```sh
deno task run https://www.example.com/recipe true
```

## Project Structure

- `main.ts`: Entry point of the application.
- `src/scraper.ts`: Contains the main scraping logic.
- `src/utils.ts`: Utility functions for the scraper.
- `deno.json`: Configuration file for Deno tasks.

## License

This project is licensed under the MIT License.

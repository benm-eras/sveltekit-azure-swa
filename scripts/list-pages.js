import { glob } from 'glob';
import fs from 'fs';

/**
 * Lists all pages in the project and writes them to a JSON file.
 * Ignores dynamic routes (e.g. /blog/[slug]/+page.svelte) and the download page.
 */

function normalizePath(path) {
    path = path.replace(/\\/g, "/");
    path = path.replace(/^src\/routes/, "");
    path = path.replace(/\+page\.svelte$/, "");
    path = path.length > 1 ? path.replace(/\/$/, "") : path;
    return path;
}

let pages = await glob("./src/routes/**/+page.svelte");
let exclude = ["/download"];

pages = pages
    .map(normalizePath)
    .filter((path) => !/\[\w+\]/.test(path))
    .filter((path) => !exclude.includes(path))
    .sort();

let json = JSON.stringify(pages, null, 2);
let target = "./static/routes.json";

fs.writeFileSync(target, json);

console.log(`Generated ${target} with ${pages.length} pages`);
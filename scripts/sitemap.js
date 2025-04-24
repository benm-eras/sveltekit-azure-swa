import fs from 'fs';
import { glob } from 'glob';
import { DateTime } from 'luxon';
import path from 'path';
import fm from 'front-matter';
import partners from '../static/partners/data.json' with { type: "json" };
import reviews from '../static/reviews/list.json' with { type: "json" };

async function getBlogPosts() {
    const files = await glob("./static/docs/blog/*.md");
    return files.map(f => {
        const slug = path.basename(f, path.extname(f));
        const text = fs.readFileSync(f, { encoding: 'utf8', flag: 'r' });
        const content = fm(text);

        return { slug, date: DateTime.fromJSDate(content.attributes.date) };
    });
}

/**
 * Normalizes a path by replacing backslashes with forward slashes,
 * removing the "src/routes" prefix, removing the "+page.svelte" suffix,
 * and removing trailing slashes if the path is longer than 1 character.
 * @param {string} path - The path to be normalized.
 * @returns {string} - The normalized path.
 */
function normalizePath(path) {
    path = path.replace(/\\/g, "/");
    path = path.replace(/^src\/routes/, "");
    path = path.replace(/\+page\.svelte$/, "");
    path = path.length > 1 ? path.replace(/\/$/, "") : path;
    return path;
}

/**
 * Generates an XML entry for a sitemap.
 * @param {string} path - The path of the entry.
 * @param {DateTime} [date] - The date of the entry. If not provided, the current date will be used.
 * @returns {string} - The XML entry for the sitemap.
 */
function getEntry(path, date) {
    path = path.startsWith("/") ? path.slice(1) : path;
    const _date = date ?? DateTime.utc();// ? DateTime.fromJSDate(date) : DateTime.utc();

    return `<url>
        <loc>https://www.eras.co.uk/${path}</loc>
        <lastmod>${_date.toISODate()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>
    `;
}

const pages = await glob("./src/routes/**/+page.svelte");
let routes = pages.map(normalizePath);

// remove routes with parameters
routes = routes
    .filter(r => !/\[[^\]]+\]\/?$/.test(r))
    .map(r => ({ path: r, date: null }));

// add the partner routes
for (const partner of partners)
    routes.push({ path: `/about-us/partners/${partner.Id}`, date: null });

// add the case study routes (only case studies with content have their own page)
for (const review of reviews.filter(c => c.slug && (c.location == "page" || c.location == "both")))
    routes.push({ path: `/about-us/reviews/${review.slug}`, date: null });

const years = [2018, 2021, 2023];
const types = ["awards", "accreditations"];

// add the awards and accreditations routes
for (const year of years)
    for (const type of types)
        routes.push({ path: `/about-us/best-employers/${year}/${type}`, date: DateTime.fromISO(`${year}-05-01`) });

// add the blog post routes with slug parameter
const blogs = await getBlogPosts();
for (const blog of blogs)
    routes.push({ path: `/blog/${blog.slug}`, date: blog.date });

const entries = routes.sort((a, b) => a.path.localeCompare(b.path)).map(r => getEntry(r.path, r.date));
const contents = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${entries.join("")}
</urlset>`;

fs.writeFileSync("./static/sitemap.xml", contents);

console.info(`Generated ./static/sitemap.xml with ${entries.length} entries`);
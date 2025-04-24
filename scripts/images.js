import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { imageSizeFromFile } from 'image-size/fromFile';

function getImageData(file) {
    let dimensions = imageSizeFromFile(file);
    let name = path.parse(file).name;

    return {
        path: file.replace(/\\/g, "/"), // convert to forward slash
        name: name,
        width: dimensions.width,
        height: dimensions.height
    }
}

const files = glob.sync(`./{static,src}/**/*.{avif,webp,png,jpg,jpeg,svg}`).map(file => file.replace(/\\/g, "/"));
const target = "./static/images/image-data.json";
let images = [];

for (let file of files)
    images.push(getImageData(file));

fs.writeFileSync(target, JSON.stringify(images, null, 2));
console.info(`Generated ${target} with ${images.length} images`);
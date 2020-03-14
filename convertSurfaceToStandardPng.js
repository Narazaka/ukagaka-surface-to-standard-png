// @ts-check
const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

/**
 *
 * @param {Buffer} data
 * @param {number} index
 * @param {{r: number; g: number; b: number, a: number}} color
 */
function isBitmapColorSame(data, index, color) {
    return (
        data[index] === color.r &&
        data[index + 1] === color.g &&
        data[index + 2] === color.b
    );
}

/**
 *
 * @param {import("jimp")} shell
 * @param {import("jimp")} [pna]
 */
async function convertSurfaceDataToStandardPngData(shell, pna) {
    const shellData = shell.bitmap.data;

    if (pna) {
        const pnaData = pna.bitmap.data;
        if (pna.bitmap.width !== shell.bitmap.width || pna.bitmap.height !== shell.bitmap.height) {
            throw new Error(
                `shell size [${shell.bitmap.width}x${shell.bitmap.height}] !== pna size [${pna.bitmap.width}x${pna.bitmap.height}]`,
            );
        }
        shell.scan(0, 0, shell.bitmap.width, shell.bitmap.height, (_x, _y, index) => {
            shellData[index + 3] = pnaData[index];
        });
    }

    const transparentTargetColor = Jimp.intToRGBA(shell.getPixelColor(0, 0));
    shell.scan(0, 0, shell.bitmap.width, shell.bitmap.height, (_x, _y, index) => {
        if (isBitmapColorSame(shellData, index, transparentTargetColor)) {
            shellData[index + 3] = 0;
        }
    });
}

/**
 *
 * @param {string} shellPath
 */
async function convertSurfaceToStandardPngData(shellPath) {
    if (!fs.existsSync(shellPath)) throw new Error(`Cannot find file [${shellPath}]`);
    const shell = await Jimp.read(shellPath);
    const pnaPath = shellPath.replace(/\.png$/, ".pna");
    const pna = fs.existsSync(pnaPath) ? await Jimp.read(pnaPath) : undefined;
    convertSurfaceDataToStandardPngData(shell, pna);
    return shell;
}

/**
 *
 * @param {string} shellPath
 * @param {string} destinationPath
 */
async function convertSurfaceToStandardPng(shellPath, destinationPath) {
    await (await convertSurfaceToStandardPngData(shellPath)).writeAsync(destinationPath);
}

/**
 * 
 * @param {string} shellDir 
 * @param {string} destinationDir 
 */
function convertSurfacesToStandardPngs(shellDir, destinationDir) {
    const filenames = fs.readdirSync(shellDir).filter(f => path.extname(f) === ".png");
    return Promise.all(filenames.map(filename => 
        convertSurfaceToStandardPng(path.join(shellDir, filename), path.join(destinationDir, filename))
    ));
}

module.exports = {
    convertSurfaceDataToStandardPngData,
    convertSurfaceToStandardPngData,
    convertSurfaceToStandardPng,
    convertSurfacesToStandardPngs,
};

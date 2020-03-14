// @ts-check

/* eslint-disable no-undef */

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");
const { convertSurfacesToStandardPngs } = require("../convertSurfaceToStandardPng");

const targetsDir = path.join(__dirname, "/assets/targets");
const resultsDir = path.join(__dirname, "/assets/results");
const tmpDir = path.join(__dirname, "/assets/tmp");

/** @param {string} filename  */
const resultPathOf = filename => path.join(resultsDir, filename);
/** @param {string} filename  */
const tmpPathOf = filename => path.join(tmpDir, filename);

const filenames = fs.readdirSync(targetsDir).filter(f => /\.png$/.test(f));

describe("convertSurfaceToStandardPng", () => {
    before(async () => {
        await convertSurfacesToStandardPngs(targetsDir, tmpDir);
    });
    // eslint-disable-next-line no-restricted-syntax
    for (const filename of filenames) {
        it(filename, async () => {
            const tmp = await Jimp.read(tmpPathOf(filename));
            const result = await Jimp.read(resultPathOf(filename));
            assert.equal(tmp.bitmap.width, result.bitmap.width);
            assert.equal(tmp.bitmap.height, result.bitmap.height);
            const tmpData = tmp.bitmap.data;
            const resultData = result.bitmap.data;
            tmp.scan(0, 0, tmp.bitmap.width, tmp.bitmap.height, (x, y, index) => {
                const tmpAlpha = tmpData[index + 3];
                if (tmpAlpha) {
                    assert.equal(tmpAlpha, resultData[index + 3], `${filename} [${x}, ${y}] a`);
                    assert.equal(tmpData[index], resultData[index], `${filename} [${x}, ${y}] r`);
                    assert.equal(tmpData[index + 1], resultData[index + 1], `${filename} [${x}, ${y}] g`);
                    assert.equal(tmpData[index + 2], resultData[index + 2], `${filename} [${x}, ${y}] b`);
                } else {
                    assert.equal(resultData[index + 3], 0, `${filename} [${x}, ${y}] transparent`);
                }
            });
        });
    }
    after(() => {
        // eslint-disable-next-line no-restricted-syntax
        for (const filename of filenames) {
            fs.unlinkSync(tmpPathOf(filename));
        }
    });
});

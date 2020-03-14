#!/usr/bin/env node

// @ts-check

const { convertSurfacesToStandardPngs } = require("./convertSurfaceToStandardPng");

if (process.argv.length !== 4) {
    // eslint-disable-next-line no-console
    console.error("Usage: ukagaka-surface-to-standard-png /path/to/shell/master /path/to/output-dir");
    process.exit(1);
}

convertSurfacesToStandardPngs(process.argv[2], process.argv[3]);

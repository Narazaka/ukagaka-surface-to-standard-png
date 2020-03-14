import * as Jimp from "jimp";

export function convertSurfaceDataToStandardPngData(shell: Jimp, pna?: Jimp): Promise<void>;
export function convertSurfaceToStandardPngData(shellPath: string): Promise<Jimp>;
export function convertSurfaceToStandardPng(shellPath: string, destinationPath: string): Promise<void>;
export function convertSurfacesToStandardPngs(shellDir: string, destinationDir: string): Promise<void[]>;

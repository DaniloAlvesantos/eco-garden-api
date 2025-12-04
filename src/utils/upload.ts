import { UPLOADS_DIR } from "../server.js";
import { pipeline } from "node:stream/promises";
import { createWriteStream, promises as fsPromises } from "node:fs";
import path from "node:path";
import type { MultipartFile } from "@fastify/multipart";

function sanitizeFolderName(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
}

function sanitizeFilename(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9-.]/g, "");
}

async function ensureUploadDir(garden: string) {
  const sanitizedGarden = sanitizeFolderName(garden);
  const gardenDir = path.join(UPLOADS_DIR, sanitizedGarden);
  await fsPromises.mkdir(gardenDir, { recursive: true });
  return sanitizedGarden;
}

export async function uploadFile(file: MultipartFile, gardenName: string) {
  const sanitizedGarden = await ensureUploadDir(gardenName);

  const originalBasename = path.parse(file.filename.trim()).name;
  const originalExt = path.parse(file.filename.trim()).ext;

  const sanitizedBasename = sanitizeFilename(originalBasename);

  const filename = `${sanitizedGarden}_${sanitizedBasename}${originalExt}`;
  const filepath = path.join(UPLOADS_DIR, sanitizedGarden, filename);

  console.log("Saving file to:", filepath);

  await pipeline(file.file, createWriteStream(filepath));

  return {
    filename,
    url: filepath,
    imgUrl: "/uploads/" + path.join(sanitizedGarden, filename),
    folder: sanitizedGarden,
  };
}

async function deleteFile(currentUrl: string, gardenName: string) {
  const sanitizedGarden = sanitizeFolderName(gardenName);
  const currentFilename = path.basename(currentUrl);
  const currentFilePath = path.join(
    UPLOADS_DIR,
    sanitizedGarden,
    currentFilename
  );

  try {
    await fsPromises.unlink(currentFilePath);
    console.log(`Successfully deleted file: ${currentFilePath}`);
    return true;
  } catch (err: any) {
    if (err.code === "ENOENT") {
      console.log(
        `File not found at ${currentFilePath}, proceeding as success.`
      );
      return true;
    }
    console.error(`Error deleting file at ${currentFilePath}:`, err);
    return false;
  }
}

export async function replaceFile(
  file: MultipartFile,
  currentUrl: string,
  gardenName: string
) {
  const sanitizedGarden = await ensureUploadDir(gardenName);
  await deleteFile(currentUrl, sanitizedGarden);
  const newFile = await uploadFile(file, sanitizedGarden);
  return newFile;
}

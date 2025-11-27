import { UPLOADS_DIR } from "../server.js";
import { pipeline } from "node:stream/promises";
import { createWriteStream, promises as fsPromises } from "node:fs";
import path from "node:path";
import type { MultipartFile } from "@fastify/multipart";

async function ensureUploadDir(garden: string) {
  const gardenDir = path.join(UPLOADS_DIR, garden);
  await fsPromises.mkdir(gardenDir, { recursive: true });
}

function sanitizeFilename(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9-.]/g, "");
}

export async function uploadFile(file: MultipartFile, gardenName: string) {
  await ensureUploadDir(gardenName);

  const originalBasename = path.parse(file.filename.trim()).name;
  const originalExt = path.parse(file.filename.trim()).ext;

  const sanitizedBasename = sanitizeFilename(originalBasename);

  const filename = `${gardenName}_${sanitizedBasename}${originalExt}`;

  const filepath = path.join(UPLOADS_DIR, gardenName, filename);
  console.log("Saving file to:", filepath);

  await pipeline(file.file, createWriteStream(filepath));
  const imgUrl = path.join(gardenName, filename);

  return {
    filename,
    url: filepath,
    imgUrl: "/uploads/" + imgUrl,
  };
}

async function deleteFile(currentUrl: string, gardenName: string) {
  const currentFilename = path.basename(currentUrl);
  const currentFilePath = path.join(UPLOADS_DIR, gardenName, currentFilename);

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
  await ensureUploadDir(gardenName);
  await deleteFile(currentUrl, gardenName);
  const newFile = await uploadFile(file, gardenName);
  return newFile;
}

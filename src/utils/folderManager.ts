import fs from "fs";
import path from "path";

export function initializeDownloadFolders() {
  const downloadsFolder = path.join(process.cwd(), "downloads");
  const newFolder = path.join(downloadsFolder, "new");
  const oldFolder = path.join(downloadsFolder, "old");

  if (!fs.existsSync(downloadsFolder)) {
    fs.mkdirSync(downloadsFolder);
  }
  if (!fs.existsSync(newFolder)) {
    fs.mkdirSync(newFolder);
  }
  if (!fs.existsSync(oldFolder)) {
    fs.mkdirSync(oldFolder);
  }

  const categories = fs
    .readdirSync(newFolder, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const category of categories) {
    const categoryNewPath = path.join(newFolder, category);
    const categoryOldPath = path.join(oldFolder, category);

    if (!fs.existsSync(categoryOldPath)) {
      fs.mkdirSync(categoryOldPath, { recursive: true });
    }

    const downloadFiles = fs.readdirSync(categoryNewPath).filter(file => file.endsWith('.download'));
    for (const downloadFile of downloadFiles) {
      const downloadFilePath = path.join(categoryNewPath, downloadFile);
      fs.unlinkSync(downloadFilePath);
      console.log(`Deleted ${downloadFile} in new/${category}`);
    }

    const files = fs.readdirSync(categoryNewPath);
    for (const file of files) {
      if (file !== "ids.txt") {
        const sourcePath = path.join(categoryNewPath, file);
        const destPath = path.join(categoryOldPath, file);

        fs.renameSync(sourcePath, destPath);
        console.log(`Moved ${file} from new/${category} to old/${category}`);
      }
    }

    const remainingFiles = fs.readdirSync(categoryNewPath);
    if (
      remainingFiles.length === 0 ||
      (remainingFiles.length === 1 && remainingFiles[0] === "ids.txt")
    ) {
      console.log(`Kept ids.txt in new/${category}`);
    }
  }

  console.log("Download folders initialized successfully");
}

export function getNewDownloadPath(category: string): string {
  return path.join(process.cwd(), "downloads", "new", category);
}

export function getIdsFilePath(category: string): string {
  return path.join(getNewDownloadPath(category), "ids.txt");
}

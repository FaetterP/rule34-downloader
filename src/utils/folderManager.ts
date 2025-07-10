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
    const idsFilePath = path.join(categoryNewPath, "ids.txt");

    // Создаем папку old/{category} если её нет
    if (!fs.existsSync(categoryOldPath)) {
      fs.mkdirSync(categoryOldPath, { recursive: true });
    }

    // Перемещаем все файлы кроме ids.txt
    const files = fs.readdirSync(categoryNewPath);
    for (const file of files) {
      if (file !== "ids.txt") {
        const sourcePath = path.join(categoryNewPath, file);
        const destPath = path.join(categoryOldPath, file);

        // Перемещаем файл
        fs.renameSync(sourcePath, destPath);
        console.log(`Moved ${file} from new/${category} to old/${category}`);
      }
    }

    // Если папка new/{category} пустая (кроме ids.txt), удаляем её
    const remainingFiles = fs.readdirSync(categoryNewPath);
    if (
      remainingFiles.length === 0 ||
      (remainingFiles.length === 1 && remainingFiles[0] === "ids.txt")
    ) {
      // Оставляем только ids.txt в папке new/{category}
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

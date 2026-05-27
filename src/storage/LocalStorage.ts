import type { NoteFile, NoteFolder, NoteImage } from "../types";
import { isFolder } from "../utils/utils";

async function readFolderRecursive(
  handle: FileSystemDirectoryHandle,
  parentId: string | null,
): Promise<NoteFolder> {
  const folder: NoteFolder = {
    id: handle.name,
    name: handle.name,
    parentId,
    children: [],
  };

  for await (const [name, entry] of (handle as any).entries()) {
    if (entry.kind === "directory") {
      const subFolder = await readFolderRecursive(entry, handle.name);
      folder.children.push(subFolder);
    } else if (name.endsWith(".html")) {
      const file = await entry.getFile();
      const raw = await file.text();
      const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/);
      const content = bodyMatch ? bodyMatch[1].trim() : raw;

      // Read images folder if it exists
      const images: NoteImage[] = [];
      try {
        const imgDir = await (handle as any).getDirectoryHandle("images");
        for await (const [imgName, imgEntry] of (imgDir as any).entries()) {
          if (imgEntry.kind === "file") {
            const imgFile = await imgEntry.getFile();
            const blob = new Blob([await imgFile.arrayBuffer()], {
              type: imgFile.type,
            });
            const blobUrl = URL.createObjectURL(blob);
            images.push({ id: crypto.randomUUID(), filename: imgName, blob });
          }
        }
      } catch {
        // no images folder, that's fine
      }

      folder.children.push({
        id: `${handle.name}/${name}`,
        name,
        parentId: handle.name,
        content,
        images,
      } as NoteFile);
    }
  }

  return folder;
}

export async function loadFromLocal(): Promise<{
  tree: NoteFolder;
  rootHandle: FileSystemDirectoryHandle;
} | null> {
  try {
    const handle = await (window as any).showDirectoryPicker({
      mode: "readwrite",
    });
    const tree = await readFolderRecursive(handle, null);
    return { tree, rootHandle: handle };
  } catch {
    return null;
  }
}

export async function saveToLocal(
  rootHandle: FileSystemDirectoryHandle,
  tree: NoteFolder,
): Promise<void> {
  await writeFolderRecursive(rootHandle, tree);
}

const EDITOR_STYLES = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    color: #111827;
    line-height: 1.75;
  }
  h1 { font-size: 2rem; font-weight: 650; line-height: 1.2; margin: 1.5rem 0 0.75rem; color: #111827; }
  h2 { font-size: 1.6rem; font-weight: 640; line-height: 1.25; margin: 1.4rem 0 0.7rem; color: #111827; }
  h3 { font-size: 1.35rem; font-weight: 630; line-height: 1.3; margin: 1.2rem 0 0.6rem; color: #111827; }
  h4 { font-size: 1.15rem; font-weight: 620; line-height: 1.35; margin: 1rem 0 0.5rem; color: #111827; }
  h5 { font-size: 1rem; font-weight: 610; line-height: 1.4; margin: 0.9rem 0 0.45rem; color: #111827; }
  h6 { font-size: 0.9rem; font-weight: 600; line-height: 1.4; margin: 0.8rem 0 0.4rem; color: #374151; }
  p { font-size: 0.9rem; font-weight: 400; line-height: 1.75; margin: 0 0 0.6rem; color: #374151; }
  ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
  ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
  li { margin: 0.25rem 0; font-size: 0.9rem; line-height: 1.75; color: #374151; }
  img { display: block; }
  img[data-size="small"]  { width: 25%; min-width: 120px; }
  img[data-size="medium"] { width: 50%; min-width: 200px; }
  img[data-size="large"]  { width: 75%; min-width: 300px; }
  img[data-size="full"]   { width: 100%; }
  img[data-align="left"]   { margin-right: auto; margin-left: 0; }
  img[data-align="center"] { margin-left: auto; margin-right: auto; }
  img[data-align="right"]  { margin-left: auto; margin-right: 0; }
`;

function wrapWithDocument(content: string, title: string): string {
  return [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `  <title>${title}</title>`,
    "  <style>",
    EDITOR_STYLES,
    "  </style>",
    "</head>",
    "<body>",
    content,
    "</body>",
    "</html>",
  ].join("\n");
}

async function writeFolderRecursive(
  dirHandle: FileSystemDirectoryHandle,
  folder: NoteFolder,
): Promise<void> {
  // Get all names currently in the tree
  const treeNames = new Set(folder.children.map((child) => child.name));

  // Delete anything on disk that's no longer in the tree
  for await (const [name, entry] of (dirHandle as any).entries()) {
    const isHtmlFile = entry.kind === "file" && name.endsWith(".html");
    const isDir = entry.kind === "directory";
    if ((isHtmlFile || isDir) && !treeNames.has(name)) {
      await dirHandle.removeEntry(name, { recursive: true });
    }
  }

  // Write everything in the tree
  for (const child of folder.children) {
    if (isFolder(child)) {
      const subDir = await (dirHandle as any).getDirectoryHandle(child.name, {
        create: true,
      });
      await writeFolderRecursive(subDir, child);
    } else {
      const fileHandle = await (dirHandle as any).getFileHandle(child.name, {
        create: true,
      });
      const writable = await fileHandle.createWritable();
      await writable.write(
        wrapWithDocument(child.content, child.name.replace(".html", "")),
      );
      // After writing the HTML file, write its images
      if (child.images?.length) {
        const imgDir = await (dirHandle as any).getDirectoryHandle("images", {
          create: true,
        });
        for (const img of child.images) {
          const imgHandle = await (imgDir as any).getFileHandle(img.filename, {
            create: true,
          });
          const writable = await imgHandle.createWritable();
          await writable.write(img.blob);
          await writable.close();
        }
      }
      await writable.close();
    }
  }
}

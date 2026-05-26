import type { NoteFile, NoteFolder } from "../types";

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
      const content = await file.text();
      folder.children.push({
        id: `${handle.name}/${name}`,
        name,
        parentId: handle.name,
        content,
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

async function writeFolderRecursive(
  dirHandle: FileSystemDirectoryHandle,
  folder: NoteFolder,
): Promise<void> {
  for (const child of folder.children) {
    if ("children" in child) {
      const subDir = await (dirHandle as any).getDirectoryHandle(child.name, {
        create: true,
      });
      await writeFolderRecursive(subDir, child);
    } else {
      const fileHandle = await (dirHandle as any).getFileHandle(child.name, {
        create: true,
      });
      const writable = await fileHandle.createWritable();
      await writable.write(child.content);
      await writable.close();
    }
  }
}

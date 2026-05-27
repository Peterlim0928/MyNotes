import { v4 as uuidv4 } from "uuid";
import type { NoteFile, NoteFolder, NoteImage } from "../types";

export function isFolder(item: NoteFile | NoteFolder): item is NoteFolder {
  return "children" in item;
}

export function hasChild(folder: NoteFolder, id: string): boolean {
  return folder.children.some(
    (child) => child.id === id || (isFolder(child) && hasChild(child, id)),
  );
}

export function addFileToTree(
  tree: NoteFolder,
  parentId: string,
  name: string,
): { tree: NoteFolder; newId: string } {
  const id = uuidv4();
  const newFile: NoteFile = {
    id,
    name: name.endsWith(".html") ? name : `${name}.html`,
    parentId,
    content: "<p></p>",
    images: [],
  };
  return { tree: insertItemIntoTree(tree, parentId, newFile), newId: id };
}

export function addFolderToTree(
  tree: NoteFolder,
  parentId: string,
  name: string,
): { tree: NoteFolder; newId: string } {
  const id = uuidv4();
  const newFolder: NoteFolder = {
    id,
    name,
    parentId,
    children: [],
  };
  return { tree: insertItemIntoTree(tree, parentId, newFolder), newId: id };
}

export function addImageToFile(
  tree: NoteFolder,
  fileId: string,
  image: NoteImage,
): NoteFolder {
  return {
    ...tree,
    children: tree.children.map((child) => {
      if (child.id === fileId) {
        const file = child as NoteFile;
        return { ...file, images: [...(file.images ?? []), image] };
      }
      if ("children" in child) return addImageToFile(child, fileId, image);
      return child;
    }),
  };
}

function insertItemIntoTree(
  node: NoteFolder,
  parentId: string,
  item: NoteFile | NoteFolder,
): NoteFolder {
  if (node.id === parentId) {
    return { ...node, children: [...node.children, item] };
  }

  return {
    ...node,
    children: node.children.map((child) =>
      isFolder(child) ? insertItemIntoTree(child, parentId, item) : child,
    ),
  };
}

export function renameItemInTree(
  tree: NoteFolder,
  id: string,
  newName: string,
): NoteFolder {
  if (tree.id === id) {
    return { ...tree, name: newName };
  }

  return {
    ...tree,
    children: tree.children.map((child) => {
      if (child.id === id) {
        const name = isFolder(child) ? newName : `${newName}.html`;
        return { ...child, name };
      }
      if (isFolder(child)) return renameItemInTree(child, id, newName);
      return child;
    }),
  };
}

export function deleteItemFromTree(tree: NoteFolder, id: string): NoteFolder {
  return {
    ...tree,
    children: tree.children
      .filter((child) => child.id !== id)
      .map((child) =>
        isFolder(child) ? deleteItemFromTree(child, id) : child,
      ),
  };
}

export function updateFileContentInTree(
  tree: NoteFolder,
  fileId: string,
  content: string,
): NoteFolder {
  return {
    ...tree,
    children: tree.children.map((child) => {
      if (child.id === fileId) return { ...child, content };
      if (isFolder(child))
        return updateFileContentInTree(child, fileId, content);
      return child;
    }),
  };
}

export function swapBlobUrlsForPaths(tree: NoteFolder): NoteFolder {
  return {
    ...tree,
    children: tree.children.map((child) => {
      if ("children" in child) return swapBlobUrlsForPaths(child);
      const file = child as NoteFile;
      const content = file.content.replace(
        /<img([^>]*?)src="blob:[^"]*"([^>]*?)data-src="(\.\/images\/[^"]*)"([^>]*?)>/g,
        (_, before, middle, dataSrc, after) =>
          `<img${before}src="${dataSrc}"${middle}data-src="${dataSrc}"${after}>`,
      );
      return { ...file, content };
    }),
  };
}

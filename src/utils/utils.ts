import { v4 as uuidv4 } from "uuid";
import type { NoteFile, NoteFolder } from "../types";

export function isFolder(item: NoteFile | NoteFolder): item is NoteFolder {
  return "children" in item;
}

export function isChild(folder: NoteFolder, id: string): boolean {
  return folder.children.some(
    (child) => child.id === id || ("children" in child && isChild(child, id)),
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
  };
  return { tree: insertIntoTree(tree, parentId, newFile), newId: id };
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
  return { tree: insertIntoTree(tree, parentId, newFolder), newId: id };
}

function insertIntoTree(
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
      "children" in child ? insertIntoTree(child, parentId, item) : child,
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
        const name = "children" in child ? newName : `${newName}.html`;
        return { ...child, name };
      }
      if ("children" in child) return renameItemInTree(child, id, newName);
      return child;
    }),
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
      if ("children" in child)
        return updateFileContentInTree(child, fileId, content);
      return child;
    }),
  };
}

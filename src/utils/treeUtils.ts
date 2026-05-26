import { v4 as uuidv4 } from "uuid";
import type { NoteFile, NoteFolder } from "../types";

export function addFileToTree(
  tree: NoteFolder,
  parentId: string,
  name: string,
): NoteFolder {
  const newFile: NoteFile = {
    id: uuidv4(),
    name: name.endsWith(".html") ? name : `${name}.html`,
    parentId,
    content: "<p></p>",
  };

  return insertIntoTree(tree, parentId, newFile);
}

export function addFolderToTree(
  tree: NoteFolder,
  parentId: string,
  name: string,
): NoteFolder {
  const newFolder: NoteFolder = {
    id: uuidv4(),
    name,
    parentId,
    children: [],
  };

  return insertIntoTree(tree, parentId, newFolder);
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

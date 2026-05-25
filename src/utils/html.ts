import type { NoteFile, NoteFolder } from "../types";

export function isFolder(item: NoteFile | NoteFolder): item is NoteFolder {
  return "children" in item;
}

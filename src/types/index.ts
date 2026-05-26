export interface NoteFile {
  id: string;
  name: string;
  parentId: string | null;
  content: string;
}

export interface NoteFolder {
  id: string;
  name: string;
  parentId: string | null;
  children: (NoteFile | NoteFolder)[];
}

export type StorageType = "local" | "google" | "onedrive";

export type WorkspaceSource =
  | { type: "new" }
  | { type: "local"; path: string }
  | { type: "google"; folderId: string }
  | { type: "onedrive"; folderId: string };

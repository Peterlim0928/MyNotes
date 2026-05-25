export interface NoteFile {
  id: string;
  name: string;
  parentId: string | null;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NoteFolder {
  id: string;
  name: string;
  parentId: string | null;
  children: (NoteFile | NoteFolder)[];
}

export type StorageType = "google" | "onedrive" | "local";

export interface StorageProvider {
  readFolder: (folderId: string) => Promise<NoteFolder>;
  readFile: (fileId: string) => Promise<string>;
  writeFile: (fileId: string, content: string) => Promise<void>;
  createFile: (name: string, parentId: string) => Promise<NoteFile>;
  createFolder: (name: string, parentId: string) => Promise<NoteFolder>;
  deleteFile: (fileId: string) => Promise<void>;
  renameFile: (fileId: string, name: string) => Promise<void>;
}

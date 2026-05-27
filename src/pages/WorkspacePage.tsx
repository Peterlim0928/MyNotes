import { useEffect, useState } from "react";
import FileTree from "../components/sidebar/FileTree";
import TableOfContents from "../components/sidebar/TableOfContents";
import type { NoteFile, NoteFolder, NoteImage } from "../types";
import Navbar from "../components/ui/Navbar";
import Editor from "../components/editor/Editor";
import { useActiveTOC, type TOCItem } from "../hooks/useTOC";
import type { Editor as EditorType } from "@tiptap/react";
import { useResize } from "../hooks/useResize";
import { useIsMobile } from "../hooks/useIsMobile";
import { BookOpen, X } from "lucide-react";
import { loadFromLocal, saveToLocal } from "../storage/LocalStorage";
import {
  addFileToTree,
  addFolderToTree,
  addImageToFile,
  deleteItemFromTree,
  renameItemInTree,
  swapBlobUrlsForPaths,
  updateFileContentInTree,
} from "../utils/utils";

export default function WorkspacePage() {
  const isMobile = useIsMobile();
  const [selectedFile, setSelectedFile] = useState<NoteFile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [content, setContent] = useState("");
  const [editor, setEditor] = useState<EditorType | null>(null);
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [tocOpen, setTocOpen] = useState(false);
  const [hasFolder, setHasFolder] = useState(false);
  const [folderTree, setFolderTree] = useState<NoteFolder | null>(null);
  const [rootHandle, setRootHandle] =
    useState<FileSystemDirectoryHandle | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageBlobMap, setImageBlobMap] = useState<Record<string, string>>({});

  const { width: tocWidth, onMouseDown: onTOCResize } = useResize(
    208,
    160,
    400,
    "toc-width",
  );

  const activeId = useActiveTOC(editor, tocItems);

  const handleTOCClick = (id: string) => {
    const index = parseInt(id.replace("heading-", ""));
    if (!editor) return;
    let counter = 0;
    editor.state.doc.forEach((node, offset) => {
      if (node.type.name === "heading") {
        if (counter === index) {
          editor
            .chain()
            .focus()
            .setTextSelection(offset + 1)
            .run();
        }
        counter++;
      }
    });
  };

  const handleCreateNew = () => {
    const emptyTree: NoteFolder = {
      id: "root",
      name: "My Notes",
      parentId: null,
      children: [],
    };
    setFolderTree(emptyTree);
    setHasFolder(true);
  };

  const handleLoadFolder = async (type: "local" | "google" | "onedrive") => {
    if (type === "local") {
      const result = await loadFromLocal();
      if (result) {
        setFolderTree(result.tree);
        setRootHandle(result.rootHandle);
        setHasFolder(true);
      }
    }
  };

  const handleSelectFile = (file: NoteFile) => {
    // Build a map of relative path -> blob URL
    const blobMap: Record<string, string> = {};
    if (file.images?.length) {
      for (const img of file.images) {
        const blobUrl = URL.createObjectURL(img.blob);
        blobMap[`./images/${img.filename}`] = blobUrl;
      }
    }
    setImageBlobMap(blobMap);
    setContent(file.content);
    setSelectedFile(file);
  };

  const getTargetParentId = () => {
    if (!folderTree) return null;
    if (!focusId) return folderTree.id;

    // If focused item is a folder, add inside it
    // If focused item is a file, add to its parent
    const findItem = (node: NoteFolder): NoteFile | NoteFolder | null => {
      for (const child of node.children) {
        if (child.id === focusId) return child;
        if ("children" in child) {
          const found = findItem(child);
          if (found) return found;
        }
      }
      return null;
    };

    const focused = findItem(folderTree);
    if (!focused) return folderTree.id;
    return "children" in focused
      ? focused.id
      : (focused.parentId ?? folderTree.id);
  };

  const handleAddFile = (name: string) => {
    if (!folderTree) return;
    const parentId = getTargetParentId();
    if (!parentId) return;
    const { tree, newId } = addFileToTree(folderTree, parentId, name);
    setFolderTree(tree);
    setRenamingId(newId);
  };

  const handleAddFolder = (name: string) => {
    if (!folderTree) return;
    const parentId = getTargetParentId();
    if (!parentId) return;
    const { tree, newId } = addFolderToTree(folderTree, parentId, name);
    setFolderTree(tree);
    setRenamingId(newId);
  };

  const handleRename = (id: string, newName: string) => {
    if (!folderTree) return;
    setFolderTree(renameItemInTree(folderTree, id, newName));
    setRenamingId(null);
  };

  const handleDelete = (id: string) => {
    if (!folderTree) return;
    setFolderTree(deleteItemFromTree(folderTree, id));
  };

  const handleSave = async () => {
    if (!folderTree) return;

    let handle = rootHandle;
    if (!handle) {
      try {
        handle = await (window as any).showDirectoryPicker({
          mode: "readwrite",
        });
        setRootHandle(handle);
      } catch {
        return;
      }
    }

    setSaving(true);
    try {
      let updatedTree = selectedFile
        ? updateFileContentInTree(folderTree, selectedFile.id, content)
        : folderTree;

      // Log before swap
      const currentFile = updatedTree.children.find(
        (c) => c.id === selectedFile?.id,
      ) as any;
      console.log("content before swap:", currentFile?.content?.slice(0, 500));

      updatedTree = swapBlobUrlsForPaths(updatedTree);

      const afterFile = updatedTree.children.find(
        (c) => c.id === selectedFile?.id,
      ) as any;
      console.log("content after swap:", afterFile?.content?.slice(0, 500));

      await saveToLocal(handle!, updatedTree);
      setFolderTree(updatedTree);
    } finally {
      setSaving(false);
    }
  };

  const handleImageAdd = (image: NoteImage) => {
    if (!selectedFile || !folderTree) return;
    setFolderTree(addImageToFile(folderTree, selectedFile.id, image));
  };

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    console.log("Folder tree updated:", folderTree);
  }, [folderTree]);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 dark:text-gray-300 overflow-hidden">
      <Navbar onSave={handleSave} saving={saving} canSave={hasFolder} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className="relative border-r border-gray-200 dark:border-gray-600 flex-shrink-0 overflow-hidden transition-width duration-200"
          style={{ width: sidebarOpen ? "280px" : "56px" }}
        >
          <FileTree
            selectedId={selectedFile?.id ?? null}
            onSelect={handleSelectFile}
            collapsed={!sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            hasFolder={hasFolder}
            folderTree={folderTree}
            onCreateNew={handleCreateNew}
            onLoadFolder={handleLoadFolder}
            onAddFile={handleAddFile}
            onAddFolder={handleAddFolder}
            focusId={focusId}
            onFocus={setFocusId}
            renamingId={renamingId}
            onRenameStart={setRenamingId}
            onRenameConfirm={handleRename}
            onDelete={handleDelete}
          />
        </aside>

        {/* Middle — Editor */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedFile ? (
            <Editor
              content={content}
              onChange={setContent}
              onTOCChange={setTocItems}
              onEditorReady={setEditor}
              onImageAdd={handleImageAdd}
              imageBlobMap={imageBlobMap}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-300 text-sm">
              Select a note to get started
            </div>
          )}
        </main>

        {/* Right Sidebar — TOC (Desktop) */}
        {!isMobile && (
          <aside
            className="border-l border-gray-200 dark:border-gray-600 flex-shrink-0 relative flex"
            style={{ width: `${tocWidth}px` }}
          >
            {/* Drag handle */}
            <div
              onMouseDown={onTOCResize}
              className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 transition-colors z-10"
            />
            <div className="flex-1 overflow-hidden">
              <TableOfContents
                items={tocItems}
                activeId={activeId}
                onClickItem={handleTOCClick}
              />
            </div>
          </aside>
        )}

        {/* Floating TOC — Mobile */}
        {isMobile && (
          <>
            {/* Floating button */}
            <button
              onClick={() => setTocOpen((o) => !o)}
              className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg flex items-center justify-center transition-colors"
            >
              {tocOpen ? <X size={18} /> : <BookOpen size={18} />}
            </button>

            {/* Overlay panel */}
            {tocOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setTocOpen(false)}
                />

                {/* Panel */}
                <div className="fixed bottom-20 right-6 z-50 w-64 max-h-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden flex flex-col">
                  <div className="overflow-y-auto flex-1">
                    <TableOfContents
                      items={tocItems}
                      activeId={activeId}
                      onClickItem={(id) => {
                        handleTOCClick(id);
                        setTocOpen(false);
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

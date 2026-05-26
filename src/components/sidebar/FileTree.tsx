import { useState } from "react";
import type { NoteFile, NoteFolder } from "../../types";
import FileTreeItem from "./FileTreeItem";
import {
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  FilePlus,
  FolderPlus,
  HelpCircleIcon,
  Settings,
  HardDrive,
  ArrowLeft,
  PlusCircle,
  FolderInput,
} from "lucide-react";

type Step = "root" | "load";

interface Props {
  selectedId: string | null;
  onSelect: (file: NoteFile) => void;
  collapsed: boolean;
  onToggle: () => void;
  hasFolder: boolean;
  folderTree: NoteFolder | null;
  onCreateNew: () => void;
  onLoadFolder: (type: "local" | "google" | "onedrive") => void;
  onAddFile: (name: string) => void;
  onAddFolder: (name: string) => void;
  focusId: string | null;
  onFocus: (id: string | null) => void;
}

export default function FileTree({
  selectedId,
  onSelect,
  collapsed,
  onToggle,
  hasFolder,
  folderTree,
  onCreateNew,
  onLoadFolder,
  onAddFile,
  onAddFolder,
  focusId,
  onFocus,
}: Props) {
  const [step, setStep] = useState<Step>("root");

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className={`flex items-center border-b border-gray-100 dark:border-gray-600 h-16 flex-shrink-0 ${collapsed ? "justify-center px-0" : "px-4 gap-2"}`}
      >
        {!collapsed && (
          <div className="flex flex-1 items-center gap-3">
            <FolderOpen size={20} className="text-yellow-500 flex-shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex-1 truncate">
                {hasFolder ? folderTree?.name : "No Folder"}
              </span>
              <span className="text-xs text-gray-400 font-semibold dark:text-gray-400 flex-1 truncate">
                {hasFolder ? "Personal Workspace" : "Select a storage"}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Empty state — step 1: create or load */}
      {!hasFolder && !collapsed && step === "root" && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 gap-10">
          <div className="text-center mb-2">
            <FolderOpen
              size={32}
              className="text-gray-300 dark:text-gray-600 mx-auto mb-2"
            />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              No folder selected
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Create a new workspace or load an existing one
            </p>
          </div>
          <div className="w-3/4 max-w-xs flex flex-col gap-2">
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <PlusCircle size={15} className="text-blue-500 flex-shrink-0" />
              Create New
            </button>
            <button
              onClick={() => setStep("load")}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <FolderInput
                size={15}
                className="text-yellow-500 flex-shrink-0"
              />
              Load Existing
            </button>
          </div>
        </div>
      )}

      {/* Empty state — step 2: pick storage */}
      {!hasFolder && !collapsed && step === "load" && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 gap-10">
          <div className="text-center mb-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Choose storage
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Where are your notes stored?
            </p>
          </div>
          <div className="w-3/4 max-w-xs flex flex-col gap-2">
            <button
              onClick={() => onLoadFolder("local")}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <HardDrive size={15} className="text-gray-500 flex-shrink-0" />
              Local Drive
            </button>
            <button
              onClick={() => onLoadFolder("google")}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <img
                src="https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png"
                className="w-4 h-4 flex-shrink-0"
              />
              Google Drive
            </button>
            <button
              onClick={() => onLoadFolder("onedrive")}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <img
                src="https://res.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/brand-icons/product/svg/onedrive_16x1.svg"
                className="w-4 h-4 flex-shrink-0"
              />
              OneDrive
            </button>
          </div>
          <button
            onClick={() => setStep("root")}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mt-1"
          >
            <ArrowLeft size={12} />
            Back
          </button>
        </div>
      )}

      {/* File list */}
      {hasFolder && folderTree && (
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
          {collapsed || (
            <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider p-3">
              <span>Files</span>
              <div className="flex items-center gap-1">
                <button
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-md transition-colors"
                  title="New file"
                  onClick={() => {
                    const name = prompt("File name:");
                    if (name?.trim()) onAddFile(name.trim());
                  }}
                >
                  <FilePlus
                    size={14}
                    className="text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  />
                </button>
                <button
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-md transition-colors"
                  title="New folder"
                  onClick={() => {
                    const name = prompt("Folder name:");
                    if (name?.trim()) onAddFolder(name.trim());
                  }}
                >
                  <FolderPlus
                    size={14}
                    className="text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  />
                </button>
              </div>
            </div>
          )}
          <div className="gap-1 flex flex-col">
            {folderTree?.children.map((item) => (
              <FileTreeItem
                key={item.id}
                item={item}
                depth={0}
                selectedId={selectedId}
                onSelect={onSelect}
                collapsed={collapsed}
                focusedId={focusId}
                onFocus={onFocus}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-100 dark:border-gray-600 p-2">
        <button className="w-full flex items-center justify-start px-3 py-2 gap-3 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
          <HelpCircleIcon size={16} className="flex-shrink-0" />
          <span
            className={`text-sm text-gray-600 dark:text-gray-300 overflow-hidden transition-all duration-300 whitespace-nowrap ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
          >
            Help
          </span>
        </button>
        <button className="w-full flex items-center justify-start px-3 py-2 gap-3 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
          <Settings size={16} className="flex-shrink-0" />
          <span
            className={`text-sm text-gray-600 dark:text-gray-300 overflow-hidden transition-all duration-300 whitespace-nowrap ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
          >
            Settings
          </span>
        </button>
      </div>
    </div>
  );
}

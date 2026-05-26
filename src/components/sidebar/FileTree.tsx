import type { NoteFile } from "../../types";
import { MOCK_TREE } from "../../utils/mock";
import FileTreeItem from "./FileTreeItem";
import { FolderOpen, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  selectedId: string | null;
  onSelect: (file: NoteFile) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export default function FileTree({
  selectedId,
  onSelect,
  collapsed,
  onToggle,
}: Props) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className={`flex items-center border-b border-gray-100 dark:border-gray-600 h-12 flex-shrink-0 ${collapsed ? "justify-center px-0" : "px-4 gap-2"}`}
      >
        {!collapsed && (
          <>
            <FolderOpen size={15} className="text-yellow-500 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex-1 truncate">
              {MOCK_TREE.name}
            </span>
          </>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto p-2">
        {MOCK_TREE.children.map((item) => (
          <FileTreeItem
            key={item.id}
            item={item}
            depth={0}
            selectedId={selectedId}
            onSelect={onSelect}
            collapsed={collapsed}
          />
        ))}
      </div>
    </div>
  );
}

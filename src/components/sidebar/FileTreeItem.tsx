import { ChevronRight, ChevronDown, FileText, Folder } from "lucide-react";
import { useState } from "react";
import type { NoteFile, NoteFolder } from "../../types";
import { isFolder } from "../../utils/html";

interface Props {
  item: NoteFile | NoteFolder;
  depth: number;
  selectedId: string | null;
  onSelect: (file: NoteFile) => void;
  collapsed: boolean;
}

export default function FileTreeItem({
  item,
  depth,
  selectedId,
  onSelect,
  collapsed,
}: Props) {
  const [open, setOpen] = useState(true);

  if (isFolder(item)) {
    return (
      <div>
        <button
          onClick={() => !collapsed && setOpen(!open)}
          title={collapsed ? item.name : undefined}
          className={`flex items-center gap-2 w-full py-3 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors ${!collapsed && "pr-3"}`}
          style={{ paddingLeft: collapsed ? "0px" : `${depth * 16 + 16}px` }}
        >
          {/* Collapse everything to centered icon when sidebar is collapsed */}
          {collapsed ? (
            <div className="w-full flex justify-center">
              <Folder size={16} className="text-yellow-500 flex-shrink-0" />
            </div>
          ) : (
            <>
              {open ? (
                <ChevronDown
                  size={13}
                  className="flex-shrink-0 text-gray-400"
                />
              ) : (
                <ChevronRight
                  size={13}
                  className="flex-shrink-0 text-gray-400"
                />
              )}
              <Folder size={14} className="flex-shrink-0 text-yellow-500" />
              <span className="truncate">{item.name}</span>
            </>
          )}
        </button>

        {/* Only render children when expanded and sidebar is open */}
        {!collapsed &&
          open &&
          item.children.map((child) => (
            <FileTreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              collapsed={collapsed}
            />
          ))}
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect(item)}
      title={collapsed ? item.name : undefined}
      className={`flex items-center gap-2 w-full py-3 text-sm rounded-md transition-colors ${!collapsed && "pr-3"} ${
        selectedId === item.id
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-600 hover:bg-gray-100"
      }`}
      style={{ paddingLeft: collapsed ? "0px" : `${depth * 16 + 16}px` }}
    >
      {collapsed ? (
        <div className="w-full flex justify-center">
          <FileText
            size={16}
            className={
              selectedId === item.id ? "text-blue-500" : "text-gray-400"
            }
          />
        </div>
      ) : (
        <>
          <FileText size={14} className="flex-shrink-0 text-gray-400" />
          <span className="truncate">{item.name}</span>
        </>
      )}
    </button>
  );
}

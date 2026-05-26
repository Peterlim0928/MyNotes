import { ChevronRight, ChevronDown, FileText, Folder } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { NoteFile, NoteFolder } from "../../types";
import { isChild, isFolder } from "../../utils/utils";
import ContextMenu from "../ui/ContextMenu";

interface Props {
  item: NoteFile | NoteFolder;
  depth: number;
  selectedId: string | null;
  onSelect: (file: NoteFile) => void;
  collapsed: boolean;
  focusedId: string | null;
  onFocus: (id: string) => void;
  renamingId: string | null;
  onRenameStart: (id: string) => void;
  onRenameConfirm: (id: string, newName: string) => void;
}

export default function FileTreeItem({
  item,
  depth,
  selectedId,
  onSelect,
  collapsed,
  focusedId,
  onFocus,
  renamingId,
  onRenameStart,
  onRenameConfirm,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const displayName = item.name.endsWith(".html")
    ? item.name.slice(0, -5)
    : item.name;
  const [renameValue, setRenameValue] = useState(displayName);

  const contextMenuItems = [
    { label: "Rename", onClick: () => onRenameStart(item.id) },
    {
      label: "Delete",
      onClick: () => alert("delete"),
      className: "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
    },
  ];

  const renameInput = (
    <input
      ref={inputRef}
      value={renameValue}
      onChange={(e) => setRenameValue(e.target.value)}
      onBlur={() => onRenameConfirm(item.id, renameValue)}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Enter") onRenameConfirm(item.id, renameValue);
        if (e.key === "Escape") onRenameConfirm(item.id, displayName);
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="flex-1 bg-white dark:bg-gray-800 border border-blue-400 rounded px-1 text-sm outline-none text-gray-700 dark:text-gray-200 min-w-0"
    />
  );

  // Reset when renamingId changes to this item
  useEffect(() => {
    if (renamingId === item.id) {
      setRenameValue(displayName);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    // If a child is being renamed, expand this folder
    if (isFolder(item) && renamingId && isChild(item, renamingId)) {
      setExpanded(true);
    }
  }, [renamingId]);

  if (isFolder(item)) {
    return (
      <div className="gap-1 flex flex-col">
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setExpanded((expanded) => !expanded);
              onFocus(item.id);
            }
          }}
          onClick={() => {
            setExpanded((expanded) => !expanded);
            onFocus(item.id);
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
            focusedId === item.id
              ? "ring-1 ring-blue-400 dark:ring-blue-500"
              : ""
          } text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
          style={{ paddingLeft: collapsed ? "" : `${depth * 16 + 16}px` }}
        >
          {collapsed ? (
            <div className="w-full flex justify-center">
              <Folder size={16} className="text-yellow-500 flex-shrink-0" />
            </div>
          ) : (
            <>
              {expanded ? (
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
              {renamingId === item.id ? (
                renameInput
              ) : (
                <span className="truncate flex-1 text-left">{displayName}</span>
              )}
              <div
                className={`transition-opacity duration-150 ${
                  hovered || menuOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                <ContextMenu
                  items={contextMenuItems}
                  onOpenChange={setMenuOpen}
                />
              </div>
            </>
          )}
        </div>
        {!collapsed &&
          expanded &&
          item.children.map((child) => (
            <FileTreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              collapsed={collapsed}
              focusedId={focusedId}
              onFocus={onFocus}
              renamingId={renamingId}
              onRenameStart={onRenameStart}
              onRenameConfirm={onRenameConfirm}
            />
          ))}
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        onSelect(item);
        onFocus(item.id);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSelect(item);
          onFocus(item.id);
        }
      }}
      title={collapsed ? displayName : undefined}
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
        focusedId === item.id ? "ring-1 ring-blue-400 dark:ring-blue-500" : ""
      } ${
        selectedId === item.id
          ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
      style={{ paddingLeft: collapsed ? "" : `${depth * 16 + 16}px` }}
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
          {renamingId === item.id ? (
            renameInput
          ) : (
            <span className="truncate flex-1 text-left">{displayName}</span>
          )}
          <div
            className={`transition-opacity duration-150 ${
              hovered || menuOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <ContextMenu items={contextMenuItems} onOpenChange={setMenuOpen} />
          </div>
        </>
      )}
    </div>
  );
}

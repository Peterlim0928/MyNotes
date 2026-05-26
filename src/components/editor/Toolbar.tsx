import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  ImageIcon,
  Link,
  Upload,
} from "lucide-react";
import Dropdown from "../ui/Dropdown";
import { useRef, useState } from "react";

interface Props {
  editor: Editor | null;
  onImageUpload: (file: File) => void;
  onImageURL: (url: string) => void;
  isImageSelected: boolean;
}

const HEADINGS = [
  { label: "Paragraph", value: 0 },
  { label: "Heading 1", value: 1 },
  { label: "Heading 2", value: 2 },
  { label: "Heading 3", value: 3 },
  { label: "Heading 4", value: 4 },
  { label: "Heading 5", value: 5 },
  { label: "Heading 6", value: 6 },
];

const FONT_COLORS = [
  { label: "Default", value: "" },
  { label: "Gray", value: "#6b7280" },
  { label: "Red", value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Yellow", value: "#eab308" },
  { label: "Green", value: "#22c55e" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Purple", value: "#a855f7" },
  { label: "Pink", value: "#ec4899" },
];

const SIZES = ["Small", "Medium", "Large", "Full"];

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-1" />;
}

function Spacer() {
  return <div className="flex-1" />;
}

export default function Toolbar({
  editor,
  onImageUpload,
  onImageURL,
  isImageSelected,
}: Props) {
  const [imageExpanded, setImageExpanded] = useState(false);
  const [urlInput, setUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleURLSubmit = () => {
    if (urlValue.trim()) {
      onImageURL(urlValue.trim());
      setUrlValue("");
      setUrlInput(false);
      setImageExpanded(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
      setImageExpanded(false);
    }
    e.target.value = "";
  };

  if (!editor) return null;

  const activeHeading =
    HEADINGS.find((h) =>
      h.value === 0
        ? editor.isActive("paragraph")
        : editor.isActive("heading", { level: h.value }),
    ) ?? HEADINGS[0];

  const ToolBtn = ({
    onClick,
    active = false,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? "bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-blue-300"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border-b border-gray-200 dark:border-gray-600 px-3 py-1.5 flex items-center gap-1 bg-gray-50 dark:bg-gray-800 overflow-x-auto">
      <Dropdown
        trigger={
          <button className="flex items-center gap-1 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 rounded transition-colors min-w-32">
            <span className="flex-1 text-left">{activeHeading.label}</span>
            <ChevronDown
              size={13}
              className="text-gray-400 dark:text-gray-500"
            />
          </button>
        }
        items={HEADINGS.map((h) => ({
          label: h.label,
          value: h.value,
          style: {
            fontSize: h.value === 0 ? 14 : `${22 - h.value * 2}px`,
            fontWeight: h.value === 0 ? 400 : 600,
          },
        }))}
        activeValue={activeHeading.value}
        onSelect={(value) => {
          if (value === 0) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor
              .chain()
              .focus()
              .setHeading({ level: value as 1 | 2 | 3 | 4 | 5 | 6 })
              .run();
          }
        }}
        contentClassName="min-w-36"
      />

      <Divider />

      <ToolBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <Bold size={15} />
      </ToolBtn>

      <ToolBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <Italic size={15} />
      </ToolBtn>

      <ToolBtn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="Underline"
      >
        <Underline size={15} />
      </ToolBtn>

      <Dropdown
        trigger={
          <button
            className="flex items-center gap-0.5 p-1.5 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            title="Font color"
          >
            <div className="flex flex-col items-center leading-none">
              <span
                className="text-sm"
                style={{
                  marginBottom: -2,
                }}
              >
                A
              </span>
              <div
                className="h-0.5 w-3.5 rounded-full"
                style={{
                  backgroundColor:
                    editor.getAttributes("textStyle").color || "#111827",
                }}
              />
            </div>
            <ChevronDown size={11} className="text-gray-400" />
          </button>
        }
        items={FONT_COLORS.map((c) => ({
          label: c.label,
          value: c.value,
          className: "flex items-center gap-2",
        }))}
        activeValue={editor.getAttributes("textStyle").color ?? ""}
        onSelect={(value) => {
          if (value === "") {
            editor.chain().focus().unsetColor().run();
          } else {
            editor
              .chain()
              .focus()
              .setColor(value as string)
              .run();
          }
        }}
        contentClassName="min-w-36"
        renderItem={(item) => (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0"
              style={{ backgroundColor: item.value || "#111827" }}
            />
            {item.label}
          </div>
        )}
      />

      <Divider />

      <ToolBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet list"
      >
        <List size={15} />
      </ToolBtn>

      <ToolBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Numbered list"
      >
        <ListOrdered size={15} />
      </ToolBtn>

      <Divider />

      <ToolBtn
        onClick={() => {
          if (isImageSelected) {
            editor
              .chain()
              .focus()
              .updateAttributes("image", { align: "left" })
              .run();
          } else {
            editor.chain().focus().setTextAlign("left").run();
          }
        }}
        active={
          isImageSelected
            ? editor.getAttributes("image").align === "left"
            : editor.isActive({ textAlign: "left" })
        }
        title="Align left"
      >
        <AlignLeft size={15} />
      </ToolBtn>

      <ToolBtn
        onClick={() => {
          if (isImageSelected) {
            editor
              .chain()
              .focus()
              .updateAttributes("image", { align: "center" })
              .run();
          } else {
            editor.chain().focus().setTextAlign("center").run();
          }
        }}
        active={
          isImageSelected
            ? editor.getAttributes("image").align === "center"
            : editor.isActive({ textAlign: "center" })
        }
        title="Align center"
      >
        <AlignCenter size={15} />
      </ToolBtn>

      <ToolBtn
        onClick={() => {
          if (isImageSelected) {
            editor
              .chain()
              .focus()
              .updateAttributes("image", { align: "right" })
              .run();
          } else {
            editor.chain().focus().setTextAlign("right").run();
          }
        }}
        active={
          isImageSelected
            ? editor.getAttributes("image").align === "right"
            : editor.isActive({ textAlign: "right" })
        }
        title="Align right"
      >
        <AlignRight size={15} />
      </ToolBtn>

      <Divider />

      {/* Image button */}
      <ToolBtn
        onClick={() => {
          setImageExpanded((e) => !e);
          setUrlInput(false);
          setUrlValue("");
        }}
        active={imageExpanded}
        title="Image"
      >
        <ImageIcon size={15} />
      </ToolBtn>

      <div
        className={`flex items-center gap-1 overflow-hidden transition-all duration-200 ease-in-out ${
          imageExpanded ? "opacity-100" : "opacity-0"
        }`}
      >
        {urlInput ? (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              type="url"
              placeholder="Paste image URL..."
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleURLSubmit();
                if (e.key === "Escape") {
                  setUrlInput(false);
                  setUrlValue("");
                }
              }}
              className="border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 text-xs outline-none focus:border-blue-400 dark:bg-gray-800 dark:text-gray-200 w-48"
            />
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                handleURLSubmit();
              }}
              className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              Insert
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                setUrlInput(false);
                setUrlValue("");
              }}
              className="text-xs px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <ToolBtn onClick={() => setUrlInput(true)} title="Insert from URL">
              <Link size={15} />
            </ToolBtn>
            <ToolBtn
              onClick={() => fileRef.current?.click()}
              title="Upload from device"
            >
              <Upload size={15} />
            </ToolBtn>
          </>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {isImageSelected &&
        (() => {
          const currentSize = editor.getAttributes("image").size ?? "medium";
          const currentIndex = SIZES.findIndex(
            (s) => s.toLowerCase() === currentSize,
          );

          return (
            <div className="relative flex items-center bg-blue-100 rounded-md mx-1">
              {/* Sliding indicator */}
              <div
                className="absolute top-0 bottom-0 rounded transition-all duration-200 ease-in-out bg-blue-600"
                style={{
                  width: `calc(100% / ${SIZES.length})`,
                  left: `calc(${currentIndex} * 100% / ${SIZES.length})`,
                }}
              />
              {SIZES.map((s) => (
                <button
                  key={s}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    editor
                      .chain()
                      .focus()
                      .updateAttributes("image", { size: s.toLowerCase() })
                      .run();
                  }}
                  className={`relative z-10 px-2 py-1 w-15 text-xs rounded transition-colors duration-200 ${
                    currentSize === s.toLowerCase()
                      ? "text-white font-medium"
                      : "text-blue-700 hover:text-blue-900"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          );
        })()}

      <Spacer />
    </div>
  );
}

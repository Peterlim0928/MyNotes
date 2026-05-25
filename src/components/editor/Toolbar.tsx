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
} from "lucide-react";
import Dropdown from "../ui/Dropdown";

interface Props {
  editor: Editor | null;
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

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-1" />;
}

function Spacer() {
  return <div className="flex-1" />;
}

export default function Toolbar({ editor }: Props) {
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
    <div className="border-b border-gray-200 dark:border-gray-600 px-3 py-1.5 flex items-center gap-1 bg-gray-50 dark:bg-gray-800">
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
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
        title="Align left"
      >
        <AlignLeft size={15} />
      </ToolBtn>

      <ToolBtn
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
        title="Align center"
      >
        <AlignCenter size={15} />
      </ToolBtn>

      <ToolBtn
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
        title="Align right"
      >
        <AlignRight size={15} />
      </ToolBtn>

      <Spacer />
    </div>
  );
}

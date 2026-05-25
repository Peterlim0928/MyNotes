import { Editor } from "@tiptap/react";
import { ChevronDown } from "lucide-react";
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

export default function Toolbar({ editor }: Props) {
  if (!editor) return null;

  const activeHeading =
    HEADINGS.find((h) =>
      h.value === 0
        ? editor.isActive("paragraph")
        : editor.isActive("heading", { level: h.value }),
    ) ?? HEADINGS[0];

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
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  useEditor,
  EditorContent,
  type Editor as EditorType,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Toolbar from "./Toolbar";
import "./Editor.css";
import { type TOCItem, useTOC } from "../../hooks/useTOC";

interface Props {
  content: string;
  onChange: (html: string) => void;
  onTOCChange: (items: TOCItem[]) => void;
  onEditorReady: (editor: EditorType) => void;
}

export default function Editor({
  content,
  onChange,
  onTOCChange,
  onEditorReady,
}: Props) {
  const [, rerender] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    editorProps: {
      attributes: {
        spellcheck: "false",
      },
    },
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: () => {
      rerender((n) => n + 1);
    },
  });

  const tocItems = useTOC(editor);

  // Bubble TOC changes up to WorkspacePage
  useEffect(() => {
    onTOCChange(tocItems);
  }, [tocItems]);

  useEffect(() => {
    if (editor) onEditorReady(editor);
  }, [editor]);

  return (
    <div className="flex flex-col h-full">
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="editor-content h-full px-10 py-8"
        />
      </div>
    </div>
  );
}

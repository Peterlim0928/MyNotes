import { useEffect, useState } from "react";
import {
  useEditor,
  EditorContent,
  type Editor as EditorType,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Toolbar from "./Toolbar";
import "./Editor.css";
import { type TOCItem, useTOC } from "../../hooks/useTOC";
import { CustomImage } from "./extensions/CustomImage";

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
      TextStyle,
      Color,
      CustomImage,
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

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      editor?.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
  };

  const handleImageURL = (url: string) => {
    editor
      ?.chain()
      .focus()
      .setImage({ src: url } as any)
      .run();
  };

  const isImageSelected = (() => {
    if (!editor) return false;
    const { selection } = editor.state;
    const node = (selection as any).node;
    return node?.type.name === "image";
  })();

  // Bubble TOC changes up to WorkspacePage
  useEffect(() => {
    onTOCChange(tocItems);
  }, [tocItems]);

  useEffect(() => {
    if (editor) onEditorReady(editor);
  }, [editor]);

  return (
    <div className="flex flex-col h-full">
      <Toolbar
        editor={editor}
        onImageUpload={handleImageUpload}
        onImageURL={handleImageURL}
        isImageSelected={isImageSelected}
      />
      <div className="flex-1 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="editor-content h-full px-10 py-8"
        />
      </div>
    </div>
  );
}

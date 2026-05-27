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
import type { NoteImage } from "../../types";

interface Props {
  content: string;
  onChange: (html: string) => void;
  onTOCChange: (items: TOCItem[]) => void;
  onEditorReady: (editor: EditorType) => void;
  onImageAdd: (image: NoteImage) => void;
  imageBlobMap: Record<string, string>;
}

export default function Editor({
  content,
  onChange,
  onTOCChange,
  onEditorReady,
  onImageAdd,
  imageBlobMap,
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
    const filename = `${crypto.randomUUID()}-${file.name}`;
    const blobUrl = URL.createObjectURL(file);

    (editor?.chain().focus() as any)
      .setImage({
        src: blobUrl, // blob URL for display in editor
        "data-src": `./images/${filename}`, // relative path for saving
        size: "medium",
        align: "center",
      })
      .run();

    onImageAdd({ id: crypto.randomUUID(), filename, blob: file });
  };

  const handleImageURL = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();

      // Get extension from mime type instead of URL for reliability
      const mimeToExt: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
        "image/svg+xml": "svg",
      };
      const ext = mimeToExt[blob.type] ?? "jpg";
      const filename = `${crypto.randomUUID()}.${ext}`;
      const blobUrl = URL.createObjectURL(blob);

      (editor?.chain().focus() as any)
        .setImage({
          src: blobUrl,
          "data-src": `./images/${filename}`,
          size: "medium",
          align: "center",
        })
        .run();

      onImageAdd({ id: crypto.randomUUID(), filename, blob });
    } catch {
      (editor?.chain().focus() as any).setImage({ src: url }).run();
    }
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

  useEffect(() => {
    if (!editor || Object.keys(imageBlobMap).length === 0) return;

    // Find all image nodes and update their src to blob URLs
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === "image") {
        const relativeSrc = node.attrs["data-src"] ?? node.attrs.src;
        const blobUrl = imageBlobMap[relativeSrc];
        if (blobUrl && node.attrs.src !== blobUrl) {
          editor.view.dispatch(
            editor.state.tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              src: blobUrl,
              "data-src": relativeSrc,
            }),
          );
        }
      }
    });
  }, [imageBlobMap, editor]);

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

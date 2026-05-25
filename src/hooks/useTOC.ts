import { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function useTOC(editor: Editor | null): TOCItem[] {
  const [items, setItems] = useState<TOCItem[]>([]);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const headings: TOCItem[] = [];
      let counter = 0;
      editor.state.doc.forEach((node) => {
        if (node.type.name === "heading") {
          headings.push({
            id: `heading-${counter}`,
            text: node.textContent,
            level: node.attrs.level,
          });
          counter++;
        }
      });
      setItems(headings);
    };

    update();
    editor.on("update", update);
    return () => {
      editor.off("update", update);
    };
  }, [editor]);

  return items;
}

export function useActiveTOC(
  editor: Editor | null,
  items: TOCItem[],
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!editor || items.length === 0) return;

    const update = () => {
      const { $anchor } = editor.state.selection;
      let activeIndex: number | null = null;
      let counter = 0;

      editor.state.doc.forEach((node, offset) => {
        if (node.type.name === "heading") {
          if ($anchor.pos >= offset) {
            activeIndex = counter;
          }
          counter++;
        }
      });

      setActiveId(activeIndex !== null ? `heading-${activeIndex}` : null);
    };

    update();
    editor.on("selectionUpdate", update);
    editor.on("update", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("update", update);
    };
  }, [editor, items]);

  return activeId;
}

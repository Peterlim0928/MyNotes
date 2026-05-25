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
      editor.state.doc.forEach((node, _, index) => {
        if (node.type.name === "heading") {
          const id = `heading-${index}`;
          headings.push({
            id,
            text: node.textContent,
            level: node.attrs.level,
          });
        }
      });
      setItems(headings);

      // Stamp IDs onto the actual DOM heading elements so we can scroll to them
      const editorEl = editor.view.dom;
      const domHeadings = editorEl.querySelectorAll("h1,h2,h3,h4,h5,h6");
      domHeadings.forEach((el, i) => {
        el.setAttribute("id", `heading-${i}`);
      });
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

      editor.state.doc.forEach((node, offset, index) => {
        if (node.type.name === "heading") {
          if ($anchor.pos >= offset) {
            activeIndex = index;
          }
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

import { useState } from "react";
import FileTree from "../components/sidebar/FileTree";
import TableOfContents from "../components/sidebar/TableOfContents";
import type { NoteFile } from "../types";
import Navbar from "../components/ui/Navbar";
import Editor from "../components/editor/Editor";
import { useActiveTOC, type TOCItem } from "../hooks/useTOC";
import type { Editor as EditorType } from "@tiptap/react";
import { MOCK_CONTENT } from "../utils/mock";
import { useResize } from "../hooks/useResize";
import { useIsMobile } from "../hooks/useIsMobile";
import { BookOpen, X } from "lucide-react";

// const MOCK_CONTENT = `
//   <h1>Cell Structure</h1>
//   <p>This note covers the basics of cell biology.</p>
//   <h2>What is a Cell?</h2>
//   <p>The cell is the basic structural and functional unit of life.</p>
//   <h3>Cell Membrane</h3>
//   <p>The cell membrane controls what enters and exits the cell.</p>
//   <h3>Nucleus</h3>
//   <p>The nucleus contains the cell's genetic material.</p>
//   <h2>Summary</h2>
//   <p>Cells are incredibly complex structures with many components.</p>
// `;

export default function WorkspacePage() {
  const isMobile = useIsMobile();
  const [selectedFile, setSelectedFile] = useState<NoteFile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [content, setContent] = useState(MOCK_CONTENT);
  const [editor, setEditor] = useState<EditorType | null>(null);
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [tocOpen, setTocOpen] = useState(false);

  const { width: tocWidth, onMouseDown: onTOCResize } = useResize(
    208,
    160,
    400,
  );

  const activeId = useActiveTOC(editor, tocItems);

  const handleTOCClick = (id: string) => {
    const index = parseInt(id.replace("heading-", ""));
    if (!editor) return;
    let counter = 0;
    editor.state.doc.forEach((node, offset) => {
      if (node.type.name === "heading") {
        if (counter === index) {
          editor
            .chain()
            .focus()
            .setTextSelection(offset + 1)
            .run();
        }
        counter++;
      }
    });
  };

  const handleSave = (html: string) => {
    // Phase 3 will save this to Drive/OneDrive/local
    console.log("Auto-saving...", html.slice(0, 80));
    setContent(html);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 dark:text-gray-300 overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className="relative border-r border-gray-200 dark:border-gray-600 flex-shrink-0 overflow-hidden"
          style={{ width: sidebarOpen ? "280px" : "48px" }}
        >
          <FileTree
            selectedId={selectedFile?.id ?? null}
            onSelect={setSelectedFile}
            collapsed={!sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        </aside>

        {/* Middle — Editor */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedFile ? (
            <Editor
              content={content}
              onChange={handleSave}
              onTOCChange={setTocItems}
              onEditorReady={setEditor}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-300 text-sm">
              Select a note to get started
            </div>
          )}
        </main>

        {/* Right Sidebar — TOC (Desktop) */}
        {!isMobile && (
          <aside
            className="border-l border-gray-200 flex-shrink-0 relative flex"
            style={{ width: `${tocWidth}px` }}
          >
            {/* Drag handle */}
            <div
              onMouseDown={onTOCResize}
              className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 transition-colors z-10"
            />
            <div className="flex-1 overflow-hidden">
              <TableOfContents
                items={tocItems}
                activeId={activeId}
                onClickItem={handleTOCClick}
              />
            </div>
          </aside>
        )}

        {/* Floating TOC — Mobile */}
        {isMobile && (
          <>
            {/* Floating button */}
            <button
              onClick={() => setTocOpen((o) => !o)}
              className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg flex items-center justify-center transition-colors"
            >
              {tocOpen ? <X size={18} /> : <BookOpen size={18} />}
            </button>

            {/* Overlay panel */}
            {tocOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setTocOpen(false)}
                />

                {/* Panel */}
                <div className="fixed bottom-20 right-6 z-50 w-64 max-h-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden flex flex-col">
                  <div className="px-3 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                    On this page
                  </div>
                  <div className="overflow-y-auto flex-1">
                    <TableOfContents
                      items={tocItems}
                      activeId={activeId}
                      onClickItem={(id) => {
                        handleTOCClick(id);
                        setTocOpen(false);
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

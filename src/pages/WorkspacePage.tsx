import { useState } from "react";
import FileTree from "../components/sidebar/FileTree";
import TableOfContents from "../components/sidebar/TableOfContents";
import type { NoteFile } from "../types";
import Navbar from "../components/ui/NavBar";

export default function WorkspacePage() {
  const [selectedFile, setSelectedFile] = useState<NoteFile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800 overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className="relative border-r border-gray-200 flex-shrink-0 transition-all duration-300 overflow-hidden"
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
          {/* <div className="border-b border-gray-200 px-6 py-3 text-sm text-gray-400">
            {selectedFile ? selectedFile.name : "Select a note to get started"}
          </div> */}
          <div className="flex-1 overflow-y-auto px-10 py-8">
            {selectedFile ? (
              <p className="text-gray-400 text-sm">
                Editor will go here — {selectedFile.name}
              </p>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-300 text-sm">
                No note selected
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar — TOC */}
        <aside className="w-52 border-l border-gray-200 flex-shrink-0">
          <TableOfContents />
        </aside>
      </div>
    </div>
  );
}

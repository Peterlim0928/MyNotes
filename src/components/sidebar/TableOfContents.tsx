const MOCK_HEADINGS = [
  { id: "h1", text: "Introduction", level: 1 },
  { id: "h2", text: "What is a Cell?", level: 2 },
  { id: "h3", text: "Cell Membrane", level: 3 },
  { id: "h4", text: "Nucleus", level: 3 },
  { id: "h5", text: "Summary", level: 2 },
];

export default function TableOfContents() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Outline
      </div>
      <div className="border-t border-gray-200 mx-4 py-1" />
      <div className="flex-1 overflow-y-auto px-2">
        {MOCK_HEADINGS.map((heading) => (
          <button
            key={heading.id}
            className="block w-full text-left text-sm py-2 text-gray-500 hover:text-gray-900 truncate"
            style={{ paddingLeft: `${heading.level * 12}px` }}
          >
            {heading.text}
          </button>
        ))}
      </div>
    </div>
  );
}

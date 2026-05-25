import type { TOCItem } from "../../hooks/useTOC";

interface Props {
  items: TOCItem[];
  activeId: string | null;
  onClickItem: (id: string) => void;
}

export default function TableOfContents({
  items,
  activeId,
  onClickItem,
}: Props) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Outline
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {items.length === 0 ? (
          <p className="text-xs text-gray-300 px-2">No headings yet</p>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => onClickItem(item.id)}
              className={`block w-full text-left text-sm py-1.5 truncate transition-colors border-l-2 pl-2 ${
                activeId === item.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              style={{ paddingLeft: `${item.level * 12}px` }}
              title={item.text}
            >
              {item.text}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

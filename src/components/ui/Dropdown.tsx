import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { Key } from "react";

interface DropdownItem<T> {
  label: string;
  value: T;
  style?: React.CSSProperties;
  className?: string;
}

interface Props<T> {
  trigger: React.ReactNode;
  items: DropdownItem<T>[];
  activeValue?: T;
  onSelect: (value: T) => void;
  contentClassName?: string;
  renderItem?: (item: DropdownItem<T>) => React.ReactNode;
}

export default function Dropdown<T extends Key | null | undefined>({
  trigger,
  items,
  activeValue,
  onSelect,
  contentClassName,
  renderItem,
}: Props<T>) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 z-50 ${contentClassName ?? ""}`}
        >
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.value}
              onSelect={() => onSelect(item.value)}
              className={`block w-full text-left px-3 py-1.5 outline-none cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 ${
                activeValue === item.value
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300"
              } ${item.className ?? ""}`}
              style={item.style}
            >
              {renderItem ? renderItem(item) : item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

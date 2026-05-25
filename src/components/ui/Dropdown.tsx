import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface DropdownItem {
  label: string;
  value: string | number;
  style?: React.CSSProperties;
  className?: string;
}

interface Props {
  trigger: React.ReactNode;
  items: DropdownItem[];
  activeValue?: string | number;
  onSelect: (value: string | number) => void;
  contentClassName?: string;
}

export default function Dropdown({
  trigger,
  items,
  activeValue,
  onSelect,
  contentClassName,
}: Props) {
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
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

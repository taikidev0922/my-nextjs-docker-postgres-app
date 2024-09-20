import React from "react";
import { Plus, Minus, Copy, FilterX } from "lucide-react";

type ButtonType = "add" | "remove" | "copy" | "filter";

interface GridActionButtonProps {
  type: ButtonType;
  onClick: () => void;
}

const iconMap: Record<ButtonType, React.ReactNode> = {
  add: <Plus className="w-5 h-5" />,
  remove: <Minus className="w-5 h-5" />,
  copy: <Copy className="w-5 h-5" />,
  filter: <FilterX className="w-5 h-5" />,
};

export const GridActionButton: React.FC<GridActionButtonProps> = ({
  type,
  onClick,
}) => {
  return (
    <button
      className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors border border-gray-300 rounded"
      onClick={onClick}
    >
      {iconMap[type]}
    </button>
  );
};

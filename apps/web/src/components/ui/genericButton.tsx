import { FC, ElementType } from "react";

interface GenericButtonProps {
  text: string;
  Icon?: ElementType;
  onClick: () => void;
  className?: string;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
}

const GenericButton: FC<GenericButtonProps> = ({
  text,
  Icon,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`flex items-center justify-center px-4 py-2 rounded-full w-full font-medium shadow-md font-semibold 
                ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"} 
                text-white ${className}`}
      onClick={onClick}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      <span>{text}</span>
    </button>
  );
};

export default GenericButton;

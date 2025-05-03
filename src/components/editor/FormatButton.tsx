
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

interface FormatButtonProps {
  format: string;
  icon: React.ReactNode;
  tooltip: string;
}

const FormatButton = ({ format, icon, tooltip }: FormatButtonProps) => {
  const [isActive, setIsActive] = useState(false);

  const handleFormatClick = () => {
    // Dispatch a custom event to notify the editor
    document.dispatchEvent(
      new CustomEvent('format', {
        detail: { command: format }
      })
    );
    
    // Toggle active state for styling
    setIsActive(!isActive);
  };
  
  return (
    <Toggle 
      pressed={isActive}
      onPressedChange={handleFormatClick}
      aria-label={tooltip} 
      title={tooltip}
      className="h-8 w-8 p-0 data-[state=on]:bg-gray-200"
    >
      {icon}
    </Toggle>
  );
};

export default FormatButton;

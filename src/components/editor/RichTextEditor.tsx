import { useRef, useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder = "Tell your story..." }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize editor with value
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Handle content changes
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Handle format commands
  useEffect(() => {
    const handleFormatCommand = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.command) {
        const { command, value } = customEvent.detail;
        
        // Apply formatting command
        switch (command) {
          case 'bold':
            document.execCommand('bold', false);
            break;
          case 'italic':
            document.execCommand('italic', false);
            break;
          case 'h1':
          case 'h2':
          case 'h3':
            document.execCommand('formatBlock', false, `<${command}>`);
            break;
          case 'link':
            const url = prompt('Enter the URL:');
            if (url) document.execCommand('createLink', false, url);
            break;
          case 'ul':
            document.execCommand('insertUnorderedList', false);
            break;
          case 'ol':
            document.execCommand('insertOrderedList', false);
            break;
          case 'left':
            document.execCommand('justifyLeft', false);
            break;
          case 'center':
            document.execCommand('justifyCenter', false);
            break;
          case 'right':
            document.execCommand('justifyRight', false);
            break;
          default:
            break;
        }
        
        // Make sure editor keeps focus
        if (editorRef.current) {
          editorRef.current.focus();
          handleInput();
        }
      }
    };

    document.addEventListener('format', handleFormatCommand);
    return () => {
      document.removeEventListener('format', handleFormatCommand);
    };
  }, [onChange]);

  // Handle paste to remove formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div
      ref={editorRef}
      contentEditable
      className="min-h-[300px] outline-none border-none p-0 text-gray-800 focus:outline-none"
      onInput={handleInput}
      onPaste={handlePaste}
      placeholder={placeholder}
      dangerouslySetInnerHTML={value ? { __html: value } : undefined}
    />
  );
};

export default RichTextEditor;

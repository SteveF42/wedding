import React, { useRef, type PropsWithChildren } from "react";

interface CodeInputProps extends PropsWithChildren {
  onCodeChange?: (code: string) => void;
}

const CodeInput = ({ children, onCodeChange }: CodeInputProps) => {
  const formRef = useRef<HTMLDivElement>(null);

  const handleInputChange = () => {
    if (!formRef.current) return;

    const inputs = formRef.current.querySelectorAll<HTMLInputElement>('input[type="text"]');
    const code = Array.from(inputs).map(input => input.value || '0').join('');

    onCodeChange?.(code);
  };

  return (
    <div ref={formRef} className="flex flex-row gap-x-2" onChange={handleInputChange}>
      {children}
    </div>
  );
};

export const Numberfield = () => {
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    // Remove non-numeric characters
    input.value = input.value.replace(/[^0-9]/g, '');
    
    if (input.value.length > 1) {
      input.value = input.value.slice(0, 1);
    }

    // Auto-focus next input
    if (input.value.length === 1) {
      const next = input.nextElementSibling as HTMLInputElement;
      next?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, arrow keys
    if (
      ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)
    ) {
      return;
    }
    // Prevent if not a number
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]"
      maxLength={1}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className="border rounded-md px-2 py-3 w-12 text-center"
    />
  );
};


export default CodeInput;

import React, { useRef, type PropsWithChildren } from "react";

interface CodeInputProps extends PropsWithChildren {
  onCodeChange?: (code: string) => void;
}

const CodeInput = ({ children, onCodeChange }: CodeInputProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = () => {
    if (!formRef.current) return;

    const inputs = formRef.current.querySelectorAll<HTMLInputElement>('input[type="text"]');
    const code = Array.from(inputs).map(input => input.value || '0').join('');

    onCodeChange?.(code);
  };

  return (
    <form ref={formRef} className="flex flex-row gap-x-4" onChange={handleInputChange}>
      {children}
    </form>
  );
};

const Numberfield = () => {
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    if (input.value.length > 1) {
      input.value = input.value.slice(0, 1);
    }

    // Auto-focus next input
    if (input.value.length === 1) {
      const next = input.nextElementSibling as HTMLInputElement;
      next?.focus();
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]"
      maxLength={1}
      onInput={handleInput}
      className="bg-border px-2 py-4 w-12 text-center"
    />
  );
};

CodeInput.Numberfield = Numberfield;

export default CodeInput;

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";
import React, { useState } from "react";

const LockScreen = ({ unlock }: { unlock: () => void }) => {
  const [error, setError] = useState(false);
  const secretCode = "0000";
  const compareCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
    const code = input?.value || "";
    if (code === secretCode) {
      unlock();
    } else {
      setError(true);
    }
  };
  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <Callout.Root color="red">
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>Incorrect Code</Callout.Text>
        </Callout.Root>
      )}
      <div className="flex flex-col justify-center items-center space-y-4">
        <h1 className="text-2xl">Please Input Code: </h1>
        <div className="space-x-2">
          <input className="border border-solid rounded-md p-1 " type="text" inputMode="numeric" pattern="[0-9]*" aria-label="code input"></input>
          <button className="border rounded-md border-primary hover:bg-secondary hover:cursor-pointer p-1 px-3" onClick={compareCode}>
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;

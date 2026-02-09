import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";
import React, { useState } from "react";
import CodeInput, { Numberfield } from "../../components/CodeInput";

const LockScreen = ({ unlock }: { unlock: () => void }) => {
  const [error, setError] = useState(false);
  const [code, setCode] = useState("");
  const compareCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(code);
    const res = await fetch("/api/v1/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        code,
      }),
    });

    if (res.ok) {
      unlock();
      return;
    }
    const json = await res.json();
    setError(json?.error);
  };
  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <Callout.Root color="red">
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="flex flex-col justify-center items-center space-y-4" onSubmit={compareCode}>
        <h1 className="text-2xl">Please Input Code: </h1>
        <CodeInput onCodeChange={(code) => setCode(code)}>
          <Numberfield />
          <Numberfield />
          <Numberfield />
          <Numberfield />
          <Numberfield />
        </CodeInput>
        <button className="border rounded-md border-primary hover:bg-secondary hover:cursor-pointer p-1 px-3">Enter</button>
      </form>
    </div>
  );
};

export default LockScreen;

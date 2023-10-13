import { StyledInput } from "@/components/styledinput";
import { useState } from "react";

export default function Budget() {
  const [inputValue, setInputValue] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <main className="mx-16 mt-[142px] flex justify-center">
      <div className="flex flex-col items-center justify-center overflow-x-hidden">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-5">
            <h1 className="text-center text-xl text-black">予算設定してね</h1>
            <div className="h-[32px]">
              <StyledInput
                id="budget"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                id="submit-budget"
                className="mt-3 rounded-md border border-gray-600 px-0.5 text-black"
                type="submit"
              >
                決定
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

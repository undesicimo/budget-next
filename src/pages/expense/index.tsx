import { useState } from "react";
import budget from "../[budget]";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker from "emoji-picker-react";

export default function Expense() {
  //todo
  const budget = 0;
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");

  const handleSetExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (budget < 0) {
      confirm("予算オーバーです。よろしいですか？");
    }

    //todo
    setName("");
    setEmoji("");
    e.currentTarget.reset();
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!confirm("リセットしますか？")) {
      e.preventDefault();
      return;
    }
  };

  return (
    <form className="mx-auto w-[16.5625rem]" onSubmit={handleSetExpense}>
      <div className="flex flex-col items-center">
        <div className="flex flex-col">
          <h1 className="self-center text-2xl text-black">残高</h1>
          {budget > 0 ? (
            <h2 className="text-4xl text-black">{"¥" + budget}</h2>
          ) : (
            <>
              <h2 className="self-center text-xl text-red-700">
                {Math.abs(budget) + "円"}
              </h2>
              <h3 className="self-center text-xl text-red-700">予算オーバー</h3>
            </>
          )}
        </div>
        <div className="my-8 flex w-full flex-col gap-8">
          <div className="flex flex-row justify-between">
            <div
              className="flex
							h-[2.812rem] w-[4.6875rem] rounded-[0.56981rem]
								border-[0.608px] border-black"
            >
              <Popover>
                <PopoverTrigger className="flex h-full w-full flex-col	items-center justify-center">
                  {emoji ? <div className="text-2xl">{emoji}</div> : null}
                </PopoverTrigger>
                <PopoverContent>
                  <div>
                    <EmojiPicker
                      onEmojiClick={(emoji) => setEmoji(emoji.emoji)}
                      height={400}
                      width={300}
                      previewConfig={{
                        defaultCaption: "どいうやつ?",
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <input
              id="name-input"
              placeholder="どういうの"
              className="h-[2.812rem] w-[11.25rem] rounded-[0.56981rem] border-[0.608px]
							 border-black bg-white text-center text-black focus:outline-none"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
              id="amount-input"
              placeholder="金額"
              className="h-[2.812rem] w-full rounded-[0.56981rem] border-[0.608px]
							 border-black bg-white text-center text-black focus:outline-none"
              type="number"
            />
          </div>
        </div>
        <div className="flex h-[2.3rem] flex-row gap-8">
          <button
            className="h-full w-[7.06563rem] rounded-[0.56981rem] border border-gray-600 text-black"
            type="submit"
          >
            追加
          </button>
          <button
            id="reset-button"
            className="h-full w-[7.06563rem] rounded-[0.56981rem] border border-gray-600 text-black"
            type="reset"
            onClick={(e) => handleReset(e)}
          >
            リセット
          </button>
        </div>
      </div>
    </form>
  );
}

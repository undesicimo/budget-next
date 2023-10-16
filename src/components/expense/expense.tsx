import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import BudgetHeader from "./header";
import EmojiPicker from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ReactNode, useState } from "react";

const EmojiNameWrapper = ({ children }: { children: ReactNode }) => {
  return <div className="my-8 flex w-full flex-col gap-8">{children}</div>;
};

export default function Expense() {
  const [emoji, setEmoji] = useState("");
  const budget = 0;
  const form = useForm({
    defaultValues: {
      name: "",
      emoji: "",
      amount: 0,
    },
  });

  return (
    <Form {...form}>
      <form className="mx-auto w-[16.5625rem]">
        <div className="flex flex-col items-center">
          <BudgetHeader budget={budget} />
          <div className="my-8 flex w-full flex-col gap-8">
            <EmojiNameWrapper>
              <div
                className="flex
							h-[2.812rem] w-[4.6875rem] rounded-[0.56981rem]
								border-[0.608px] border-black"
              >
                <FormItem>
                  <FormField
                    name="emoji"
                    render={({ field }) => (
                      <FormControl>
                        <Popover>
                          <PopoverTrigger className="flex h-full w-full flex-col	items-center justify-center">
                            {form.getValues("emoji") ? (
                              <div className="text-2xl">
                                {form.getValues("emoji")}
                              </div>
                            ) : null}
                          </PopoverTrigger>
                          <PopoverContent>
                            <div>
                              <EmojiPicker
                                onEmojiClick={(emoji) => setEmoji(emoji.emoji)}
                                height={400}
                                width={300}
                              />
                              <Input
                                {...field}
                                type="text"
                                aria-hidden
                                value={emoji}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    )}
                  />
                </FormItem>
              </div>
              <FormItem>
                <FormField
                  name="name"
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="h-[2.812rem] w-[11.25rem] rounded-[0.56981rem] border-[0.608px] text-center focus:outline-none"
                      />
                    </FormControl>
                  )}
                />
              </FormItem>
            </EmojiNameWrapper>
            <div>
              <FormItem>
                <FormField
                  name="amount"
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="金額"
                        className="h-[2.812rem] w-full rounded-[0.56981rem] border-[0.608px] text-center focus:outline-none"
                      />
                    </FormControl>
                  )}
                />
              </FormItem>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

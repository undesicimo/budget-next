import ErrorPage from "@/components/error";
import BudgetHeader from "@/components/expense/header";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker, { SuggestionMode } from "emoji-picker-react";
import { useRouter } from "next/router";
import useExpenseForm from "./useExpense";
import { FaceIcon } from "@radix-ui/react-icons";
import { api } from "@/utils/api";
import { useState } from "react";

export default function ExpenseForm() {
  const router = useRouter();
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const { data, isError: isSessionNotFound } =
    api.budget.getBudgetBySession.useQuery(router.query.budget as string, {
      refetchOnWindowFocus: false,
    });

  const { form, onFormSubmit } = useExpenseForm({
    router,
  });

  if (isSessionNotFound) {
    return <ErrorPage router={router} />;
  }

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div>
        <Form {...form}>
          <form
            className="mx-auto w-[16.5625rem]"
            onSubmit={form.handleSubmit(onFormSubmit)}
          >
            <div className="flex flex-col items-center">
              <BudgetHeader budget={data?.amount} />
              <div className="my-8 flex w-full flex-col gap-8">
                <FormItem className="flex flex-row place-items-center justify-between">
                  <FormField
                    name="emoji"
                    render={({ field }) => (
                      <FormControl>
                        <Popover open={isPopoverOpen}>
                          <PopoverTrigger
                            className="	dark:border-beige h-[2.812rem] w-[4.6875rem] rounded-[0.56981rem] border-[0.608px]"
                            onClick={() => setPopoverOpen(true)}
                          >
                            {form.getValues("emoji") ? (
                              <div className="text-2xl">
                                {form.getValues("emoji")}
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <FaceIcon className="h-6 w-6" />
                              </div>
                            )}
                          </PopoverTrigger>

                          <PopoverContent
                            side="left"
                            onPointerDownOutside={() => setPopoverOpen(false)}
                            className="flex h-min w-min items-center justify-center"
                          >
                            <EmojiPicker
                              suggestedEmojisMode={SuggestionMode.FREQUENT}
                              onEmojiClick={(emoji) => {
                                field.onChange(emoji.emoji);
                                setPopoverOpen(false);
                              }}
                              height={400}
                              width={300}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    )}
                  />
                  <FormField
                    name="name"
                    render={({ field }) => (
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="どういうの"
                          className="h-[2.812rem] w-[11.25rem] rounded-[0.56981rem] border-[0.608px] text-center focus:outline-none"
                        />
                      </FormControl>
                    )}
                  />
                </FormItem>

                <div>
                  <FormField
                    name="amount"
                    render={({ field }) => (
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="金額"
                          onChange={(data) =>
                            //everythings a string....
                            field.onChange(parseInt(data.target.value))
                          }
                          className="h-[2.812rem] w-full rounded-[0.56981rem] border-[0.608px] text-center focus:outline-none"
                        />
                      </FormControl>
                    )}
                  />
                </div>
              </div>
              <div className="flex h-[2.3rem] flex-row gap-8">
                <Button
                  variant={"outline"}
                  className="h-full w-[7.06563rem] rounded-[0.56981rem] border border-gray-600"
                  type="submit"
                >
                  追加
                </Button>
                <Button
                  variant={"outline"}
                  id="reset-button"
                  className="h-full w-[7.06563rem] rounded-[0.56981rem] border border-gray-600"
                  type="reset"
                  onClick={() => form.reset()}
                >
                  リセット
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}

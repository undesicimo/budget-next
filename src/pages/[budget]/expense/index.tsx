import { useForm } from "react-hook-form";
import EmojiPicker from "emoji-picker-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import BudgetHeader from "@/components/expense/header";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import ErrorPage from "@/components/error";

export default function Expense() {
  const router = useRouter();
  const { data, isError } = api.budget.getBudgetBySession.useQuery(
    router.query.budget as string,
    {
      refetchOnWindowFocus: false,
    },
  );

  const form = useForm({
    defaultValues: {
      name: "",
      emoji: "",
      amount: "",
    },
  });

  if (isError) {
    return <ErrorPage router={router} />;
  }

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div>
        <Form {...form}>
          <form className="mx-auto w-[16.5625rem]">
            <div className="flex flex-col items-center">
              <BudgetHeader budget={data?.amount} />
              <div className="my-8 flex w-full flex-col gap-8">
                <FormItem className="flex flex-row place-items-center justify-between">
                  <FormField
                    name="emoji"
                    render={({ field }) => (
                      <FormControl>
                        <Popover>
                          <PopoverTrigger className="	h-[2.812rem] w-[4.6875rem] rounded-[0.56981rem] border-[0.608px]">
                            {form.getValues("emoji") ? (
                              <div className="text-2xl">
                                {form.getValues("emoji")}
                              </div>
                            ) : (
                              <span className="text-xl">🌭</span>
                            )}
                          </PopoverTrigger>

                          <PopoverContent>
                            <div className="h-[300] w-[300px]">
                              <EmojiPicker
                                onEmojiClick={(emoji) =>
                                  field.onChange(emoji.emoji)
                                }
                                height={400}
                                width={300}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    )}
                  />
                  <FormField
                    name="name"
                    render={({ field }) => (
                      <FormControl>
                        <input
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
                          type="text"
                          placeholder="金額"
                          className="h-[2.812rem] w-full rounded-[0.56981rem] border-[0.608px] text-center focus:outline-none"
                        />
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}

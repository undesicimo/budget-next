import ErrorPage from "@/components/error";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Budget() {
  const router = useRouter();

  const { isError } = api.sessions.findSession.useQuery(
    router.query.budget as string,
    {
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const { mutateAsync } = api.budget.updateBudget.useMutation();

  const form = useForm({
    defaultValues: {
      amount: "",
    },
  });

  const onFormSubmit: SubmitHandler<{ amount: string }> = async ({
    amount,
  }) => {
    if (amount <= "0") {
      return;
    }
    //なぜかstringが渡ってくる..
    try {
      await mutateAsync({
        amount: parseInt(amount as unknown as string),
        sessionId: router.query.budget as string,
      });

      await router.push(`/${router.query.budget as string}/expense`);
    } catch (e) {
      new Error("予算の設定に失敗しました");
    }
  };

  const onNewSessionClick = async () => {
    if (!window.confirm("すべての記録は削除されますがよろしいですか？")) {
      return;
    }
    await router.push("/");
  };

  if (isError) {
    return <ErrorPage router={router} />;
  }

  return (
    <main className="mx-16 mt-[142px] flex justify-center">
      <div className="flex flex-col items-center justify-center overflow-x-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)}>
            <div className="flex flex-col items-center gap-5">
              <h1 className="text-center text-xl">予算設定してね</h1>
              <div className="h-[35px] px-1">
                <FormItem>
                  <FormField
                    name="amount"
                    render={({ field }) => (
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                    )}
                  />
                </FormItem>
              </div>
              <div className="flex flex-row items-center justify-center gap-2">
                <Button
                  id="submit-budget"
                  variant={"ghost"}
                  className="mt-3 w-12 rounded-md border border-gray-600 px-0.5"
                  type="submit"
                >
                  決定
                </Button>
                <Button
                  id="reset-session"
                  variant={"ghost"}
                  className="mt-3 w-10 rounded-md border border-gray-600 px-0.5"
                  type="submit"
                  onClick={async () => {
                    await onNewSessionClick();
                  }}
                >
                  <RotateCcw />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}

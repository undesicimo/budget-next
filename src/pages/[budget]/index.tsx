import { StyledInput } from "@/components/styledinput";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export default function Budget() {
  const onSubmit = (value: int) => {};
  const form = useForm({
    defaultValues: {
      amount: 0,
    },
  });

  return (
    <main className="mx-16 mt-[142px] flex justify-center">
      <div className="flex flex-col items-center justify-center overflow-x-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center gap-5">
              <h1 className="text-center text-xl text-black">予算設定してね</h1>
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
              <div className="flex justify-center">
                <Button
                  id="submit-budget"
                  variant={"ghost"}
                  className="mt-3 w-12 rounded-md border border-gray-600 px-0.5"
                  type="submit"
                >
                  決定
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}

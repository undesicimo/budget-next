import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { NextRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  name: z.string(),
  emoji: z.string(),
  amount: z.number(),
});

type ExpenseFormSchema = z.infer<typeof schema>;
/**
 *
 * @param {NextRouter}
 * @returns {object} form, onFormSubmit, data, isError
 * routerを元にデータCRUD行う
 */
export default function useExpenseForm({ router }: { router: NextRouter }) {
  const form = useForm<ExpenseFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      emoji: "",
      amount: 0,
    },
  });

  const { mutateAsync } = api.expense.newExpense.useMutation();

  const onFormSubmit = async (data: ExpenseFormSchema) => {
    if (data.amount <= 0) {
      return;
    }
    try {
      await mutateAsync({
        sessionID: router.query.budget as string,
        amount: data.amount,
        name: data.name,
        emoji: data.emoji,
      });
      form.reset();
    } catch (e) {
      new Error("予算の設定に失敗しました");
    }
  };

  return {
    form,
    onFormSubmit,
  };
}

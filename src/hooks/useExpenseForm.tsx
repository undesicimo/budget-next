import { api } from "@/utils/api";
import { NextRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function useExpenseForm({
  expensesMutation,
  router,
}: {
  router: NextRouter;
  expensesMutation: ReturnType<typeof api.expense.newExpense.useMutation>;
}) {
  const form = useForm({
    defaultValues: {
      name: "",
      emoji: "",
      amount: "",
    },
  });
  const onFormSubmit = async (data: {
    name: string;
    emoji: string;
    amount: string;
  }) => {
    if (!data.amount) {
      return;
    }
    try {
      await expensesMutation.mutateAsync({
        sessionID: router.query.budget as string,
        amount: parseInt(data.amount),
        name: data.name,
        emoji: data.emoji,
      });
      form.reset();
    } catch (e) {
      new Error("予算の設定に失敗しました");
    }
  };
  return { onFormSubmit, form };
}

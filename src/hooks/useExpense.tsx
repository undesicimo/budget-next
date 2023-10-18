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
 * @param router
 * @returns form, onFormSubmit, data, isError
 * routerを元にデータCRUD行う
 */
export default function useExpenseForm({
  router,
  budgetID,
}: {
  router: NextRouter;
  budgetID: string;
}) {
  const form = useForm<ExpenseFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      emoji: "",
      amount: 0,
    },
  });

  const apiUtils = api.useContext();

  const expensesMutation = api.expense.newExpense.useMutation({
    onMutate: async (data) => {
      // なんか動く。。
      //ref https://stackoverflow.com/questions/74671735/optimistic-updates-with-react-query-trpc
      //    https://github.com/TanStack/query/blob/v4/examples/react/optimistic-updates-typescript/src/pages/index.tsx
      await apiUtils.expense.getAllExpenseByBudgetID.cancel();

      const previousExpenses = apiUtils.expense.getAllExpenseByBudgetID.getData(
        { budgetID },
      );

      apiUtils.expense.getAllExpenseByBudgetID.setData({ budgetID }, [
        ...(previousExpenses ?? []),
        {
          amount: data.amount,
          name: data.name,
          emoji: data.emoji,
          id: previousExpenses?.length ?? 0 + 1, //DBではインクリメンタルしてるのでこんな感じ
          budgetID: budgetID,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      return { previousExpenses };
    },
  });

  const onFormSubmit = async (data: ExpenseFormSchema) => {
    if (data.amount <= 0) {
      return;
    }
    try {
      await expensesMutation.mutateAsync({
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
    expensesMutation,
  };
}

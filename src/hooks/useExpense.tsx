import { api } from "@/utils/api";
import { TRPCClientError } from "@trpc/client";
import { NextRouter } from "next/router";

import { useForm } from "react-hook-form";

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
  budgetID: string | undefined;
}) {
  const form = useForm({
    defaultValues: {
      name: "",
      emoji: "",
      amount: "",
    },
  });

  const apiUtils = api.useContext();

  const expensesMutation = api.expense.newExpense.useMutation({
    onMutate: async (data) => {
      //ref https://stackoverflow.com/questions/74671735/optimistic-updates-with-react-query-trpc
      //    https://github.com/TanStack/query/blob/v4/examples/react/optimistic-updates-typescript/src/pages/index.tsx
      await apiUtils.expense.getAllExpenseByBudgetID.cancel();
      if (budgetID === undefined)
        throw new TRPCClientError("budgetID is undefined");

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
    onError: (_err, _newData, context) => {
      apiUtils.expense.getAllExpenseByBudgetID.setData({ budgetID }, [
        ...(context?.previousExpenses ?? []),
      ]);
    },
    onSettled: async () => {
      await apiUtils.expense.getAllExpenseByBudgetID.invalidate({ budgetID });
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

  return {
    form,
    onFormSubmit,
    expensesMutation,
  };
}

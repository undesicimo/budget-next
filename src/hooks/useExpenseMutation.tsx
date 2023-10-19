import { api } from "@/utils/api";
import { TRPCClientError } from "@trpc/client";
import { NextRouter } from "next/router";

/**
 * routerを元にデータCRUD行う
 */
export default function useExpenseMutation({
  router,
  budgetID,
}: {
  router: NextRouter;
  budgetID: string | undefined;
}) {
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
      //どちも最新のデータを取得する
      await apiUtils.expense.getAllExpenseByBudgetID.invalidate({ budgetID });
      await apiUtils.budget.getBudgetBySession.invalidate(
        router.query.budget as string,
      );
    },
  });

  const { mutate: deleteExpense, ...deleteOps } =
    api.expense.deleteExpense.useMutation({
      onMutate: async (data) => {
        await apiUtils.expense.getAllExpenseByBudgetID.cancel();
        if (data.relatedBudget.id === undefined)
          throw new TRPCClientError("budgetID is undefined");

        const previousExpenses =
          apiUtils.expense.getAllExpenseByBudgetID.getData({ budgetID });

        apiUtils.expense.getAllExpenseByBudgetID.setData(
          { budgetID },
          previousExpenses?.filter((item) => item.id !== data.expenseID),
        );
        return { previousExpenses };
      },
      onError: (_err, _newData, context) => {
        apiUtils.expense.getAllExpenseByBudgetID.setData({ budgetID }, [
          ...(context?.previousExpenses ?? []),
        ]);
      },
      onSettled: async () => {
        //どちも最新のデータを取得する
        await apiUtils.expense.getAllExpenseByBudgetID.invalidate({ budgetID });
        await apiUtils.budget.getBudgetBySession.invalidate(
          router.query.budget as string,
        );
      },
    });

  return {
    expensesMutation,
    deleteExpense,
    ...deleteOps,
  };
}

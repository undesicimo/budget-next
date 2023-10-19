import { api } from "@/utils/api";

export default function useExpenseQuery({
  budgetID,
}: {
  budgetID: string | undefined;
}) {
  const { data: expenses } = api.expense.getAllExpenseByBudgetID.useQuery(
    { budgetID },
    {
      refetchOnWindowFocus: false,
    },
  );

  return {
    expenses,
  };
}

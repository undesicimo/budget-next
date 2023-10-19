import { api } from "@/utils/api";

export default function useBudgetMutation() {
  const { mutate: resetBudgetBySession, ...budgetMutations } =
    api.budget.resetBudget.useMutation();
  return {
    ...budgetMutations,
    resetBudgetBySession,
  };
}

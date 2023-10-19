import { api } from "@/utils/api";
import { NextRouter } from "next/router";

export default function useBudgetQuery({ router }: { router: NextRouter }) {
  const { data: budget, isError: isSessionNotFound } =
    api.budget.getBudgetBySession.useQuery(router.query.budget as string, {
      refetchOnWindowFocus: false,
      enabled: !!router.query.budget,
    });

  return {
    budget,
    isSessionNotFound,
  };
}

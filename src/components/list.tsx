import { Trash2Icon } from "lucide-react";
import { useCallback } from "react";
import DialogMain from "./dialog";
import { Budget, Expense } from "@prisma/client";
import useExpenseMutation from "@/hooks/useExpenseMutation";
import { useRouter } from "next/router";

export default function ExpenseList({
  expenses,
  budget,
}: {
  expenses: Expense[] | undefined;
  budget: Budget;
}) {
  const router = useRouter();
  const createdData = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
  }, []);

  const { deleteExpense } = useExpenseMutation({
    router,
    budgetID: budget?.id,
  });

  const onDeleteClick = (selectedItemID: number, amount: number) => {
    deleteExpense({
      amount,
      expenseID: selectedItemID,
      relatedBudget: budget,
    });
  };

  return (
    <div className="my-8 h-[300px] overflow-auto">
      {expenses?.map((item) => (
        <div
          className="mb-4 flex h-16 w-[21rem] flex-row justify-between rounded-[2.5rem] bg-zinc-200 px-2"
          key={item.id}
        >
          <button className="flex flex-row gap-5">
            <div className="h-[3.125rem] w-[3.125rem] flex-shrink-0 self-center rounded-full border-[1.5px] border-slate-300 bg-white">
              <div className="text-[1.875rem]">{item.emoji}</div>
            </div>
            <div className="w-16 self-center">
              <p className="truncate text-black" title={item.name}>
                {item.name}
              </p>
              <p className="text-[0.61rem] text-black">
                {createdData(item.createdAt)}
              </p>
            </div>
            <div className="self-center">
              <p className="text-2xl text-black">{`${item.amount}円`}</p>
            </div>
          </button>
          <div className="h-[24px] w-[24px] self-center">
            <button onClick={() => onDeleteClick(item.id, item.amount)}>
              <Trash2Icon />
            </button>
          </div>
        </div>
      ))}
      <DialogMain
      // id={selectedItemID}
      // expense={expense}
      // selectedRef={dialogRef}
      />
    </div>
  );
}

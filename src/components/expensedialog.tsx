import { Expense } from "@prisma/client";
import { DialogContent } from "./ui/dialog";
import useFormatDate from "@/hooks/useFormatDate";

export default function DialogMain({ expense }: { expense: Expense }) {
  const { formatDate } = useFormatDate();
  return (
    <DialogContent className="bg-alt dark:bg-beigedark  h-[12.1] w-[17.2rem] border-[0.625rem]">
      <section className="flex flex-col place-items-center gap-[1.8rem] text-center">
        <div>
          <div className="w-36">
            <p className="truncate text-3xl">{expense.name}</p>
          </div>
          <div>
            <p className="text-xs">{formatDate(expense.createdAt)}</p>
          </div>
        </div>
        <div>
          <p className="text-4xl">{`¥${expense.amount}`}</p>
        </div>
      </section>
    </DialogContent>
  );
}

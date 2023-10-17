export default function BudgetHeader({
  budget,
}: {
  budget: number | undefined;
}) {
  if (budget === undefined) return null;
  return (
    <div className="flex flex-col">
      <h1 className="self-center text-2xl">💰残高</h1>
      {budget > 0 ? (
        <h2 className="text-4xl">{"¥" + budget}</h2>
      ) : (
        <>
          <h2 className="self-center text-xl text-red-700">
            {Math.abs(budget) + "円"}
          </h2>
          <h3 className="self-center text-xl text-red-700">予算オーバー</h3>
        </>
      )}
    </div>
  );
}

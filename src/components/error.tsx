import { NextRouter } from "next/router";
import { Button } from "./ui/button";

export default function ErrorPage({ router }: { router: NextRouter }) {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <h1>
          <span className="text-3xl">404</span> Not Found
        </h1>
        <Button
          onClick={async () => {
            await router.push("/");
          }}
          variant={"ghost"}
        >
          Start a new session
        </Button>
      </div>
    </main>
  );
}

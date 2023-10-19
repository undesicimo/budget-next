import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { TRPCClientError } from "@trpc/client";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const { mutate } = api.sessions.newSession.useMutation({
    onSuccess: async (data) => {
      await router.push(`/${data}`);
    },
    onError: (error) => {
      new TRPCClientError(error.message);
    },
  });

  const onMutateClick = () => {
    mutate();
  };

  return (
    <>
      <Head>
        <title>Budget</title>
        <meta name="description" content="budget" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-[142px] flex h-screen w-screen flex-col items-center justify-center">
        <div>
          <h1>Welcome</h1>
        </div>
        <div>
          <Button className="w-30" onClick={onMutateClick}>
            Start a new session
          </Button>
        </div>
      </main>
    </>
  );
}

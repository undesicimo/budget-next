import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { TRPCClientError } from "@trpc/client";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import manWithMoney from "../../public/images/man-with-money.png";
import { ArrowBigRightDash } from "lucide-react";

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
        <link rel="icon" href="/fab.ico" />
      </Head>
      <main className="flex h-screen w-screen flex-col items-center justify-center gap-10">
        <div className="sm:h-[456px] sm:w-[456px] lg:h-[391px] lg:w-[391px]">
          <Image src={manWithMoney} alt="lpman" />
        </div>

        <Button
          className="rounded-3xl"
          variant={"outline"}
          onClick={onMutateClick}
        >
          {"Let's save money!"}
          <ArrowBigRightDash />
        </Button>
      </main>
    </>
  );
}

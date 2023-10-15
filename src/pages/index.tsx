import { Button } from "@/components/ui/button";
import Head from "next/head";

export default function Home() {
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
          <Button className="w-30">Start a new session</Button>
        </div>
      </main>
    </>
  );
}

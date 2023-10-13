import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Budget</title>
        <meta name="description" content="budget" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-16 mt-[142px] flex h-screen w-screen justify-center">
        <h1>Welcome</h1>
      </main>
    </>
  );
}

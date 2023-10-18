import { useRouter } from "next/router";

export default function useSession() {
  const router = useRouter();

  return {
    router: router.query.budget as string,
  };
}

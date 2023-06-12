import IndexPage from "@/components";
import { useSearchParams } from "next/navigation";

export default function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const id = searchParams?.id;
  return (
    <IndexPage id={id} />
  )
}

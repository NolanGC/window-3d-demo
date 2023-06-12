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
  var title = "Generate 3D Objects with window.ai"
  fetch(`/api/find?id=${id}`, {
    // Use the /find endpoint with the 'id' parameter
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        title = data[0].prompt;
      }
    })
    .catch((error) => console.error("Failed to fetch item:", error))
  return (
    <IndexPage id={id} title={title} />
  )
}

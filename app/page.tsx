import IndexPage from "@/components";

export default async function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  var objectLink = "A chair shaped like an avocado.ply";
  var inputText = "";
  var shareLink = "";
  const populateFromID = async () => {
      return fetch(`https://window-3d-demo.vercel.app/api/find?id=${id}`, {
        // Use the /find endpoint with the 'id' parameter
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  }
  const id = searchParams?.id;
  var title = "Make AI 3D Assets"
  if (id) {
    const resp = await (await populateFromID()).json();
    objectLink = resp[0].data_uri;
    inputText = resp[0].prompt;
    shareLink = `https://window-3d-demo.vercel.app/?id=${id}`;
    title = inputText;
  }
  return (
    <IndexPage id={id} title={title} inputText={inputText} objectLink={objectLink} shareLink={shareLink} />
  )
}

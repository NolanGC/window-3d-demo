// "use client";
// import { useEffect, useRef, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import CanvasComponent from "@/components/canvas";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Loader } from "lucide-react";
// import { Label } from "@/components/ui/label";
// import { getWindowAI } from "window.ai";
// import { Input } from "@/components/ui/input";
// import toast, { Toaster } from 'react-hot-toast';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/components/ui/use-toast";

// // export async function generateMetadata(): Promise<Metadata> {
// //   return {
// //     title: "3D Object Generator",
// //     description: "Generate 3D objects from text.",
// //   };
// // }

// export default function Home() {
//   const shadToast = useToast();
//   const toastShad = shadToast.toast;
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");
//   const [objectLink, setObjectLink] = useState<string | null>(
//     "A chair shaped like an avocado.ply"
//   );
//   const [inputText, setInputText] = useState("");
//   const [shareLink, setShareLink] = useState<string>("");
//   const [generating, setGenerating] = useState<boolean>(false);
//   const [loadingPreset, setLoadingPreset] = useState<boolean>(false);
//   const [numInferenceSteps, setNumInferenceSteps] = useState<number>(32);
//   const [imageThumbnail, setImageThumbnail] = useState<string | null>("");

//   const ai = useRef<any>(null);
  
//   async function uploadToGcs(
//     dataUri: RequestInfo | URL,
//     signedUrl: RequestInfo | URL
//   ) {
//     // Convert the data URI to a Blob
//     const response = await fetch(dataUri);
//     const blob = await response.blob();

//     // Upload the Blob to GCS using the signed URL
//     const uploadResponse = await fetch(signedUrl, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/octet-stream",
//       },
//       body: blob,
//     });

//     if (!uploadResponse.ok) {
//       throw new Error(`Upload failed: ${uploadResponse.statusText}`);
//     }
//   }

//   useEffect(() => {
//     const init = async () => {
//       try {
//         const windowAI = await getWindowAI();
//         ai.current = windowAI;
//         toastShad({ title: "window.ai detected." });
//       } catch (error) {
//         // TODO: installation route
//         toast.custom(
//           <div className="bg-green-500 text-white p-4 rounded-lg shadow-md flex items-center space-x-2">
//             <div>Please install the</div>
//             <a
//               href="https://chrome.google.com/webstore/detail/window-ai/cbhbgmdpcoelfdoihppookkijpmgahag"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="underline font-semibold"
//             >
//               window.ai extension
//             </a>
//             <div> to get started!</div>
//           </div>, {
//             id: 'window-ai-not-detected',
//           }
//         );
//       }
//     };
//     if (id) {
//       setLoadingPreset(true);
//       fetch(`/api/find?id=${id}`, {
//         // Use the /find endpoint with the 'id' parameter
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data) {
//             setInputText(data[0].prompt);
//             setObjectLink(data[0].data_uri);
//             setImageThumbnail(data[0].image_thumbnail);
//           }
//         })
//         .catch((error) => console.error("Failed to fetch item:", error))
//         .finally(() => {
//           setLoadingPreset(false);
//         });
//       setShareLink(window.location.href);
//     } else {
//       init();
//     }
//   }, [id]);

//   const handleShare = () => {
//     // copy share link to clipboard
//     navigator.clipboard.writeText(shareLink);
//     toastShad({ description: "Copied link to clipboard." });
//   };

//   const handleGenerate = async () => {
//     const promptObject = { prompt: inputText };
//     try {
//       setGenerating(true);
//       if (!ai.current) {
//         toastShad({ title: "Error loading window.ai." });
//         return;
//       }
//       const output = await ai.current.BETA_generate3DObject(promptObject, {
//         extension: "application/x-ply",
//         numInferenceSteps: numInferenceSteps,
//       });
//       // Store the generated object in the DB using the API endpoint
//       const data_uri = output[0].uri;

//       const signedurlResponse = await fetch("/api/generateSignedUrl", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ filename: `${inputText}.ply` }),
//       });

//       if (!signedurlResponse.ok) {
//         throw new Error(`Failed to get signed URL: ${signedurlResponse.body}`);
//       }

//       const { signedUrl } = await signedurlResponse.json();

//       // Upload the data URI to GCS
//       await uploadToGcs(data_uri, signedUrl);

//       // Now the data URI is the public URL of the uploaded file
//       const fileName = `${inputText}.ply`;
//       const bucketName = "window-objects";
//       const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
     
//       setObjectLink(publicUrl);
//     } catch (error) {
//       console.error(error);
//       toastShad({ title: "Error generating model." });
//       setGenerating(false);
//     }
//   };
//   const handleScreenShotAndUpload = async (screenshotData: any) => {
//     try {
//         if(generating){
//           const newCreation = {
//             prompt: inputText,
//             thumbnail_uri: screenshotData,
//             data_uri: objectLink,
//           };
//           console.log(newCreation)
//           const response = await fetch("/api/creations", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(newCreation),
//           });
//           const insertedCreation = await response.json();
//           setShareLink(window.location.href + "?id=" + insertedCreation.id);
//           setGenerating(false);
//         }
//     }
//     catch (error) {
//       console.error("WE HIT THIS", error);
//       toastShad({ title: "Error uploading model." });
//       setGenerating(false);
//     }
//   }
  
//   const handleDownload = () => {
//     const link = document.createElement("a");
//     link.href = objectLink as string;
//     link.download = inputText + ".ply";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };
//   return (
//     <div className="flex flex-col h-screen w-full">
//       <Card className="h-full">
//         <CardContent className="flex flex-col md:flex-row h-full">
//           <div className="w-full md:w-1/2 h-2/3 overflow-auto p-1 md:ml-10 md:mt-10 -mb-20">
//             <Label htmlFor="promptInput">Prompt</Label>
//             <Input
//               placeholder="A chair shaped like an avocado"
//               value={inputText}
//               onChange={(e) => setInputText(e.target.value)}
//             />
//             <Label htmlFor="numInferenceSteps">Quality</Label>
//             <div className="mb-5">
//               <Select
//                 onValueChange={(value) => setNumInferenceSteps(parseInt(value))}
//                 defaultValue="32"
//               >
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Quality " />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="16">Low</SelectItem>
//                   <SelectItem value="32">Medium</SelectItem>
//                   <SelectItem value="64">High</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex flex-row">
//               <Button className="mr-3" onClick={handleGenerate}>
//                 {!generating && !loadingPreset ? "Generate Model" : <Loader className="spin" />}
//               </Button>
//               <Button className="mr-3" onClick={handleDownload}>
//                 Download Model
//               </Button>
//               <Button onClick={handleShare}>Copy Link to Model</Button>
//             </div>
//           </div>
//           <div className="w-full md:w-1/2 h-full overflow-auto p-1">
//           {objectLink && (
//             <CanvasComponent objectLink={objectLink} onScreenshotReady={handleScreenShotAndUpload} />
//           )}
//           </div>
//         </CardContent>
//       </Card>
//       <Toaster></Toaster>
//     </div>
//   );
// }

import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Beautifully designed components <br className="hidden sm:inline" />
          built with Radix UI and Tailwind CSS.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Accessible and customizable components that you can copy and paste
          into your apps. Free. Open Source. And Next.js 13 Ready.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          Documentation
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          GitHub
        </Link>
      </div>
    </section>
  )
}


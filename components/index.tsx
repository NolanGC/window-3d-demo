"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { getWindowAI } from "window.ai"

import { getSignedURL, uploadToGcs } from "@/lib/gcs"
import { uploadCreation } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToasterShad } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import CanvasComponent from "@/components/canvas"

type Props = {
  id: string | string[] | undefined
  title: string
  objectLink: string
  inputText: string
  shareLink: string
}
export function Banner() {
  return (
    <div className="bg-orange-200 text-orange-900 text-center py-2">
      <p>
        🚀 We&apos;re live on
        <a
          href="https://www.producthunt.com"
          target="_blank"
          rel="noreferrer"
          className="underline mx-2"
        >
          Product Hunt
        </a>
        and we&apos;d really appreciate your support! 🚀
      </p>
    </div>
  )
}

export default function IndexPage(props: Props) {
  const [objectLink, setObjectLink] = useState<string>(props.objectLink)
  const [inputText, setInputText] = useState<string>(props.inputText)
  const [shareLink, setShareLink] = useState<string>(props.shareLink)
  const [generating, setGenerating] = useState<boolean>(false)
  const [numInferenceSteps, setNumInferenceSteps] = useState<number>(16)
  const [lastUploadTimestamp, setLastUploadTimestamp] = useState<number>(0)
  const [openrouterApiKey, setOpenrouterApiKey] = useState<string>("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const shadToaster = useToast()
  const toastShad = shadToaster.toast
  const ai = useRef<any>(null)
  const id = props.id
  const title = props.title

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = objectLink as string
    link.download = inputText + ".ply"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const handleShare = () => {
    // copy share link to clipboard
    navigator.clipboard.writeText(shareLink)
    toastShad({ title: "Copied link to clipboard." })
  }
  const handleGenerate = async () => {
    if (ai.current) {
      handleGenerateWithWindow()
    } else if (openrouterApiKey) {
      handleGenerateWithOpenrouter()
    } else {
      getOpenRouterToast()
    }
  }

  const handleGenerateWithOpenrouter = async () => {
    try {
      const timeSinceLastUpload = Date.now() - lastUploadTimestamp
      console.log("TIME SINCE LAST UPLOAD: " + timeSinceLastUpload + "ms")
      if (timeSinceLastUpload < 8000) {
        return
      }
      setGenerating(true)
      const res = await fetch(
        "https://openrouter.ai/api/v1/objects/generations",
        {
          method: "POST",
          body: JSON.stringify({
            prompt: inputText,
            numInferenceSteps: numInferenceSteps,
          }),
          headers: {
            "HTTP-Referer": "https://window-3d-demo.vercel.app/",
            "X-Title": "3D Asset Generator",
            Authorization: `Bearer ${openrouterApiKey}`,
          },
        }
      )
      const outputJson = await res.json()
      const output = outputJson.data
      const filename = `${inputText}.ply`
      // Store the generated object in the DB using the API endpoint
      const data_uri = output[0].uri
      const signedUrl = await getSignedURL(filename)
      // Upload the data URI to GCS
      await uploadToGcs(data_uri, signedUrl, filename)
      // Now the data URI is the public URL of the uploaded file
      const bucketName = "3dobjects"
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`
      setLastUploadTimestamp(Date.now())
      setObjectLink(publicUrl)
    } catch (error) {
      console.error(error)
      toastShad({ title: "Error generating model." })
      setGenerating(false)
    }
  }
  const handleGenerateWithWindow = async () => {
    const promptObject = { prompt: inputText }
    try {
      const timeSinceLastUpload = Date.now() - lastUploadTimestamp
      console.log("TIME SINCE LAST UPLOAD: " + timeSinceLastUpload + "ms")
      if (timeSinceLastUpload < 8000) {
        return
      }
      setGenerating(true)
      if (!ai.current) {
        toastShad({ title: "Please connect to OpenRouter" })
        return
      }
      const output = await ai.current.BETA_generate3DObject(promptObject, {
        extension: "application/x-ply",
        numInferenceSteps: numInferenceSteps,
      })
      const filename = `${inputText}.ply`
      // Store the generated object in the DB using the API endpoint
      const data_uri = output[0].uri
      const signedUrl = await getSignedURL(filename)
      // Upload the data URI to GCS
      await uploadToGcs(data_uri, signedUrl, filename)
      // Now the data URI is the public URL of the uploaded file
      const bucketName = "3dobjects"
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`
      setLastUploadTimestamp(Date.now())
      setObjectLink(publicUrl)
    } catch (error) {
      console.error(error)
      toastShad({ title: "Error generating model." })
      setGenerating(false)
    }
  }

  const handleScreenShotAndUpload = async (screenshotData: any) => {
    try {
      console.log("check if generating")
      if (generating) {
        console.log("uploading")
        //console.log(screenshotData)

        const filename = `${inputText}_thumbnail.png`
        const signedUrl = await getSignedURL(filename)
        // Upload the data URI to GCS
        await uploadToGcs(screenshotData, signedUrl, filename)
        // Now the data URI is the public URL of the uploaded file
        const bucketName = "3dobjects"
        const thumbnailUrl = `https://storage.googleapis.com/${bucketName}/${filename}`
        const newCreation = {
          prompt: inputText,
          thumbnail_uri: thumbnailUrl,
          data_uri: objectLink,
        }
        const insertedCreationResponse = await uploadCreation(newCreation)
        if (id) {
          setShareLink(
            "https://window-3d-demo.vercel.app/?id=" +
              insertedCreationResponse.id
          )
        } else {
          setShareLink(
            window.location.href + "?id=" + insertedCreationResponse.id
          )
        }
        setGenerating(false)
      }
    } catch (error) {
      console.error("error screenshotting and uploading", error)
      toastShad({ title: "Error uploading model." })
      setGenerating(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const windowAI = await getWindowAI()
        ai.current = windowAI
        toastShad({ title: "window.ai detected." })
      } catch (error) {
        //getWindowToast()
        if (!openrouterApiKey) {
          getOpenRouterToast()
        }
      }
    }
    const openrouterApiKeyFromStorage = localStorage.getItem("openrouterApiKey")
    if (openrouterApiKeyFromStorage) {
      setOpenrouterApiKey(openrouterApiKeyFromStorage)
    } else {
      const codeFromSearchParams = searchParams?.get("code")
      if (codeFromSearchParams) {
        fetch("https://openrouter.ai/api/v1/auth/keys", {
          method: "POST",
          body: JSON.stringify({ code: codeFromSearchParams }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.key) {
              localStorage.setItem("openrouterApiKey", res.key)
              console.log("hello")
              setOpenrouterApiKey(res.key)
            }
          })
          .catch((err) => console.error(err))
      }
      init()
    }
  }, [])

  return (
    <>
      <Banner></Banner>
      <head>
        <title>{`${title} - generated with window.ai`}</title>
        <meta
          property="og:image"
          content={`https://window-3d-demo.vercel.app/api/og?id=${id}`}
        />
        <meta
          property="og:title"
          content={`${title} - generated with window.ai`}
        ></meta>
        <meta
          property="og:description"
          content="3D model generated with shap-e via window.ai"
        ></meta>
        <meta
          property="twitter:image"
          content={`https://window-3d-demo.vercel.app/api/og?id=${id}`}
        ></meta>
        <meta property="twitter:card" content="summary_large_image"></meta>
        <meta
          property="twitter:title"
          content={`${title} - generated with window.ai`}
        ></meta>
        <meta
          property="twitter:description"
          content="3D model generated with shap-e via Window AI"
        ></meta>
      </head>
      <div className="flex flex-col h-screen w-full">
        <Card className="h-full">
          <CardContent className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/2 h-2/3 overflow-auto p-1 md:ml-10 md:mt-10 -mb-20">
              <Label htmlFor="promptInput">Prompt</Label>
              <Input
                placeholder="A chair shaped like an avocado"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <Label htmlFor="numInferenceSteps">Quality</Label>
              <div className="mb-5">
                <Select
                  onValueChange={(value) =>
                    setNumInferenceSteps(parseInt(value))
                  }
                  defaultValue="16"
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Quality " />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16">Low</SelectItem>
                    <SelectItem value="32">Medium</SelectItem>
                    <SelectItem value="48">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-row">
                <Button className="mr-3" onClick={handleGenerate}>
                  {!generating ? "Generate Model" : <Loader className="spin" />}
                </Button>
                <Button className="mr-3" onClick={handleDownload}>
                  Download Model
                </Button>
                <Button onClick={handleShare}>Copy Link to Model</Button>
              </div>
              <Button
                className="mt-2"
                onClick={() => {
                  if (openrouterApiKey) {
                    localStorage.removeItem("openrouterApiKey")
                    setOpenrouterApiKey("")
                  } else {
                    router.push(
                      `https://openrouter.ai/auth?callback_url=${
                        window.location.origin + window.location.pathname
                      }`
                    )
                  }
                }}
              >
                {openrouterApiKey
                  ? "Clear Openrouter API Key"
                  : "Connect Openrouter"}
              </Button>
            </div>
            <div className="w-full md:w-1/2 h-full overflow-auto p-1">
              {objectLink && (
                <CanvasComponent
                  objectLink={objectLink}
                  onScreenshotReady={handleScreenShotAndUpload}
                />
              )}
            </div>
          </CardContent>
        </Card>
        <Toaster></Toaster>
        <ToasterShad></ToasterShad>
      </div>
    </>
  )
}

const getWindowToast = () => {
  toast.custom(
    <div className="bg-green-500 text-white p-4 rounded-lg shadow-md flex items-center space-x-2">
      <div>Please install the</div>
      <a
        href="https://chrome.google.com/webstore/detail/window-ai/cbhbgmdpcoelfdoihppookkijpmgahag"
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-semibold"
      >
        window.ai extension or Connect directly with OpenRouter
      </a>
      <div> to get started!</div>
    </div>,
    {
      id: "window-ai-not-detected",
    }
  )
}

const getOpenRouterToast = () => {
  toast.custom(
    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md flex items-center space-x-2">
      <div>Please connect with OpenRouter to get started!</div>
    </div>,
    {
      id: "window-ai-not-detected",
    }
  )
}

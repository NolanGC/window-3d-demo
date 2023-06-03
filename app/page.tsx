"use client";
import {useEffect, useRef, useState} from 'react';
import { useSearchParams } from 'next/navigation';
import {getWindowAI} from 'window.ai';
import CanvasComponent from "@/components/canvas";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {Loader} from 'lucide-react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useToast } from "@/components/ui/use-toast"
import { ToastProvider } from "@/components/ui/toast"


export default function Home() {
    const { toast } = useToast()
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    console.log(id)
    const [objectLink,
        setObjectLink] = useState < string > ('A chair shaped like an avocado.ply');
    const [inputText,
        setInputText] = useState('');
    const [shareLink, setShareLink] = useState < string > ('');
    const [generating,
        setGenerating] = useState < boolean > (false);
    const [numInferenceSteps,
        setNumInferenceSteps] = useState < number > (32);
    const ai = useRef < any > (null);

    useEffect(() => {
        const init = async() => {
            try {
                const windowAI = await getWindowAI();
                ai.current = windowAI;
                toast({title: "window.ai loaded."})
            } catch (error) {
                // TODO: installation route
                toast({title: "Error loading window.ai."})
            }
        }
        if (id) {
            setGenerating(true);
            fetch(`/api/find?id=${id}`, { // Use the /find endpoint with the 'id' parameter
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((res) => res.json())
              .then((data) => {
                if (data) {
                  console.log("DATA", data);
                  setInputText(data[0].prompt);
                  setObjectLink(data[0].data_uri    );
                }
              })
              .catch((error) => console.error('Failed to fetch item:', error))
              .finally(() => {
                setGenerating(false);
              });
              setShareLink(window.location.href);
          } else {
            init();
          }
        }, [id]);

    const handleShare = () => {
        // copy share link to clipboard
        navigator.clipboard.writeText(shareLink);
        toast({description: "Copied link to clipboard."})
    }

    const handleGenerate = async () => {
        const promptObject = { 'prompt': inputText }
        try {
          setGenerating(true);
          if (!ai.current) {
            toast({title: "Error loading window.ai."})
            return;
          }
          const output = await ai
            .current
            .BETA_generate3DObject(promptObject, { "extension": "application/x-ply", "numInferenceSteps": numInferenceSteps });
      
          // Store the generated object in the DB using the API endpoint
          const data_uri = output[0].uri;
          setObjectLink(data_uri);
          
      
          const newCreation = {
            prompt: inputText,
            data_uri: data_uri,
          };
          
          const response = await fetch('/api/creations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCreation),
          });
          
          const insertedCreation = await response.json();
          setShareLink(window.location.href + "?id=" + insertedCreation.id);

          setGenerating(false);
        } catch (error) {
          console.log(error)
          toast({title: "Error generating model."})
          setGenerating(false);
        }
      };
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = objectLink as string;
        link.download = inputText + '.ply';
        document
            .body
            .appendChild(link);
        link.click();
        document
            .body
            .removeChild(link);
    };
    return (
        <div className="flex flex-col h-screen w-full">
                    <Card className="h-full">
                        <CardContent className="flex h-full">
                            <div className="w-full h-full overflow-auto ml-10 mt-10 p-1">
                                <Label htmlFor="promptInput">Prompt</Label>
                                <Input
                                    placeholder="A chair shaped like an avocado"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}/>
                                <Label htmlFor="numInferenceSteps">Quality</Label>
                                <div className="mb-5">
                                  <Select
                                      onValueChange={(value) => setNumInferenceSteps(parseInt(value))}
                                      defaultValue="32">
                                      <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder="Quality "/>
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="16">Low</SelectItem>
                                          <SelectItem value="32">Medium</SelectItem>
                                          <SelectItem value="64">High</SelectItem>
                                      </SelectContent>
                                </Select>
                                </div>
                                <div className="flex flex-row">
                                <Button className="mr-3" onClick={handleGenerate}>{!generating ? "Generate Model" : <Loader className="spin"/>}</Button>
                                <Button className="mr-3"  onClick={handleDownload}>Download Model</Button>
                                <Button onClick={handleShare}>Share Link</Button>
                                </div>
                            </div>

                            {objectLink && (<CanvasComponent objectLink={objectLink}/>)}
                        </CardContent>
                    </Card>
        </div>
    )
}
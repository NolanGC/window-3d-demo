"use client";
import {useEffect, useRef, useState} from 'react';
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
import {useToast} from "@/components/ui/use-toast"
import { insertCreation } from "@/app/queries";

export default function Home() {
    const [objectLink,
        setObjectLink] = useState < string > ('A chair shaped like an avocado.ply');
    const [inputText,
        setInputText] = useState('');
    const [generating,
        setGenerating] = useState < boolean > (false);
    const [numInferenceSteps,
        setNumInferenceSteps] = useState < number > (32);
    const ai = useRef < any > (null);
    const {toast} = useToast();

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
        init();
    }, []);

    const handleGenerate = async () => {
        const promptObject = {
          'prompt': inputText
        }
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
          await fetch('/api/creations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: inputText, data_uri }),
          });
      
          setObjectLink(data_uri);
          toast({title: "Model generated and stored."})
          setGenerating(false);
        } catch (error) {
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
                            <div className="w-1/2 h-full overflow-auto ml-10 mt-10 p-1">
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
                                <Button onClick={handleDownload}>Download Model</Button>
                                </div>
                            </div>

                            {objectLink && (<CanvasComponent objectLink={objectLink}/>)}
                        </CardContent>
                    </Card>
        </div>
    )
}
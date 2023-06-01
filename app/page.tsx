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

export default function Home() {
    const [objectLink,
        setObjectLink] = useState < string > ('https://storage.googleapis.com/window-objects/9465452f-685a-43fe-9b61-4cf87c2faa70.ply');
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
                toast({title: "Error loading window.ai."})
            }
        }
        init();
    }, []);

    const handleGenerate = async() => {
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
                .BETA_generateMedia(promptObject, {
                    'type': 'object',
                    'numInferenceSteps': numInferenceSteps
                });
            console.log(output)
            setObjectLink(output[0].uri);
            toast({title: "Model generated."})
            setGenerating(false);
        } catch (error) {
            toast({title: "Error generating model."})
            setGenerating(false);
        }
    };
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = objectLink as string;
        link.download = 'model.ply';
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
                            <div className="w-1/2 h-full overflow-auto ml-10 mt-10">
                                <Label htmlFor="promptInput">Prompt</Label>
                                <Input
                                    placeholder="A donut with red frosting"
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
                                {generating
                                    ? <Loader className="spin mb-5"/>
                                    : <Button className="mr-3" onClick={handleGenerate}>Generate Model</Button>}
                                <Button onClick={handleDownload}>Download Model</Button>
                            </div>

                            {objectLink && (<CanvasComponent objectLink={objectLink}/>)}
                        </CardContent>
                    </Card>
        </div>
    )
}
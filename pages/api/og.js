import { ImageResponse } from '@vercel/og';
import { data } from 'autoprefixer';
import { NextRequest } from 'next/server';
 
export const config = {
  runtime: 'edge',
};
 
export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hasId = searchParams.has('id');
    const id = hasId
      ? searchParams.get('id')
      : "no id provided"
    
    if (!hasId) {
      return new ImageResponse(<>Visit with &quot;?username=vercel&quot;</>, {
        width: 1200,
        height: 630,
      });
    }
    else {
      // const databaseItem = await fetch(`https://window-3d-demo.vercel.app/api/find?id=${id}`, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })
      //console.log("database item")
      // const databaseItemJson = await databaseItem.json();
      //console.log(Object.keys(databaseItemJson[0]))
      // const imageThumbnail = databaseItemJson[0].thumbnail_uri;
      return new ImageResponse(
        <img src="https://i.imgur.com/DMcWUu0.png"/>
      )
    }
  } catch (error) {
   console.error(error);
   return new ImageResponse(<>Visit err &quot;?username=vercel&quot;</>, {
     width: 1200,
     height: 630,
   });
 }
} 
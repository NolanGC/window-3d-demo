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
    console.log(`http://localhost:3000/api/find?id=${id}`)
    
    if (!hasId) {
      return new ImageResponse(<>Visit with &quot;?username=vercel&quot;</>, {
        width: 1200,
        height: 630,
      });
    }
    else {
      const databaseItem = await fetch(`http://localhost:3000/api/find?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      //console.log("database item")
      const databaseItemJson = await databaseItem.json();
      //console.log(Object.keys(databaseItemJson[0]))
      const imageThumbnail = databaseItemJson[0].thumbnail_uri;
      return new ImageResponse(
        <img src={imageThumbnail}/>
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
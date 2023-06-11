import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
 
export const config = {
  runtime: 'edge',
};
 
export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
 
    // ?title=<title>
    const hasId = searchParams.has('id');
    const id = hasId
      ? searchParams.get('id')
      : "no id provided"
    if (!hasId) {
      return ImageResponse(
        <div>
          <image src="https://i.imgur.com/5O3UZtA.png"/>
        </div>
      )
    }
    else {
      const databaseItem = await fetch(`/api/find?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const databaseItemJson = await databaseItem.json();
      const imageThumbnail = databaseItemJson[0].image_thumbnail;
      return ImageResponse(
        <div>
          <image src={imageThumbnail}/>
        </div>
      )
    }
  } catch (error) {
    console.error(error);
    return ImageResponse(
      <div>
        <image src="https://i.imgur.com/5O3UZtA.png"/>
      </div>
    )
  }
} 
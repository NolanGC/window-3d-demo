import { ImageResponse } from '@vercel/og';
import { data } from 'autoprefixer';
import { NextRequest } from 'next/server';
 
export const config = {
  runtime: 'edge',
};

const thumbnail = (uri) => {
  return (
    <div
      style={{
        width: 1200,
        backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
        height: 630,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img src={uri} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  )
}
 
const fallback = new ImageResponse(
  <div
  style={{
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
    fontSize: 90,
    letterSpacing: -2,
    fontWeight: 1000,
    textAlign: 'center',
  }}
  >
  <div
    style={{
      backgroundImage: 'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
      backgroundClip: 'text',
      '-webkit-background-clip': 'text',
      color: 'transparent',
    }}
  >
    Generate
  </div>
  <div
    style={{
      backgroundImage: 'linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))',
      backgroundClip: 'text',
      '-webkit-background-clip': 'text',
      color: 'transparent',
    }}
  >
    3D
  </div>
  <div
    style={{
      backgroundImage: 'linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))',
      backgroundClip: 'text',
      '-webkit-background-clip': 'text',
      color: 'transparent',
    }}
  >
    Objects 
  </div>
</div>

)

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hasId = searchParams.has('id');
    const id = hasId
      ? searchParams.get('id')
      : "no id provided"
    
    if (!hasId) {
      return fallback;
    }
    else {
      const databaseItem = await fetch(`https://window-3d-demo.vercel.app/api/find?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const databaseItemJson = await databaseItem.json();
      console.log(Object.keys(databaseItemJson[0]))
      const imageThumbnail = databaseItemJson[0].thumbnail_uri;
      return new ImageResponse(thumbnail(imageThumbnail))
    }
  } catch (error) {
   console.error(error);
   return fallback;
 }
} 
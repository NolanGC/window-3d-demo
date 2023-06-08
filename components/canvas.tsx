import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { Html, Loader, ArcballControls, PerspectiveCamera } from '@react-three/drei';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { BufferGeometry } from 'three';

interface ModelProps {
  url: string;
  onModelLoaded: (screenshotDataUri: string) => void; // Function to call when model is loaded
}

const Model: React.FC<ModelProps> = ({ url, onModelLoaded }) => {
  const mesh = useLoader(PLYLoader, url);
  const { gl } = useThree(); // Access the WebGL context
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    mesh.computeVertexNormals();
    setModelLoaded(true);
  },[]);

  useFrame(() => {
    if (modelLoaded) {
      const screenshotDataUri = gl.domElement.toDataURL('image/png');
      //console.log("taking screenshot of", url, "uri is")
      //console.log(screenshotDataUri)
      onModelLoaded(screenshotDataUri);
      setModelLoaded(false);
    }
  });

  return (
    <mesh geometry={mesh as BufferGeometry} scale={[2, 2, 2]}>
      <meshStandardMaterial attach="material" vertexColors={true} />
    </mesh>
  );
};

interface CanvasComponentProps {
  objectLink: string | null;
  onScreenshotReady: (screenshotDataUri: string) => void;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({ objectLink, onScreenshotReady }) => {
  return (
    <div className="w-full h-full">
      <Canvas gl={{ preserveDrawingBuffer: true }} style={{ width: '100%', height: '100%' }}>
        <PerspectiveCamera makeDefault position={[0, -6, 5]} />
        <ambientLight intensity={4} />
        {objectLink && (
          <Suspense fallback={<Html center><Loader /></Html>}>
            <Model key={objectLink} url={objectLink} onModelLoaded={onScreenshotReady} />
          </Suspense>
        )}
        <ArcballControls dampingFactor={0.2} target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
};

export default CanvasComponent;
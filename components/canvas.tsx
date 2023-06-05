import { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Html, Loader, ArcballControls, PerspectiveCamera } from '@react-three/drei';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { USDZLoader } from 'three/examples/jsm/loaders/USDZLoader';
import { BufferGeometry } from 'three';

interface ModelProps {
  url: string;
}
interface CanvasComponentProps {
    objectLink: string | null;
}

const Model: React.FC<ModelProps> = ({ url }) => {
  const mesh = useLoader(PLYLoader, url);
  mesh.computeVertexNormals();
  return (
    <mesh geometry={mesh as BufferGeometry} scale={[2, 2, 2]}>
      <meshStandardMaterial attach="material" vertexColors={true} />
    </mesh>
  );
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({ objectLink }) => {
  return (
    <div className="w-full h-full">
      <Canvas style={{ width: '100%', height: '100%' }}>
      <PerspectiveCamera makeDefault position={[0, -6, 5]} />
        <ambientLight intensity={4} />
        {objectLink &&
          <Suspense fallback={<Html center><Loader /></Html>}>
            <Model url={objectLink} />
          </Suspense>
        }
        <ArcballControls dampingFactor={0.2} target={[0, 0, 0]} />
      </Canvas>
    </div>
  )
}

export default CanvasComponent;
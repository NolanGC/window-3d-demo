import { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Html, Loader } from '@react-three/drei';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { BufferGeometry } from 'three';

interface ModelProps {
  url: string;
}
interface CanvasComponentProps {
    objectLink: string | null;
}

const Model: React.FC<ModelProps> = ({ url }) => {
  const mesh = useLoader(PLYLoader, url);

  return (
    <mesh geometry={mesh as BufferGeometry} scale={[2, 2, 2]}>
      <meshBasicMaterial attach="material" vertexColors />
    </mesh>
  );
}


const CanvasComponent: React.FC<CanvasComponentProps> = ({ objectLink }) => {
  return (
    <div className="w-full h-full">
      <Canvas style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={1} />
        <spotLight intensity={1} position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <directionalLight
          color={"#FFFFFF"}
          intensity={1}
          position={[5, 5, 5]}
        />
        <pointLight position={[-10, -10, -10]} />
        {objectLink &&
          <Suspense fallback={<Html center><Loader /></Html>}>
            <Model url={objectLink} />
          </Suspense>
        }
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default CanvasComponent;

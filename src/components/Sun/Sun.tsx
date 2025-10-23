import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Sun = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      <pointLight position={[0, 0, 0]} intensity={2} color={0xffcc66} />
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial 
          color={0xffcc66} 
          emissive={0xff6600} 
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
};

export default Sun;
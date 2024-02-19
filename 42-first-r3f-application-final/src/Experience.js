import { useThree, extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CustomObject from "./CustomObject.js";

extend({ OrbitControls });

export default function Experience() {
  const { camera, gl } = useThree();  //destructure... from useThree return object

  const cubeRef = useRef();
  const groupRef = useRef();

  useFrame((state, delta) => {
    const angle = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(angle) * 8;
    state.camera.position.z = Math.cos(angle) * 8;
    state.camera.lookAt(0, 0, 0);

    cubeRef.current.rotation.y += delta;
    // groupRef.current.rotation.y += delta
  });

  return (
    <>
      {/* 
        //basic example

      <mesh scale={1} position={[2,0,0]} rotation-y={Math.PI * 0.25}>
        <sphereGeometry args={[1.5,32,32]} />
        <boxGeometry/>

        {/* <meshBasicMaterial args={[{color: 'red', wireframe:true}]}/> 
        <meshBasicMaterial color='red' wireframe />
      </mesh> 
      */}

      <orbitControls args={[camera, gl.domElement]} />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <group ref={groupRef}>
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        <mesh
          ref={cubeRef}
          rotation-y={Math.PI * 0.25}
          position-x={2}
          scale={1.5}
        >
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </group>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>

      <CustomObject />
    </>
  );
}

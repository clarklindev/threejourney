import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Suspense } from "react";

import Model from "./Model.jsx";
import Placeholder from "./Placeholder.jsx";
// import Hamburger from "./Hamburger.jsx";
// import Fox from "./Fox.jsx";

export default function Experience() {
    
  // const model = useLoader(GLTFLoader, './hamburger.glb');
  // console.log(model);

  //load with dracoloader ... moved to Model.jsx
  // const model = useLoader(
  //   GLTFLoader, 
  //   // './hamburger-draco.glb',
  //   './FlightHelmet/glTF/FlightHelmet.gltf',
  //   (loader)=>{
      
  //     const dracoLoader = new DRACOLoader();
  //     dracoLoader.setDecoderPath('./draco/');
  //     loader.setDRACOLoader(dracoLoader);
  //   }  
  // );

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight
        castShadow
        position={[1, 2, 3]}
        intensity={4.5}
        // shadow-normalBias={0.04}
      />
      <ambientLight intensity={1.5} />

      {/* <primitive object={model.scene} scale={5} position-y={-1}/> //moved to Model.jsx */}  

{/* 
      <mesh castShadow position-x={ - 2 }>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow position-x={ 2 } scale={ 1.5 }>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
      </mesh> */}

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>

   
      <Suspense 
        // fallback={ 
        //   <mesh position-y={ 0.5 } scale={ [ 2, 3, 2 ] }>
        //     <boxGeometry args={ [ 1, 1, 1, 2, 2, 2 ] } />
        //     <meshBasicMaterial wireframe color="red" />
        //   </mesh> 
        // }
        fallback={<Placeholder position-y={0.5} scale={[2, 3, 2]} />}
      >
        {/* <Hamburger scale={0.35} /> */}
        <Model/>
      </Suspense>

      {/* <Fox />  */}
    </>
  );
}

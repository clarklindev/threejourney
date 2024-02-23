
// import {useLoader} from '@react-three/fiber';
// import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { Clone, useGLTF } from "@react-three/drei";

export default function Model() {

  //basic loader
  // const model = useLoader(
  //   GLTFLoader, 
  //   './hamburger.glb',
    // './FlightHelmet/glTF/FlightHelmet.gltf',
    
    //draco loader
    // (loader)=>{
      
    //   const dracoLoader = new DRACOLoader();
    //   dracoLoader.setDecoderPath('./draco/');
    //   loader.setDRACOLoader(dracoLoader);
    // }  
  // );

  const model = useGLTF("./hamburger-draco.glb");

  return (
    // <>
    //   <Clone object={model.scene} scale={0.35} position-x={-4} />
    //   <Clone object={model.scene} scale={0.35} position-x={0} />
    //   <Clone object={model.scene} scale={0.35} position-x={4} />
    // </>

    // <primitive object={model.scene} scale={5} position-y={-1}/>  //flight helmet
    <primitive object={model.scene} scale={0.35}/>  //hamburger
  );
}

useGLTF.preload("./hamburger-draco.glb");

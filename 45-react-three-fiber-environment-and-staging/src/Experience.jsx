import { useFrame } from "@react-three/fiber";
import {
  Stage,
  Lightformer,
  Environment,
  ContactShadows,
  RandomizedLight,
  AccumulativeShadows,
  SoftShadows,
  BakeShadows,
  useHelper,
  OrbitControls,
  Sky,
} from "@react-three/drei";
import { useRef } from "react";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import { useControls } from 'leva';

export default function Experience() {
  const directionalLight = useRef();
  useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

  const { color, opacity, blur } = useControls('contact shadows', {
      color: '#4b2709',
      opacity: { value: 0.4, min: 0, max: 1 },
      blur: { value: 2.8, min: 0, max: 10 },
  })

  const { sunPosition } = useControls('sky', {
      sunPosition: { value: [ 1, 2, 3 ] }
  })

  const { 
    envMapIntensity, 
    envMapHeight, 
    envMapRadius, 
    envMapScale 
  } = useControls('environment map', {
      envMapIntensity: { value: 7, min: 0, max: 12 },
      envMapHeight: { value: 7, min: 0, max: 100 },
      envMapRadius: { value: 28, min: 10, max: 1000 },
      envMapScale: { value: 100, min: 10, max: 1000 }
  });

  const cube = useRef();

  useFrame((state, delta) => {
    // const time = state.clock.elapsedTime;
    // cube.current.position.x = 2 + Math.sin(time);
    cube.current.rotation.y += delta * 0.2;
  });

  return (
    <>
      {/* <color args={["ivory"]} attach="background" /> */}

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      {/* <BakeShadows /> */}
      {/* <SoftShadows size={ 25 } samples={ 10 } focus={ 0 } /> */}

       {/* <Environment
            // background
            // files={ [
            //     './environmentMaps/2/px.jpg',
            //     './environmentMaps/2/nx.jpg',
            //     './environmentMaps/2/py.jpg',
            //     './environmentMaps/2/ny.jpg',
            //     './environmentMaps/2/pz.jpg',
            //     './environmentMaps/2/nz.jpg',
            // ] }
            // files="./environmentMaps/the_sky_is_on_fire_2k.hdr"
            preset="sunset"
            // resolution={ 32 }
            ground={ {
                height: envMapHeight,
                radius: envMapRadius,
                scale: envMapScale
            } }
        > */}
          

          {/* set background color of scene */}
          {/* <color args={['black']} attach="background"/> */}
        
          {/* <mesh position-z={ - 5 } scale={ 10 }>
            <planeGeometry />
            <meshBasicMaterial color={[100,0,0]} />
          </mesh> */}

          {/* Lightformer */}
          {/* <Lightformer 
            position-z={-5} 
            scale={10}
            color="cyan"
            intensity={10}
            form="ring"
          /> */}
        {/* </Environment>  */}

       

      {/* 
          //AccumulativeShadows
          <AccumulativeShadows  position={ [ 0, - 0.99, 0 ]} scale={10}
            color="#316d39"
            opacity={ 0.8 }
            // frames={ 100 }
            frames={ Infinity }
            temporal
            blend={ 100 }
        >
            <RandomizedLight
                position={ [ 1, 2, 3 ] }
                amount={ 8 }
                radius={ 1 }
                ambient={ 0.5 }
                intensity={ 3 }
                bias={ 0.001 }
            />
            
        </AccumulativeShadows> */}

      {/* <Sky sunPosition={ sunPosition } /> */}

      {/* 
      //replaced...
      <directionalLight ref={ directionalLight } position={ [ 1, 2, 3 ] } intensity={ 4.5 } /> */}

      {/* <directionalLight
        ref={directionalLight}
        // position={[1, 2, 3]}
        position={ sunPosition }
        intensity={4.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      /> */}

      {/* <ambientLight intensity={1.5} /> */}

      {/* Shere */}
      {/* <mesh
        position-x={-2}
        castShadow
        position-y={ 1 }
      >
        <sphereGeometry />
        <meshStandardMaterial
          color="orange"
          envMapIntensity={ envMapIntensity }
        />
      </mesh> */}

      {/* Cube */}
      {/* <mesh
        castShadow
        position-y={ 1 }
        ref={cube}
        position-x={2}
        scale={1.5}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="mediumpurple"
          envMapIntensity={ envMapIntensity }
        />
      </mesh> */}

      {/* Floor */}
      {/* <mesh
        // receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial
          color="greenyellow"
          envMapIntensity={ envMapIntensity }
        />
      </mesh> */}

      {/* <ContactShadows
        position={[0, 0, 0]}
        scale={10}
        resolution={512}
        far={5}
        color={color}
        opacity={opacity}
        blur={blur}
        frames={1}
      /> */}

       <Stage
            shadows={ { type: 'contact', opacity: 0.2, blur: 3 } }
            environment="sunset"
            preset="portrait"
            intensity={ 6 }
        >
            <mesh position-y={ 1 } position-x={ - 2 }>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh ref={ cube } position-y={ 1 } position-x={ 2 } scale={ 1.5 }>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>
        </Stage> 
    </>
  );
}
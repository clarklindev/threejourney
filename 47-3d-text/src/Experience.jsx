import {
  useMatcapTexture,
  Center,
  Text3D,
  OrbitControls,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useEffect, useRef, useState } from 'react'
// import { useFrame } from '@react-three/fiber'
// import * as THREE from 'three'

// const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32)
// const material = new THREE.MeshMatcapMaterial()

export default function Experience() {
  // const donuts = useRef([])

  const [ matcapTexture ] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256);

  // useFrame((state, delta) =>
  // {
  //     for(const donut of donuts.current)
  //     {
  //         donut.rotation.y += delta * 0.2
  //     }
  // })

  // useEffect(() =>
  // {
  //     matcapTexture.colorSpace = THREE.SRGBColorSpace
  //     matcapTexture.needsUpdate = true

  //     material.matcap = matcapTexture
  //     material.needsUpdate = true
  // }, [])

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      {/* <mesh scale={1.5}>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh> */}


      {/* <Text3D font="./fonts/helvetiker_regular.typeface.json">
        Hello world!
        <meshNormalMaterial />
      </Text3D> */}

      <Center>
        <Text3D
          font="./fonts/helvetiker_regular.typeface.json"
          size={ 0.75 }
          height={ 0.2 }
          curveSegments={ 12 }
          bevelEnabled
          bevelThickness={ 0.02 }
          bevelSize={ 0.02 }
          bevelOffset={ 0 }
          bevelSegments={ 5 }
        >
          <meshMatcapMaterial matcap={ matcapTexture }/>
          {/* <meshNormalMaterial/> */}
          HELLO R3F
        </Text3D>
      </Center>

      {/* Donut (single) */}
      {/* <mesh>
        <torusGeometry/>
        <meshMatcapMaterial matcap={matcapTexture}/>
      </mesh> */}

      { [...Array(100)].map((value, index) =>
            <mesh
                // ref={ (element) => donuts.current[index] = element }
                key={ index }
                // geometry={ torusGeometry }
                // material={ material }
                
                position={ [
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10
                ] }
                scale={ 0.2 + Math.random() * 0.2 }
                rotation={ [
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    0
                ] }
            >
              <torusGeometry args={[1, 0.6, 16, 32]}/>
              <meshMatcapMaterial matcap={matcapTexture}/>
            </mesh>
        ) }
    </>
  );
}
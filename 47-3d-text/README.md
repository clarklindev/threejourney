# 47 - 3D text

- Text3D from drei
- need typeface font (/public/fonts/helvetiker_regular.typeface.json)
- to use custom font (gero3.github.io/facetype.js)
- add `<Text3D>` with "font" attribute
- MeshBasicMaterial is applied, can change the material
- Text3D: all paramters that we can use to create the TextGeometry can be set as attributes

#### Centering
- instead of offsetting the geometry itself, use `<Center>` from drei

#### material - matcap (10min 5sec)
- TODO: load matcap texture
- drei helper to load matcap textures: useMatcapTexture automatically from https://github.com/emmelleppi/matcaps
- import useMatcapTexture from drei
- to use a matcap, you go to the https://github.com/nidorx/matcaps/tree/master website and get the ID which will be a prop of useMatcapTexture('ID', 256)
- 2nd parameter is the desired width: 64, 128, 256, 512, 1024
- text3d triggers a re-render
- useMatcapTexture returns an array and we need the fist value (the texture)
- replace `<meshNormalMaterial>` with a `<meshMatcapMaterial>` and use the matcapTexture on the mapcap attribute

#### donuts (18min) (Native Three.js)
- create a `<mesh>` with `<torusGeometry>` and duplicate the `<meshMatcapMaterial>`
- you can tweak the geometry with parameters via args={}

#### multiple donuts (20min 14sec) (Native Three.js)
- create array with default "undefined" `[...Array(100)]`
- add randomness to "position"
- add randomness to scale
- add randomness to rotation
- use index from map(value, index) and use index as key

#### OPTIMIZATION - move the geometries outside (29min 53sec)
  - currently creating multiple geometries (but should only have 2: donut and text)
  - create one `<torusGeometry>` outside of the donut
  - store it in useState: `import { useEffect, useRef, useState } from 'react'`
  - put it back on mesh from state
- send the setTorusGeometry function to the ref={} of the torusGeometry
- when sending a function to the ref, React will call that function with the component as the parameter.
- state torusGeometry now contains `<torusGeometry>`
- can send to `<mesh geometry={}>` with geometry attribute
```js

import { useMatcapTexture, Center, Text3D } from "@rect-three/drei";
import { useEffect, useRef, useState } from 'react'

export default function Experience() {

  const [matcapTexture] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256);
  const [torusGeometry, setTorusGeometry] = useState();

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <torusGeometry ref={setTorusGeometry} args={[1, 0.6, 16, 32]}/>

      //{/* donut */}
      // <mesh>
      //   <torusGeometry args={[1, 0.6, 16, 32]}/>
      //   <meshMatcapMaterial matcap={matcapTexture}/>
      // </mesh>

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
          // material={ material }
        >
          <meshMatcapMaterial matcap={ matcapTexture }/>
          {/* <meshNormalMaterial/> */}
          HELLO R3F
        </Text3D>
      </Center>

      { [...Array(100)].map((value, index) =>
         <mesh
            // ref={ (element) => donuts.current[index] = element }
            key={ index }
            geometry={ torusGeometry }
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
            <meshMatcapMaterial matcap={matcapTexture}/>
          </mesh>
      ) }
    </>
  );
}
```

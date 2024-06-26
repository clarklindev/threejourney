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

#### optimize material (35min 30sec)

- in the shaders of r3f-perf: "performance monitoring", theres only one shader (threejs reuses shaders)

##### Method 1
- TODO: separate material so its shared for geometries (text and donut)
- move `<meshMatcapMaterial>` out of the donuts `<mesh>` and remove it from the `<Text3D>` too
- create material and setMaterial state: `const [material, setMaterial] = useState();`
- send setMaterial to the ref={setMaterial} of meshMatcapMaterial 
- send material state to material attribute of `Text3D` and donut `mesh`


```js

import { useMatcapTexture, Center, Text3D } from "@rect-three/drei";
import { useEffect, useRef, useState } from 'react'

export default function Experience() {

  const [matcapTexture] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256);
  const [torusGeometry, setTorusGeometry] = useState();
  const [material, setMaterial] = useState();

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <torusGeometry ref={setTorusGeometry} args={[1, 0.6, 16, 32]}/>
      <meshMatcapMaterial ref={setMaterial} matcap={matcapTexture}/>

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
          material={ material }
        >
          HELLO R3F
        </Text3D>
      </Center>

      { [...Array(100)].map((value, index) =>
         <mesh
            // ref={ (element) => donuts.current[index] = element }
            key={ index }
            geometry={ torusGeometry }
            material={ material }
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
          />
      ) }
    </>
  );
}
```


##### Method 2 (PREFERRED) (38min 40sec)
- create the geometry before the experience using Three.js
- ie. without useState
- remove `<torusGeometry>`
- remove `<meshMatcapMaterial>`
- instantiate a TorusGeometry in a torusGeometry variable: const torusGeometry = new THREE.TorusGeometry()
- instantiate a MeshMatcapMaterial in a material variable
- problem is meshMatcapMaterial cant set the texture as its happening only in Experience()
- fix: use useEffect in Experience
- in useEffect: material.matcap = matcapTexture
- tell material it needs to be updated using the needsUpdate property
- fix color using encoding: 
  - set encoding of matcapTexture to "THREE.sRGBEncoding"
  - set needsUpdate to "true"

```js

import { useMatcapTexture, Center, Text3D } from "@rect-three/drei";
import * as THREE from 'three';
import {useEffect} from 'react';

const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32);
const material = new THREE.MeshMatcapMaterial()

export default function Experience() {

  const [matcapTexture] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256);

  useEffect(()=>{
    matcapTexture.encoding = THREE.sRGBEncoding;
    matcapTexture.needsUpdate = true;

    material.matcap = matcapTexture;
    material.needsUpdate = true;

  },[]);

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />
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
          material={ material }
        >
          HELLO R3F
        </Text3D>
      </Center>

      { [...Array(100)].map((value, index) =>
         <mesh
            // ref={ (element) => donuts.current[index] = element }
            key={ index }
            geometry={ torusGeometry }
            material={ material }
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
          />
      ) }
    </>
  );
}
```

### Animating the donut


#### METHOD 1
- making donuts rotate -> need to access the donuts
- ie. need to create refs
- but if you do it in the map() it will ref the last one,
- add a `<group>` around meshes, gives access to donuts via group's children
- useRef() and create a reference to donutsGroup.
- associate it with group using ref={donutsGroup}.
- now have access to donuts via children of the donutsGroup ref.
- NOTE: every class that inherits from Object3D has a children property.
- import {useFrame} from '@react-three/fiber'
- call it in Experience and send a function
- retrieve the state and delta
- loop through the children of the donutsGroup.current with a for of and update their rotation,y property with delta.

```js
//experience.js

export default function Experience(){
  useFrame((state, delta)=>{
    for(const donut of donutGroup.current.children){
      donut.rotation.y += delta * 0.2;
    }
  });
}
```

#### Method 2
- problem with method 1 is we changing the code due to structure flaw in design : requiring access to the children.
- TODO: use an array instead to track the donuts: 
  - array .current initially an empty array
  - add donuts to array
- remove donutsGroup ref, `<group>`, and the loop inside useFrame.
- create donuts reference and assign [] as default value
- REMEMBER: sending a value to useRef will set that value as the default current property of the reference
- to donut mesh, add a ref attribute but pass it a function - react will call this function and pass the actual element as parameter
- we can then save it in the donuts.current property of donuts using push()
- problem is: everytime component re-renders array will grow
- FIX: add elements to array at specific index of map
- use useFrame() and loop again to update rotations but on donuts.current

```js
export default function Experience() {
  
  const donuts = useRef([]);

  useFrame((state, delta)=>{
    for(const donut of donuts.current){
      donut.rotation.y += delta * 0.2;
    }
  });

  return (
    { [...Array(100)].map((value, index) =>
    
      <mesh ref={ (element) => 
        // donuts.current.push(element)    //problem is: everytime component re-renders array will grow
        donuts.current[index] = element 
      }
      />
    )}
  )
}
```
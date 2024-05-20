# React Three Fiber - Portal

- modeling, baking, exporting stays same.
- src/shaders/portal
- model: public/model/portal.glb
- texture: public/model/baked.jpg

#### Background

- changing background color in react-three-fiber
- attach tells it to attach it to parent property "background"
- needs args={[]} always is an array
- attach to parent (scene) "background" with "attach" attribute

```js
<color args={["black"]} attach="background" />
```

### loading model with useGLTF

- import useGLTF
- remember public/ contents are as if its served from url
- model is composed of multiple parts:
  - bakedTexture (MeshBasicMaterial)
  - 2x poleLights (MeshBasicMaterial)
  - portal (ShaderMaterial)
- parts of model available via "nodes" correspond to Blender names

### baked model

- baked model is named "baked" accessed via nodes.baked
- create a `<mesh>` and set its geometry to nodes.baked.geometry

### adding our own material by loading the texture
- use useTexture helper from drei
-  in the `<mesh>`, create the `<meshBasicMaterial>` and use the texture on the "map" attribute
- texture y coordinates need to be flipped (.flipY = false) //defaults to true
- can also flipY on the meshBasicMaterial (but targeting map inside material and its property inside map of material )

### centering things in scene
- use `<Center></Center>` from drei

### Pole lights
- add a new `<mesh>` with "geometry" attribute set to: nodes.poleLightA.geometry
- use position directly from: nodes.poleLightA.position
- default material color of mesh is white
- add our own: `<meshBasicMaterial color="#FFFFe5"/>`

### Portal
- create a mesh with geometry={nodes.portalLight.geometry} 
- also do same for position, rotation, scale

### fixing color
- the color is already baked into (blender) the texture to look good.
- react-three-fiber then adds its own color management (toneMapping).
- fix: index.js -> `<Canvas flat>`
- sending flat on canvas will set toneMapping to THREE.NoToneMapping

### Fireflies
- threejs native - fireflies were created with a custom shader
- drei -> Sparkles
- set attributes: 
    - size={6}, 
    - scale={[x, y, z]} - this is a box area where fireflies can move
    - position-y={1}
    - speed
    - count
  
### Portal (25min 40sec)
- on mesh children, replace `<meshBasicMaterial>` with `<shaderMaterial>` (three.js)
- importing shaders using normal import syntax gives an url, 
- to get raw content - change .glsl to .js file format
- change the file content to export a default string literal 
- install vscode plugin: "es6-string-html" then add after "export default" `/* glsl */`

### implementing the shaders (34min 32sec)
- default shader is "shaderMaterial" 
- we can use our shaders on the `<shaderMaterial>` with the "vertexShader" attribute and "fragmentShader" attribute
- the shader needs us to provide 3 uniforms in fragment shader:
    1. uTime (number)
    2. uColorStart (Threejs color instance)
    3. uColorEnd (Threejs color instance)
- import * as THREE from 'three';
- provide "uniforms" attribute to shaderMaterial

### DREI shaderMaterial() helper (38min)
- drei has helper "shaderMaterial" that creates a ShaderMaterial (jsx)
- import {shaderMaterial} from drei 
- outside of the Experience() function, assign the result in a PortalMaterial variable
- NOTE: we need to provide 3 parameters to shaderMaterial(), 
  1. uniforms - but we dont need the value property
  2. uColorStart - 
  3. uColorEnd - 
- this creates a class we can instantiate, but to use it as a JSX element tag, use "extend" 
- import extend from react-three/fiber
- send extend() an object, with property AND value "PortalMaterial", 
- this now allows us to use it in tag format `<portalMaterial>` NOTE: camelCase!!!

### Animating
- animating portal, need a reference to the material
- import useRef
- create a portalMaterial ref
- associate it with the shaderMaterial using ref attribute
- import useFrame from react-three/fiber
- call useFrame() in the Experience, provide a function that gives us access to delta

```js
import { Center, useGLTF , useTexture, Sparkles, shaderMaterial} from "@react-three/drei";
import portalVertexShader from './shaders/portal/vertex.js';
import portalFragmentShader from './shaders/portal/fragment.js';
import {useFrame, extend} from '@react-three/fiber';
import {useRef} from 'react';

const PortalMaterial = shaderMaterial(
  {
    uTime: 0, 
    uColorStart: new THREE.Color('#FFFFFF'),
    uColorEnd: new THREE.Color('#000000')
  },
  portalVertexShader,
  portalFragmentShader
);

extend({PortalMaterial}); //{PortalMaterial: PortalMaterial}

export default function Experience() {
  const { nodes } = useGLTF("./model/portal.glb");
  const bakedTexture = useTexture('./model/baked.jpg');
  bakedTexture.flipY = false;

  const portalMaterial = useRef();

  useFrame((state, delta) =>
  {
      portalMaterial.current.uTime += delta
  });

  
  return (
    <>
      <color args={["black"]} attach="background" />

      <Center>

        //baked model
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial map={bakedTexture} 
          // map-flipY={false}    //same as directly on texture bakedTexture.flipY = false;
          />
        </mesh>

        // pole lights
        <mesh geometry={ nodes.poleLightA.geometry } position={ nodes.poleLightA.position }>
          <meshBasicMaterial color="#ffffe5" />
        </mesh>
        <mesh geometry={ nodes.poleLightB.geometry } position={ nodes.poleLightB.position }>
          <meshBasicMaterial color="#ffffe5" />
        </mesh>

        //portal
        <mesh 
          geometry={ nodes.portalLi ght.geometry } 
          position={ nodes.portalLight.position } 
          rotation={ nodes.portalLight.rotation }
        >
        {/*
          // <shaderMaterial
          //   vertexShader={portalVertexShader}
          //   fragmentShader={portalFragmentShader}

          //   //native THREEjs method: requires {value:}
          //   uniforms={{
          //     uTime: {value: 0},
          //     uColorStart: {value: new THREE.Color('#000000')},
          //     uColorEnd: {value: new THREE.Color('#FFFFFF')}
          //   }}
          //  />

        */}

          <portalMaterial ref={portalMaterial}/>

        </mesh>

        //fireflies
        <Sparkles
          size={ 6 }
          scale={ [ 4, 2, 4 ] }
          position-y={ 1 }
          speed={ 0.2 }
          count={ 40 }
        />

      </Center>
    </>
  );
}
```

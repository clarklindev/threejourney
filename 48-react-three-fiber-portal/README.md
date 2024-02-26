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
  

```js
import { Center, useGLTF , useTexture, Sparkles} from "@react-three/drei";

export default function Experience() {
  const { nodes } = useGLTF("./model/portal.glb");
  const bakedTexture = useTexture('./model/baked.jpg');
  bakedTexture.flipY = false;
  
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
          geometry={ nodes.portalLight.geometry } 
          position={ nodes.portalLight.position } 
          rotation={ nodes.portalLight.rotation }
        >
          <portalMaterial ref={ portalMaterial } />
        </mesh>


      </Center>
    </>
  );
}
```

# comparing REACT THREE FIBRE vs NATIVE THREE.js

### Native

```js
const mesh = new THREE.Mesh();
mesh.position.set(1, 2, 3);
mesh.rotation.x = 0.5;
mesh.geometry = new THREE.BoxGeometry(1, 1, 1);
mesh.material = new THREE.MeshBasicMaterial({ color: "red" });

scene.add(mesh);
```

### R3F (React Three Fibre)

- DONT HAVE TO create "Scene"
- DONT HAVE TO create "WebGLRenderer"
- scene is rendererd on eaceh frame
- deafult settings (anti-alias, encoding)
- dont have to place perspective camera
- camera is not at center of scene (at start)
- resize is automatically handled
- dont have to import geometry
- Hot module reloading

- R3F hooks only work in components created inside the Canvas
- R3F specify properties of Three.js objects in args={} attribute

```js
<mesh position={[1,2,3]} rotation-x={0.5}>
  <boxGeometry>
  <meshBasicMaterial color="red">
</mesh>
```

- how does R3F assign to mesh? using 'attach' prop
- eg. `attach="material"` adds material property to the parent element
- so below: "mesh" would get property "geometry" with value `<boxGeometry>`
- so below: "mesh" would get property "material" with value `<meshBasicMaterial>`
- BUT...THIS is all automatic due to following naming of attributes, "boxGeometry" will be attached as "geometry" (look how naming ends)
- BUT...THIS is all automatic due to following naming of attributes, "meshBasicMaterial" will be attached as "material" (look how naming ends)

```js
<group>
  <mesh>
    <boxGeometry attach="geometry">
    <meshBasicMaterial attach="material" color="red">
  </mesh>
</group>
```

### supported classes

- R3F supports all Three.js classes as component syntax

### Canvas

- R3F canvas will take the size of its parent (here #root)

```css
html,
body,
#root {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: LightSkyBlue;
}
```

```js
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.js";

//...

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <Canvas>
    <Experience />
  </Canvas>
);
```

```js
//experience
export default function Experience(){

  return <>
    // <mesh>
    //   <torusKnotGeometry>
    //   <meshNormalMaterial>
    // </mesh>

    <mesh scale={[3,2,1]} position={[2,0,0]} rotation-y={Math.PI * 0.25}>
      // <sphereGeometry args={[1.5,32,32]}>
      // <meshBasicMaterial args={[{color: 'red', wireFrame:true}]}/>

      <boxGeometry>
      <meshBasicMaterial color='red' wireframe />
    </mesh>
    </>
}

```

### animating - useFrame()

- useFrame is called on each render
- give your geometry refs to reference them in useFrame()
- useFrame gives: delta

```js
import { useThree, extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";

const cubeRef = useRef();

useFrame((state, delta) => {
  // const angle = state.clock.elapsedTime
  // state.camera.position.x = Math.sin(angle) * 8
  // state.camera.position.z = Math.cos(angle) * 8
  // state.camera.lookAt(0, 0, 0)

  cubeRef.current.rotation.y += delta;
  // groupRef.current.rotation.y += delta
});

return (
  <>
    <mesh ref={cubeRef}>
      <boxGeometry />
    </mesh>
  </>
);
```

### Orbit controls

- import OrbitControls
- import extend from '@react-three/fiber';
- extend will auto convert a Three.js class into a declarative version and make it available in JSX giving us `<orbitControls/>`
- orbit controls expects props
- useThree - provided same state as useFrame() but only run once at begining
- destructure... from useThree() return object

```js

import { useThree, extend, useFrame } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

extend({OrbitControls: OrbitControls});   //this gives us <orbitControls/>

const {camera, gl} = useThree();

return (<>

  <orbitControls args={[camera, gl.domElement]}>

</>);
```

### directional lights

- REMEMBER: meshBasicMaterial is basic geometry without (shadows, shading, lights) doesnt react to light
- REMEMBER: meshStandardMaterial does react to light
- replace all meshBasicMaterial to meshStandardMaterial

```js
<directionalLight position={[1, 2, 3]} />
```

### ambient light

```js
<ambientLight intensity={0.5} />
```

### custom geometries

#### native three.js method

- create a Float32Array
- put values in it
- create a BufferAttribute out of Float32Array
- add it to attributes of BufferGeometry

#### Positions array

- in CustomObject create a verticesCount variable
- 10 triangles, need 3 points per triangle
- create the Float32Array that will contain all vertices positions and specify size of the array
- 30 positions, but need 3 values per vertex(x,y,z) so position need to multiply number of vertices by 3
- fill array with random values

#### buffer geometry and bufferAttribute

- replace `<boxGeometry>` by `<bufferGeometry>`
- add `<bufferAttribute>` inside the `<bufferGeometry>`
- we need a way to specify that this attribute is the position attribute -> use the "attach" attribute
- `attach="attributes-position"` will result in the BufferAttribute attaching itself to the geometry.attribute.position

- we need 3 more attributes:
  - count (how many vertices),
  - itemSize (how many items from array compose one vertex),
  - array (actual array)

#### Double sided

- import \* as THREE from "three";
- `<meshStandardMaterial color="red" side={THREE.DoubleSide} />`

```js
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

export default function CustomObject() {
  const geometryRef = useRef();

  const verticesCount = 10 * 3;

  const positions = useMemo(() => {
    const positions = new Float32Array(verticesCount * 3);

    for (let i = 0; i < verticesCount * 3; i++)
      positions[i] = (Math.random() - 0.5) * 3; //-0.5 to 0.5 -> x3 to make it bigger

    return positions;
  });

  useEffect(() => {
    geometryRef.current.computeVertexNormals();
  }, []);

  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={verticesCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <meshStandardMaterial color="red" side={THREE.DoubleSide} />
    </mesh>
  );
}
```

### optimize vertices with useMemo()

- code inside CustomObject will be called every time the component needs to be drawn
- useMemo is a React hook which we send a function, it will call that function and remember the value,
  if the component is being redrawn, useMemo will return the value it already got from the first function call (like a cache)
- test with `<meshStandardMaterial>` instead of `<meshBasicMaterial>`
- we didnt provide any normal to the geometry and the triangles dont know where they are oriented
- instead of calc and sending our own normal attribute, ask THREE.js to do it with "computeVertexNormals" on BufferGeometry
- dont call `computeVertexNormals()` on the geometryRef.current, use a useEffect() //only call once

```js
import { useMemo } from "react";

useEffect(() => {
  geometryRef.current.computeVertexNormals();
}, []);

//CustomObject
const verticesCount = 10 * 3;

const positions = useMemo(() => {
  const positions = new Float32Array(verticesCount * 3);

  //fill array with random values
  for (let i = 0; i < verticesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 3;
  }

  return positions;
}, []);

return (
  <mesh>
    <bufferGeometry ref={geometryRef}>
      <bufferAttribute
        attach="attributes-position"
        count={verticesCount}
        itemSize={3}
        array={positions}
      />
    </bufferGeometry>
    <meshStandardMaterial color="red" side={THREE.DoubleSide} />
  </mesh>
);
```

### Camera
- you can change to an OrthographicCamera, by just adding "orthographic"
- but its starts far...play with: "zoom"

```js
//index.js
const cameraSettings = {
  fov: 45,
  zoom: 100,
  near: 0.1,
  far: 200,
  position: [3, 2, 6],
};

root.render(
  <Canvas
    orthographic
    gl={{
      antialias: true,
      toneMapping: THREE.ACESFilmicToneMapping,
      outputEncoding: THREE.sRGBEncoding,
    }}
    camera={cameraSettings}
  >
    <Experience />
  </Canvas>
);
```
### Animating the camera
- if you want to animate scene, remove `<orbitControls>`
- if you want to rotate around scene, use z and x axis with sin() and cos()
- first parameter of the function we send to useFrame is "state"
- do animation in useFrame() which gives access to state.. gives "camera"
- move camera on circular trajectory: we need an angle, then use that angle on a sin() and cos() to get x and z coordinates
- to get that angle, use elapsedTime
- R3F implements state.clock containing elapsedTime
- can also use state.close.getElapsedTime
- can change the camera.position.x and camera.position.y with sin() and cos() using the same angle
- multiply by value to change radius of rotation
- every object has a lookAt() .. camera is an object so it also has lookAt()
- state.camera.lookAt(0, 0, 0)

```js
  useFrame((state, delta) => {
    const angle = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(angle) * 8
    state.camera.position.z = Math.cos(angle) * 8
    state.camera.lookAt(0, 0, 0); //look at center

    cubeRef.current.rotation.y += delta;
    // groupRef.current.rotation.y += delta
  });
```
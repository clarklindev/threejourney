# Environment and staging with R3F

- changing background color methods:

1. CSS

- default background seems to be white, but thats actually transparent and ur seeing the html background

```css
//src/style/css

html,
body,
#root {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: red;
}
```

2. setClearColor on renderer (3min 20sec)

The WebGLRenderer has a method named setClearColor. It’s a way of filling the <canvas> with a color before rendering the various objects in the scene.

To use setClearColor, we need to have access to the renderer and we need to do that only once when the renderer has been created.

In index.jsx create a created function and send it to the <Canvas> attribute named onCreated:

- this takes precedence over setting background on css.

```js
const created = () => {
  console.log("created");
};

root.render(
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [-4, 3, 6],
    }}
    onCreated={created}
  >
    <Experience />
  </Canvas>
);
```

#### access to renderer via "gl"

The state will be sent as an argument of the function and the "renderer will be available in the gl property":

- We can then call the setClearColor with the color as the first parameter and the alpha as the second parameter:

```js
// const created = (state) =>
// {
//     console.log(state.gl)
// }

//destructured
const created = ({ gl }) => {
  console.log(gl);
  gl.setClearColor("#ff0000", 1);
};
```

3. using scene background

- instead of setting the background on the renderer, set it on the scene
- then access it in the "created" function
- We can now instantiate a Color using Three.js and assign it to the background property (don’t forget to import THREE or just Color from three)

```js
import * as THREE from "three";
const created = ({ scene }) => {
  console.log(scene);
  scene.background = new THREE.Color("#ff0000");
};
```

4. using R3F color to set background (9min)

- using R3F to set the color
- create a <color> inside <Canvas>
- R3F will auto create a Color instance. ie: <color> substitutes new THREE.Color()
- need to assign color: We can add an attach attribute to specify what that component should be attached to.
- we can put the code anywhere as long as the direct parent is the scene (still the case if we put it in Experience)

```js
<Canvas
  camera={{
    fov: 45,
    near: 0.1,
    far: 50,
    position: [1, 2, 6],
  }}
>
  <color args={["#00FF00"]} attach="background" />
  <Experience />
</Canvas>
```

---

# Lights (13min 40sec)

```js
// r3f lights

<ambientLight />
<hemisphereLight />
<directionalLight />
<pointLight />
<rectAreaLight />
<spotLight />

```

### Light Helpers (14min 21sec)

- We can still use Three.js light helpers too.
- To do so, we are going to use useHelper from drei, but first, we need a reference to the <directionalLight>.
- useRef is already import from react to animate the cube.
- Associate it with the <directionalLight> using the ref attribute:
- Import useHelper from @react-three/drei:
- useHelper -
  - 1st param is the reference to the light source
  - 2nd is the helper class we want to use from Three.js
- import THREE, to get access to the DirectionalLightHelper
- can call useHelper() - useHelper(directionalLight, THREE.DirectionalLightHelper, 1); //1 is the size of helper
- useHelper() can be used for Camera too with CameraHelper

```js
import { useHelper, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export default function Experience() {
  const directionalLight = useRef();
  useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

  // ...

  return (
    //...
    <directionalLight
      ref={directionalLight}
      position={[1, 2, 3]}
      intensity={4.5}
    />
  );
}
```

### Shadows (18:28)

- We are going to start with the default Three.js shadows system, but
- then we are going to see other shadow solutions made easier thanks to R3F and drei.
- default shadows

#### default shadows - activation

To activate shadow rendering on the WebGLRenderer, all we need to do is add a "shadows" attribute to the <Canvas> in index.jsx:

```js
root.render(
  <Canvas
    shadows={true}
    camera={{
      fov: 45,
      near: 0.1,
      far: 50,
      position: [-4, 3, 6],
    }}
  >
    <Experience />
  </Canvas>
);
```

- in experience.js add castSahdow to the <directionalLight>

```js
<directionalLight
  ref={directionalLight}
  position={[1, 2, 3]}
  // position={ sunPosition }
  intensity={4.5}
  castShadow
/>
```

- add castShadow on the objects - on the sphere <mesh> and cube <mesh>
- those objects only need cast shadow since there is nothing above.
- on the floor, ask <mesh> to receiveShadow
- the floor only needs to receive shadow as there is nothing below

```js
// Experience.js

// Sphere
<mesh position-x={-2}
  castShadow
  // position-y={ 1 }
>
  <sphereGeometry />
  <meshStandardMaterial
    color="orange"
    //envMapIntensity={ envMapIntensity }
  />
</mesh>

// Cube
<mesh
  castShadow
  // position-y={ 1 }
  ref={cube}
  position-x={2}
  scale={1.5}>
  <boxGeometry />
  <meshStandardMaterial
  color="mediumpurple"
  // envMapIntensity={ envMapIntensity }
  />
</mesh>

<mesh
  receiveShadow
  position-y={ -1 }
  rotation-x={-Math.PI * 0.5}
  scale={10}
>
  <planeGeometry />
  <meshStandardMaterial
    color="greenyellow"
    envMapIntensity={ envMapIntensity }
  />
</mesh>
```

---

### Baking - BakeShadows helper

- real time shadow baking for static scenes
  - done once at begining then stop (ie. not on each frame)
- BakeShadows helper from drei

```js
export default function Experience() {
  // ...

  return (
    <>
      <BakeShadows />
      {/* ... */}
    </>
  );
}
```

#### Configuring the shadows (24min 20sec)

- each light casting shadows will render the scene in a specific way and output that we call “shadow map”. This shadow map is then used to know if a surface is in the shade or not.
- By default, that shadow map resolution is rather low in order to maintain solid performance.
- In pure JavaScript, we can access it by doing directionalLight.shadow.mapSize.set(1024, 1024), but how can we do that in R3F?
- most properties (even deep ones) are still accessible right from the attributes, by separating the different depth levels with dashes -
- to change the shadow.mapSize property, we can use the shadow-mapSize attribute
- And we can do the same with the near, far, top, right, bottom and left properties (since a OrthographicCamera is used to render the shadow map):
- note: "bottom" and "left" are negative values
- 'near' and 'far' anything outside the bounds cannot see.

### soft shadows

- NOTE: this is better quality shadow visually - better than default shadow
- default shadows are too sharp
- soften shadows with PCSS (Percent Closer Soft shadows)
- makes shadow look blurry by picking the shadow map texture at an offset position according to the distance between the surface casting the shadow and the surface receiving the shadow
- ie the further away an object is, the softer the shadow
- madeby: spidersharma03
- implementing this soltion implies modifying the shader chunks of Threejs directly (global)

#### Drei component method (PREFERRED - newer)

- drei has <SoftShadows>
- And add it right after the <BakeShadows /> with the following attributes:

```js
//drei component method
import {
  SoftShadows,
  BakeShadows,
  useHelper,
  OrbitControls,
} from "@react-three/drei";

<directionalLight
  ref={directionalLight}
  position={[1, 2, 3]}
  intensity={4.5}
  castShadow
  shadow-mapSize={[1024, 1024]}
  shadow-camera-near={1}
  shadow-camera-far={10}
  shadow-camera-top={2}
  shadow-camera-right={2}
  shadow-camera-bottom={-2}
  shadow-camera-left={-2}
/>;

return (
  <>
    <BakeShadows />
    <SoftShadows size={25} samples={10} focus={0} />
  </>
);
```

#### Drei CODE method

- softShadows() - call it once at begining and outside of any component.
- In Experience.jsx, import SoftShadows from @react-three/drei:
- remove <BakeShadows/> to see shadows moving
- Note that this helper will modify Three.js shaders directly and each change applied on its attributes will re-compile all the shaders supporting shadows. This will result in performance issues and a drastic frame rate drop.

```js
//Drei code method
import { softShadows, BakeShadows, useHelper, OrbitControls } from '@react-three/drei'

softShadows({
  frustum: 3.75,
  size: 0.005,
  near: 9.5,
  samples: 17,
  rings:11
})

export default function Experience(){


  return (<>
    <>)

}

```

---

### Accumulative shadows (41min 10sec)

- accumulate multiple shadow renders - ie move light get shadow, move light get shadow, etc then combine all shadows to get soft shadow
- shadow wil be composed of multiple renders from different angles
- can be rendered on the plane only.
- AccumulativeShadows is its own shadow, should deactivate the shadow on the floor mesh.
- remove receiveShadow from floor mesh
- remove softShadow()
- import AccumulativeShadows
- add it to the scene right after the `<directionalLight>` and dont auto-close it
- move it a little above the floor (fix z-fighting)
- default scale is 10 units which matches our scene perfectly, but if you need a smaller or bigger AccumulativeShadows, use the scale attribute
- AccumulativeShadow DOES NOT TAKE LIGHT FROM THE SCENE, have to provide the light separately
- Since the AccumulativeShadows will be a shadow on its own, we should deactivate the shadows on the `<mesh>` corresponding to the floor to prevent having two shadows.
- create a `<directionalLight>` in AccumulativeShadows,
- use the same position attribute as the current directionalLight
- add castShadow attribute

#### RandomizedLight (48min)

- import RandomizedLight
- replace by using RandomizedLight instead of the directional light - use same position attribute
- RadomizedLight has multiple attributes
  - amount - how many light
  - radius - amplitude of jiggle
  - intensity - light intensity
  - ambient - act like global light was illuminating whole scene, only tight spaces and crevices receiving shadows
- parameters related to shadow map:
  - castShadow: If it should cast shadows
  - bias: the bias offset to fix the issue where the objects are casting shadows on themselves or not casting shadow on objects very close to their surface
  - mapSize: the shadow map size (the lower, the better for performances)
  - size: the amplitude of the shadow (top, right, bottom and left all at once)
  - near and far: how close and how far the shadow map camera will render objects
  - use debug ui like Leva to tweak values
- have access to attributes on AccumulativeShadows:
  - color - color the shadow
  - opacity
  - frames - renders to do (higher = better quality)
  - temportal - spread the renders across multiple frames
- the shadow looks smooth but threejs had to do those 1000 renders on the first frame
- can prevent the freeze with "temporal" by spreading renders across frames
- fixing the weird artifacts (lines) drawn on shadows - from the helper: fix = remove helper
  `// useHelper(directionalLight, THREE.DirectionalLightHelper, 1);`
- reduce frames to 100 (take less than 2 seconds @60fps)
- shadow not moving with cube (because 100 renders are being done on first frame then stops)
- in the useFrame, retrieve the clock elapsedTime and assign it to ta time variable
- Now use it on the cube position with a Math.sin() and add 2 to it so that it stays near its current position:

#### make shadow follow geometry

- tell AccumulativeShadows to keep rendering the shaodws with the frames attribute set to "Infinity"
- this creates a stop motion feeling
- when using AccumulativeShadows - its only blending the last 20 shadow renders.
- FIX: set the blend attribute to 100
- AccumulativeShadows is good for static Scenes.

```js
import { RandomizedLight, AccumulativeShadows } from "@react-three/drei";

useFrame((state, delta) => {
  const time = state.clock.elapsedTime;
  cube.current.position.x = 2 + Math.sin(time);
});

<AccumulativeShadows
  position={[0, -0.99, 0]}
  scale={10}
  color="#316d39"
  opacity={0.8}
  frames={Infinity}
  temporal
  blend={100}
>
  <RandomizedLight
    position={[1, 2, 3]}
    amount={8}
    radius={1}
    ambient={0.5}
    intensity={3}
    bias={0.001}
  />
</AccumulativeShadows>;
```

---

### Contact Shadow (60min 08sec)

- reset the scene
- remove the animation for cube and put back light helper
- doesnt rely on Threejs shadows
- deactivate shadows on canvas `shadows={ false }`
- remove AccumulativeShadows

```js
<Canvas
  shadows={false}
  camera={{
    fov: 45,
    near: 0.1,
    far: 50,
    position: [-4, 3, 6],
  }}
>
  <Experience />
</Canvas>
```

- Contact shadows work without light and only on a plane
- Contact shadows will render the whole scene (like directional light) but with the camera taking place of the floor - so it will look from floor up and see where shadows are cast by the geometry in scene.
- blurs shadow map
- import ContactShadows
- move it right above the floor: position={[0, -0.99, 0]}
- change its scale
- improve the quality with 'resolution'
- 'far' - how far above should objects render shadows
- install leva
- import useControls
- create the color, opacity and blur tweaks in a "contact shadow" folder
- use them on ContactShadow
- good performance
- can Bake the shadow by setting the frames attribute on ContactShadow to 1 `frames={1}`

#### limitations

- shadow always comes from opposite of plane
- not physically accurate
- blurs shadow regardless of distances from object
- pulls a lot on performance

```js
import { useControls } from "leva";

import { ContactShadows } from "@react-three/drei";

const { color, opacity, blur } = useControls("contact shadows", {
  color: "#1d8f75",
  opacity: { value: 0.4, min: 0, max: 1 },
  blur: { value: 2.8, min: 0, max: 10 },
});

//...

<ContactShadows
  position={[0, -0.99, 0]}
  scale={10}
  resolution={512}
  far={5}
  color={color}
  opacity={opacity}
  blur={blur}
  frames={1}
/>;
```

```
npm i leva@0.9
```

---

### Sky (80min 35sec)

- R3F drei - Sky helper
- add `<Sky/>` to jsx
- class is physics based and tries to reproduce a realistic sky
- add sunPosition to Leva ( call useControls, set first param as 'sky', send an object with 'sunPosition' property set to have a vector 3 tweak)
- use it in the `<Sky>`

```js
import { Sky } from "@react-three/drei";

export default function Experience() {
  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });

  return (
    <>
      <Sky sunPosition={sunPosition} />
    </>
  );
}
```

- the above is not usual way to set Sun coordinates, use spherical Coordinates
- create a Spherical
- create a Vector3
- use its setFromSpherical() to convert from the spherical coordinate to a vector 3 (x, y, z) coordinates.
- Finally, to make the scene more realistic and logical, we can use the sunPosition for the `<directionalLight>`:

```js
<directionalLight
  ref={directionalLight}
  position={sunPosition}
  intensity={4.5}
  castShadow
  shadow-mapSize={[1024, 1024]}
  shadow-camera-near={1}
  shadow-camera-far={10}
  shadow-camera-top={5}
  shadow-camera-right={5}
  shadow-camera-bottom={-5}
  shadow-camera-left={-5}
/>
```

---

### Environment Map - drei using Environment (86min 27sec)

- using HDRI textures for environment map (instead of 6 images)
- its a 360deg image
- pixel data goes beyond traditional color range
- Drei has "Environment" helper
- use environment map to illuminate scene
- remove current lights and `<Sky>`
- remove directional light
- remove ambient light
- remove sky
- import Environment from drei
- add `<Environment>` to jsx and set its files attribute to contain an array of textures

#### Intensity
- the env map is the only thing creating light in scene after removing all lights
- use envMapIntensity (default 1)
- need to set this on each mesh
- add to leva 
- call useControls, "environment map", send object with envMapIntensity property that ranges 0 - 12
- use that value on every `<meshStandardMaterial>`

#### Background
- if you want to see the environment map in the background (instead of just for lighting), add a background attribute

```js
import { Environment } from "@react-three/drei";

export default function Experience() {
  // ...

    const { 
      envMapIntensity, 
      // envMapHeight, 
      // envMapRadius, 
      // envMapScale 
    } = useControls('environment map', {
        envMapIntensity: { value: 3.5, min: 0, max: 12 },
        // envMapHeight: { value: 7, min: 0, max: 100 },
        // envMapRadius: { value: 28, min: 10, max: 1000 },
        // envMapScale: { value: 100, min: 10, max: 1000 }
    });


  return (
    <>
      <Environment
        background
        files={[
          "./environmentMaps/2/px.jpg",
          "./environmentMaps/2/nx.jpg",
          "./environmentMaps/2/py.jpg",
          "./environmentMaps/2/ny.jpg",
          "./environmentMaps/2/pz.jpg",
          "./environmentMaps/2/nz.jpg",
        ]}
      />

      {/* ...
      
     
      */}
 
      <meshStandardMaterial
        color="orange"
        envMapIntensity={ envMapIntensity }
      />
    
    </>
  );
}
```

### HDRI texture
- instead of 6 images to form cube - use HDRI texture (single 360image)
- usually High Dynamic Range images (more accurate data)
- loading .hdr (load single file instead of set)
- you can use the presents for `<Environment>`  https://github.com/pmndrs/drei/blob/master/src/helpers/environment-assets.ts

```js
//presets https://github.com/pmndrs/drei/blob/master/src/helpers/environment-assets.ts
export const presetsObj = {
  apartment: 'lebombo_1k.hdr',
  city: 'potsdamer_platz_1k.hdr',
  dawn: 'kiara_1_dawn_1k.hdr',
  forest: 'forest_slope_1k.hdr',
  lobby: 'st_fagans_interior_1k.hdr',
  night: 'dikhololo_night_1k.hdr',
  park: 'rooitou_park_1k.hdr',
  studio: 'studio_small_03_1k.hdr',
  sunset: 'venice_sunset_1k.hdr',
  warehouse: 'empty_warehouse_01_1k.hdr',
}

```

```js
<Environment
  background
  files="./environmentMaps/the_sky_is_on_fire_2k.hdr"
  //preset="sunset"   //example using preset
/>
```

#### adding tweaks to environment map
- what if you want red light illuminating onto the scene thats using environment map for lighting?
- position a `<mesh>` inside the `<Environment>`
- first create the 'mesh' outside the 'environment' to make sure its well positioned.

```js
<Environment
  background
  preset="sunset"
/>

<mesh position-z={ - 5 } scale={ 10 }>
  <planeGeometry />
  <meshBasicMaterial color="red" />
</mesh>
```

- And then add it inside the `<Environment>`
- reload the page

```js
<Environment
  background
  preset="sunset"
>
  <mesh position-z={ - 5 } scale={ 10 }>
    <planeGeometry />
    <meshBasicMaterial color="red" />
  </mesh>
</Environment>

```
- if you remove the environment map, you have only the mesh illuminating the scene
- remove preset="sunset"
- by default the bg of environment map is black, can set a background color on the scene that is being rendered in `<Environment>`.
- add a `<color>` inside the `<Environment>` set its value to 'blue' and set its attach attribute to "background".
- using meshes to illuminate scene sounds like a limited solution since light shouldnt be limited to the color sprectrum.
- replace "red" of `<meshBasicMaterial>` by [1,0,0]
- BUT now you can go beyond 1, eg [2,0,0]
- CRAZY BRIGHT? try 100


```js

<Environment
  background
>
  <color args={['black']} attach="background"/> 

  <mesh position-z={ - 5 } scale={ 10 }>
    <planeGeometry />
    // <meshBasicMaterial color={[2,0,0]} />
    <meshBasicMaterial color={[100,0,0]} />
  </mesh>
</Environment>
```



#### LightFormer 
- there is a helper to create the light intensity effect: LightFormer instead of using meshes
- import {Lightformer} from "@react-three/drei";
- add it to the <Environment> with the same position and scale that we had on our `<mesh>`
- can use a literal color with the 'color' attribute and change the 'intensity'
- the default shape is rectangle, but the Lightformer supports other shapes: 'ring', 'circle', via 'form' attribute
- using it on a scene with reflection will add realism
- you can animate the lightformer
- you can change enviroment resolution 
- an environment map with a small resolution will look blury (fine if its used only for illumination)
```js
import {Lightformer} from "@react-three/drei";

<Environment
  background
  preset="sunset"
  resolution={32}
>
  <color args={['black']} attach="background"/> 
  
  <Lightformer 
    position-z={-5} 
    scale={10}
    color="cyan"
    intensity={10}
    form="ring"
  />

</Environment>
```

---
### Ground (110 min)

- comment out everything in `<Environment>`
- keep 'background' and 'preset'
- makes your enviromentmap appear as if the objects in the scene are directly on the floor (no more floating objects in environment)
- by adding a "ground" attribute, the projection of the environment map will make it look as if the floor underneath the object is near.
- remove "background"
- add "ground" attribute to `<Environment>`
- the ground is considered to be at the 0 elevation of the scene (meaning inside the ground)
- fix it by moving them up a little with their  position-y attribute
- background has some distortion - the settings of the groud are a bit confusing and best solution is to add controls to find the perfect values.
- add parameters to tweak the environment map via controls 

```js

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

return (
  <>
  <Environment ground={{height: envMapHeight, radius: envMapRadius, scale: envMapScale}}>
  </Environment>

  <mesh position-y={1}> 
    <sphereGeometry/>
    <meshStandardMaterial color="orange"/>
  </mesh>
  </>
);

```

### Stage
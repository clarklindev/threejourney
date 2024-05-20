# loading models

- using react 3 fibre to load models
- loading gltf
- react 3 fiber has useLoader()
- specify what loader useLoader will use - send to useLoader the threejs loader class we want to use for gltf loading (GLTFLoader)

### loading path:

- ./ works for most cases, as it looks for file in the same folder
- and since "public/" folder are made available like if they are at the root of the website, model will load.

### `<primitive>`

- use `<primitive>` with 'object' attribute with value set to: `model.scene`
- resize using scale attribute: scale={0.35}

```js
import {useLoader} from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Experience(){

    const model = useLoader(GLTFLoader, './hamburger.glb');

    return (
      <>
        <primitive object={model.scene} scale={0.35}/>
      <>
    )
}
```

### Draco loader (09min 59sec)
- to load draco compressed files, need to instantiate a DRACOLoader and add it to GLTFLoader with setDRACOLoader()
- pass a third argument to useLoader() and send it a function that gives access to the loader instance
- import DRACOLoader
- instantiate it in the function (the DRACO decoder folder is available in the /public/ folder) and associate it with the GLTFLoader instance using setDRACOLoader()

```js
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const model = useLoader(
  GLTFLoader, 
  './hamburger-draco.glb',
  (loader)=>{
    
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./draco/');
    loader.setDRACOLoader(dracoLoader);
  }  
);
```

### Lazy Loading with `<Suspense>` (14min 20sec)

#### network Throttling
- Dev tools -> network -> throttling
- add a custom profile for say 100mbit/s - 100,000
- NB: you need to keep your Developer Tools open if you want the network throttling to work.

#### Loading
- change loading path to flight helmet: `./FlightHelmet/glTF/FlightHelmet.gltf`
- change scale and position-y
- what we do want is lazy loading the model in the scene with `<Suspense>`

### separate model to different component
- <Suspense> is a React component that will wait for the process to be done (loading the model in our case) before rendering the component.
- TODO: put model in a separated component
- In Experience.jsx, import Model:
- add `<Model>` to the JSX near the primitive
- move the code related to the model from the Experience to the Model. 
- Move the useLoader, GLTFLoader and DRACOLoader imports
- move useLoader
- move `<primitive>`
- now our model and its loading are inside a component
- add `<Suspense>`: In Experience.jsx, import Suspense from react:
- wrap `<Model>` in `<Suspense>`

#### Suspense fallback
- suspense can set a fallback.
- the "fallback" is what the user will see if the component is not ready
- in the fallback put anything that will inform user status is loading
- create a component for the src/Placeholder.jsx
- pass props parameter and apply them to the `<mesh>`
- set attributes on `<Placeholder>` if needed

```js
//src/Model.jsx

import {useLoader} from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export default function Model()
{
  const model = useLoader(
    GLTFLoader, 
    './FlightHelmet/glTF/FlightHelmet.gltf',
    (loader)=>{
      
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('./draco/');
      loader.setDRACOLoader(dracoLoader);
    }  
  );

  // const model = useGLTF("./hamburger-draco.glb");

  return (
    <primitive object={model.scene} scale={5} position-y={-1}/>
  );
}
```

```js
//Experience.js
import Model from './Model.jsx';
import { Suspense } from 'react';
import Placeholder from './Placeholder.jsx';

<Suspense
  fallback={ 

    //moved to Placeholder...
    // <mesh position-y={ 0.5 } scale={ [ 2, 3, 2 ] }>
    //   <boxGeometry args={ [ 1, 1, 1, 2, 2, 2 ] } />
    //   <meshBasicMaterial wireframe color="red" />
    // </mesh> 
    <Placeholder position-y={0.5} scale={[2, 3, 2]} />
  }
>
  <Model/>
</Suspense>

```

```js
//src/Placeholder.jsx
export default function Placeholder()
{
  return <mesh { ...props } >
    {/* ... */}
  </mesh>
}
```
---
### GLTF loading with drei (38min 41sec) 

- loading with drei
- drei implements multiple loader helpers like useGLTF 
- import useGLTF
- replace useLoader() by useGLTF() with path to the file
- remove useLoader, GLTFLoader, DRACOLoader
- useGLTF does not require the draco/ folder (gets it from CDN)

```js

//remove
// import {useLoader} from '@react-three/fiber';
// import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { useGLTF } from "@react-three/drei";

const model = useGLTF('./hamburger.glb');

```

### Preloading (41min 56sec)
- instead of loading model ONLY once instance of model is created, 
- ie. if we only instantiate the model instance later, it will take time to load a model and we see a placeholder (if there is one)
- TODO: load model as soon as possible
- can use useGLTF.preload() to preload
- preload file should be the same link 

```js
//model js

export default function Hamburger({...props}){
  //...
}

useGLTF.preload("./hamburger-draco.glb");
```

### Multiple instances (46min)
- adding more instances...
- Clone helper
- import {Clone}  from drei
- instead of `<primitive>`, use `<Clone>`

```js
import {Clone} from '@react-three/drei';

export default function Model() {

  return (
    <>
      <Clone object={model.scene} scale={0.35} position-x={-4} />
      <Clone object={model.scene} scale={0.35} position-x={0} />
      <Clone object={model.scene} scale={0.35} position-x={4} />
    </>

    // <primitive object={model.scene} scale={0.35}/>  //hamburger
  );
}

```

---
# GLTF to component (48min 53sec)
- to manipulate the different parts of a hamburger: need to traverse the loaded model, find the child, save as variable, apply modifications.
- SOLUTION: loaded file is a component and everything inside is the parts as components in JSX (GLTF to react three fiber)

#### GLTF -> React 3 fiber
https://github.com/pmndrs/gltfjsx
online version - https://gltf.pmnd.rs

- it creates the react component from the model - giving access to individual parts as components
- drag-and-drop hamburger model .glb (draco or normal version) and you get component jsx code returned
- copy the code -> using the Leva exports -> "copy to clipboard"
- paste code src/Hamburger.js

#### Refactoring
- tool assumes model is available in the root directory (/public)
- or in other circumstances, make sure that the path in useGLTF() and useGLTF.preload() are the same.
- ./ makes the path relative to url

```js
const { nodes, materials } = useGLTF("./hamburger.glb");

//...
useGLTF.preload("./hamburger.glb");

```

#### Import (58min 23sec)
- import Hamburger in Experience.js
- in Experience.js, replace `<Model/>` with `<Hamburger>`
- since every part of the model are written as <mesh> and <group> in Hamburger.js we have a lot more control over it.

```js

export default function Hamburger(props) {
  const { nodes, materials } = useGLTF("./hamburger.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.bottomBun.geometry}
        material={materials.BunMaterial}
      />

      //...

      //top bun
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.topBun.geometry}
        material={materials.BunMaterial}
        position={[0, 1.77, 0]}
      />
    </group>
  )
}
```

- fixing the shadow, theres lines from 'shadow acne', each mesh is receiving and casting shadows - bun is casting shadows on itself.
- FIX: tweak "bias" or 'shadowBias' on the directional light shadow in Experience.

```js
//Experience

export default function Experience() {
  //...

  return (
  <directionalLight
    castShadow
    position={[1, 2, 3]}
    intensity={4.5}
    shadow-normalBias={0.04}
  />
  )
}
  
```

---
### Animation
- creating a Fox component (src/Fox.jsx), 
- load any of the model variations available in public/Fox/ folder with useGLTF()
- add it to the scene
- use attributes like 'scale', 'position', 'rotation' to adjust

### Play the animation
- 1. "Survey"
- 2. "Walk"
- 3. "Run"

- Drei has a helper for animations called: useAnimations()
- Fox.js: import {useAnimations, useGLTF} from '@react-three/drei';
- the loaded model gives us access to animations that come with the model in fox.animations
- after calling useGLTF, call useAnimation and send it fox.animations and fox.scene
  `const animations = useAnimations(fox.animations, fox.scene);`
- we have access to various animations provided with the model and each one has bee converted into an AnimationAction using the name of the animation: for Fox... (Run, Survey, Walk) 
- those actions are available in the (loaded).actions object
- useAnimation removes the manual process of creating AnimationActions
- eg. animations.actions.Run
- BUT before starting any actions, its better to do it once the component has finished for first time using useEffect
- React Three Fiber and useAnimations helper will take care of updating the animation on each frame.
- if you want the fox to start walking after a few seconds, use the various available methods in AnimationAction like "crossFadeFrom" which is going to "fadeOut" the "Run" and "fadeIn" the "Walk"

#### crossfade animation
```js
  //crossfade animation
  window.setTimeout(()=>{
    animations.actions.Walk.play();
    animations.actions.Walk.crossFadeFrom(animations.actions.Run, 1);
  }, 2000);
```

#### animation control and cleanup
- control animation via name - using Leva 
- after useAnimations, call useControls to create a tweak with a `<select>` where choices available are the animations in the model.
- access is via 'animations.names'
- in useEffect, instead of using the Run animation, use the animationName variable
- remove the automatic setTimeout we coded previously
- use the useEffect dependencies array to reflect the changing animation.
- when changing animation, threejs mixes AND plays all the animations together 
- TODO: clean transition animations for stop old animation (fadeOut) and start new animation (fadeIn)
  `action.reset().fadeIn(0.5).play();` - fade it in with fadeIn() before play with 0.5
- cleanup phase: animations to fadeOut is handled by useEffect() return ()=>{ action.fadeOut(0.5); }
- sometimes you need to reset the model animation so that the animation begins exactly when the fadeIn starts...
- FIX: add reset() before fadeIn().
- reset also ensures animation starts from begining

```js
//src/Fox

import { useAnimations, useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { useEffect } from "react";

export default function Fox() {
  const fox = useGLTF("./Fox/glTF/Fox.gltf");

  console.log(fox);   //gives access to properties like .scene and .animations


  const animations = useAnimations(fox.animations, fox.scene);

  console.log(animations.actions.Run);

  const { animationName } = useControls({
    animationName: { options: animations.names },
  });

  useEffect(() => {
    // const action = animations.actions.Run;
    // action.play();

    const action = animations.actions[animationName];
    action
      .reset()
      .fadeIn(0.5)
      .play();

    //crossfade animation
    // window.setTimeout(()=>{
    //   animations.actions.Walk.play();
    //   animations.actions.Walk.crossFadeFrom(animations.actions.Run, 1);     //run crossfade into walk
    // }, 2000);

    return () => {
      action.fadeOut(0.5);
    };
  }, [animationName]);

  return (
    <primitive
      object={fox.scene}
      scale={0.02}
      position={[-2.5, 0, 2.5]}
      rotation-y={0.3}
    />
  );
}

```
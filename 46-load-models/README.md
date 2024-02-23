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


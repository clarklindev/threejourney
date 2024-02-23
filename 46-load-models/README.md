# loading models

- using react 3 fibre to load models
- loading gltf
- react 3 fiber has useLoader()
- specify what loader useLoader will use - send to useLoader the threejs loader class we want to use for gltf loading (GLTFLoader)

### loading path:

- ./ works for most cases, as it looks for file in the same folder
- and since "public/" folder are made available like if they are at the root of the website, model will load.

### `<primitive>`

- use `<primitve>` with 'object' attribute with value set to: `model.scene`
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
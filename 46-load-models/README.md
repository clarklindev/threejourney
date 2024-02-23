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

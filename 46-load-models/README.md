# loading models

- using react 3 fibre to load models
- loading gltf
- react 3 fiber has useLoader()
- specify what loader useLoader will use - send to useLoader the threejs loader class we want to use for gltf loading (GLTFLoader)

```js
import {useLoader} from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Experience(){

    const model = useLoader(GLTFLoader, './hamburger.glb');
    
}
```
# 23 - Imported Models

- importing models into THREEjs
- use 3d software for complex modeling

### Formats

- https://en.wikipedia.org/wiki/List_of_file_formats#3D_graphics

- popular formats:
  - 3DS (3dstudio max)
  - GLTF (becoming standard) - made by Khronos group (opengl, webgl, vulkan)
    - companies backing Khronos (AMD, Nvidia, Apple, Google, Nintendo)
    - supports geometries and others like (camera, lights, scene, animations, skeletons)
    - various file formats (json, binary, embed textures)

#### GLTF formats

    - glTF
    - glTF-binary
    - glTF-Draco
    - glTF-Embedded

##### gltf

- multiple files in export
  - .gltf (json with properties/data)
  - .bin (has geometries, uv coordinates, vertex positions, colors etc)
  - .png (texture)
- load the gltf which then references the .bin and .png

```js
//@param1 path, @param2 success function(loaded-item)=>{}
gltfLoader.load("/models/Duck/glTF/Duck.gltf", (gltf) => {
  //   gltf.scene.scale.set(0.025, 0.025, 0.025);
  scene.add(gltf.scene.children[0]);
  //   // Animation
  //   mixer = new THREE.AnimationMixer(gltf.scene);
  //   const action = mixer.clipAction(gltf.animations[2]);
  //   action.play();
});
```

##### gltf-binary

- only one file containing all data above
- binary file
- easier to load
- harder to modify data

```js
//binary
gltfLoader.load("/models/Duck/glTF-Binary/Duck.glb", (gltf) => {});
```

##### gltf-draco

- like gltf but lighter
- buffer data is compressed

##### gltf-embedded

- json
- like gltf but instead of multiple files, the files are embedded as base64 data
- heavier as it is the combination of all the output files

```js
gltfLoader.load("/models/Duck/glTF-Embedded/Duck.gltf", (gltf) => {});
```

### Loading

- GLTFLoader
- instantiate it
- gltf.load() //params
  1. path,
  2. success function(),
  3. progress function()
  4. error function()
- once model is loaded, it needs to be added to scene

```js
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const gltfLoader = new GLTFLoader();

//@param path
//@param success function(gltf)  //gltf - what has been loaded
//@param progress function()
//@param error function()
gltfLoader.load(
  "/models/Duck/glTF/Duck.gltf",
  (gltf) => {}, //success //gltf - what has been loaded
  () => {}, //progress
  () => {} //error
); //path starts from inside the static (public) folder
```

#### the loaded gltf object

- scene usually has everything we need\
- the camera and the duck are in the Object3D
- the Object3D has a scale set to a small value

- loggin gltf we see its an object with:

  - animations
  - assets
  - cameras
  - parser
  - scene:Group
    children[] and array
    [0]:Object3D
    {

    - children[]
      [0] = PerspectiveCamera
      [1] = Mesh
    - position
    - scale (really small scale)
    - rotation

    }

  - scenes
  - userData

- so the path is: scene -> children:Array -> [0] (first element) -> children -> mesh

#### ways of adding duck to scene

- can add the whole scene
- can add just the children of the scene and ignore the Perspective camera
- can filter children before adding to the scene (harder)
- add only the mesh and end up with a duck with wrong scale, position and rotation
  (scale is on the parent and not the mesh itself)
- open the file in 3d software, clean it and re-export

#

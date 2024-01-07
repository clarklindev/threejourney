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

- sample models: https://github.com/KhronosGroup/glTF-Sample-Models

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

#### looping to add to scene

- adding from loaded array actually removes it from that array and it messes up indexes due to length of remaining items not being constant.

- dont do a for loop to loop through items (as indexes for length are messed up)

```js
//DONT DO THIS
for (const child of gltf.scene.children) {
  scene.add(child);
}
```

- SOLUTION1: use a while to add always the first element

```js
while (gltf.scene.children.length) {
  scene.add(gltf.scene.children[0]);
}
```

- SOLUTION2 (tutorial method): duplicate the children array (use it as a temp array) in order to have an unaltered independent array
- use spread operator ... and put the result in a brand new array []

```js
const children = [...gltf.scene.children];
for (const child of children) {
  scene.add(child);
}
```

### Draco loader (load compressed model)

- loading the draco version (https://google.github.io/draco)
- https://github.com/google.draco
- Draco version can be much lighter than the default version
- Compression is applied to the buffer data (typically the geometry)
- Draco is not exclusive to glTF but they got popular at the same time and implementation went faster with glTF exporters
- Google develops the algorithm under open-source Apache License

- instantiate the loader
- the decoder is also available in WebAssembly (faster)
- it can run in a worker (in another thread) to improve performances significantly.
- Three.js already provided the code in '/node_modules/three/examples/js/libs/draco' folder
- copy whole folder and place in static (public): 'public/draco'
- with workers, just have to provide path to draco folder.
- Provide the DracoLoader instance to the GLTFLoader instance with setDRACOLoader()
- NOTE: you can still load not compressed glTF file with GLTFLoader and the Draco decoder is only loaded when needed

```js
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const dracoLoader = new DRACOLoader(); //instantiate the loader - uses webassembly and worker
dracoLoader.setDecoderPath("/draco/"); //path from static (public) folder

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader); //give draco instance to gltf loader

gltfLoader.load("/models/Duck/glTF-Draco/Duck.gltf", (gltf) => {});
```

#### DRACOLoader ERROR

- Assets may be provided either in JSON (.gltf) or binary (.glb)
- DRACOLoader expects .drc it’s limited to just mesh data and can’t include materials, animations, textures, or other thing…
- Instead the most common thing is to start with a glTF file, then apply Draco compression to the mesh data in that file. At the end you still have a glTF file (which can include materials, animations, etc.), and need to use GLTFloader to read it.
  how to install the DRACO decoder - see example: https://threejs.org/docs/#examples/en/loaders/GLTFLoader

```error

THREE.DRACOLoader: Unexpected geometry type.
    at decodeGeometry
```

#### FIX error above

- install Draco 1.5.6 release (Feb 8, 2023) (https://github.com/google/draco/releases)
- DOWNLOAD THIS https://github.com/google/draco/archive/refs/tags/1.5.6.zip

- copy contents (files below) from (unzipped co-1.5.6 folder) /javascript / AND put contents in 'public/draco' folder:

  draco_decoder.js
  draco_decoder.wasm
  draco_decoder_gltf.js
  draco_decoder_gltf.wasm
  draco_encoder.js
  draco_encoder.wasm
  draco_encoder_wrapper.js
  draco_wasm_wrapper.js
  draco_wasm_wrapper_gltf.js
  time_draco_decode.html

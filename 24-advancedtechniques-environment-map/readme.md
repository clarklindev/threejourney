# environment map

- add gltfLoader
- load the model
- add to scene
  - meshStandardMaterial requires light
  - scale too small
- load environment map (cube texture) /static/environmentMaps/folder (0,1,2)
  - taken from HDRI section of https://polyhaven.com converted to textures using https://matheowis.github.io/HDRI-to-CubeMap/
- because textures are made up of 6 images (like the faces of a cube), we have to use a CubeTextureLoader
- after creating scene, load textures in this order:
  - positive X
  - negative X
  - positive Y
  - negative Y
  - positive Z
  - negative Z
- assign the environmentMap to the scenes background (after creating the environmentMap and the scene)
- moved the torus knot
- change the knots material to MeshStandardMaterial

```js
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  console.log("successs");
  gltf.scene.scale.set(10, 10, 10); //scale scene larger
  scene.add(gltf.scene);
});

const environmentMap = cubeTextureLoader.load([
  "environmentMaps/0/px.png",
  "environmentMaps/0/nx.png",
  "environmentMaps/0/py.png",
  "environmentMaps/0/ny.png",
  "environmentMaps/0/pz.png",
  "environmentMaps/0/nz.png",
]);

scene.background = environmentMap; //assign the environmentMap to the scenes background

/**
 * Torus Knot
 */
// const torusKnot = new THREE.Mesh(
//   new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
//   new THREE.MeshBasicMaterial()
// );

// torusKnot.position.x = -4;
// torusKnot.position.y = 4;
// scene.add(torusKnot);
```

```js
//change torus knot to use MeshStandardMaterial
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 1,
    color: 0xaaaaaa,
  })
);

torusKnot.position.x = -4;
torusKnot.position.y = 4;
scene.add(torusKnot);
```

### use the environment map to light up the model

- already covered how to apply an environment map to a MeshStandardMaterial using the envMap property (using envmap to cause reflection/lighting on a texture)
- BUT its messy to apply map to each mesh in a scene
- CORRECT METHOD: apply the environment map as lighting to the whole scne, assign it to the "environment" property of the scene.

```js
// apply an environment map to a MeshStandardMaterial
// torusKnot.material.envMap = environmentMap;

//CORRECT METHOD
scene.environment = environmentMap;
scene.background = environmentMap;
```

### control environmentmap insensity

- we are going to tweak intensity but it has to be done on each material
- traverse() and apply the intensity whenever suitable
- travers() is available on every Object3D and classes that inherit from it like Group, Mesh, and Scene
- we will do the updates in a separate function named updateAllMaterials and call it once the model is loaded
- create this function before the environment map and the model
- use the traverse() method on the scene (traverses every child in scene)
- we only want to apply environment map to the Meshes that have a MeshStandardMaterial
- test if the child is an instance of THREE.Mesh
- and if its (child material) is an instance of THREE.MeshStandardMaterial
- SHORTCUT: test if child.isMesh && child.material.isMeshStandardMaterial
- adjust with child.material.envMapIntensity =
- ability to control intensity with DAT.ui
  - use a global variable, tweak only one property and use that value on every child in the scene.
- call the updateAllMaterials function when the tweak value changes using onChange
- use the global.envMapIntensity on the materials

```js
const global = {};
global.envMapIntensity = 1;

gui
  .add(global, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials);

const updateAllMaterials = () => {
  console.log("traverse the scene and update all materials here");
  scene.traverse((child) => {
    console.log(child);
    if (
      // child instanceof THREE.Mesh &&
      // child.material instanceof THREE.MeshStandardMaterial
      child.isMesh &&
      child.material.isMeshStandardMaterial
    ) {
      console.log(child);
      child.material.envMapIntensity = global.envMapIntensity;
    }
  });
};
```

### Background bluriness and intensity

- useful if environment resolution is quite low, or if you want user to focus on the object in the foreground
- backgroundIntensity will control the background brightness.
- NOTE: only controls the background NOT the environment map intensity

```js
scene.backgroundBlurriness = 0.2;
scene.backgroundIntensity = 5;

gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001);
gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.001);
```

## HDRI Equirectangular environment map

- .hdr file inside -> /static/environmentMaps/0/
- if OS supports it, you can get a preview of environment map
- HDRI (high dynamic range image)
- color values stored have a much higher range than traditional image(ideal to store luminosity data)
- Equirectangular format meaning its 1 file not 6 (360 of whole scene) - sky and floor is stretched
- loading .hdr files instead
- need to use RGBELoader (Red Green Blue Exponent Loader) - exponent stores the brightness
- RGBE is the encoding for .hdr format
- import and instantiate the loader
- set its mapping property to THREE.EquirectangularReflectionMapping and assign it to the background and environment properties of scene.
- scene looks better (because the color range values stored is higher)
- CONS of using HDR:
  - file is heavier / load / render
- RECOMMENDATION:
  - use low res HDR for lighting
  - blur the background

```js
// const environmentMap = cubeTextureLoader.load([
//   "environmentMaps/0/px.png",
//   "environmentMaps/0/nx.png",
//   "environmentMaps/0/py.png",
//   "environmentMaps/0/ny.png",
//   "environmentMaps/0/pz.png",
//   "environmentMaps/0/nz.png",
// ]);
// scene.environment = environmentMap;
// scene.background = environmentMap;

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const rgbeLoader = new RGBELoader();
rgbeLoader.load("/environmentMaps/0/2k.hdr", (environmentMap) => {
  console.log(environmentMap);

  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;
});
```

---

### Generate environment map using Blender

- can get from HDRI section on https://polyhaven.com
- but can create own

#### Render

- RenderIcon (looks like a camera - right panel) change render engine from EEvee to Cycles
- sampling - rays being casted to test color
  - viewport (max samples set 256)
  - render (max samples set 256)

#### world

- world properties (world icon)
- surface color (move to 0 - creates a dimming on edge or scene)

#### output

- output properties (looks like printer icon)
- set x: 2048 px
- set y: 1024 px
- % - tweak the output as percentage
- webgl2 supports non power of 2 textures

  - but we still do power of 2's for compatibility with other apps

#### on the main scene

- back to the scene, we are placing objects in the scene to test environment maps
- create 6 objects (TOP, BOTTOM, LEFT, RIGHT, FRONT, BACK)
- add camera (N - configure values)
  - location: 0 (select drag x,y,z set 0)
  - rotation: x:90, y: 0, z:0 (select drag y,z set 0)

#### camera

- camera properties (camera icon on right panel)
- lens type -> set to panoramic
- panorama type -> set to equirectangular

#### Lights (environment maps 44:27)

- add area light and move away from center of scene (ENSURE RAY points to center of scene 0,0,0)
  - G - move
  - R - rotate
  - S - scale
- change light intensity
  - Object data properties (lightbulb icon) -> power -> 1000w

- ##### ensure light is visible in scene
  - object properties (square icon) -> visibility -> ray visibility -> check Camera
  - now in render mode (z-> rendered) you can see the light
  - NOTE: if you cant find ray visibility - change rendering engine to cycles
      * Eevee render engine by default, just switch to Cycles engine and it will all be there.

#### preview scene / render scene / save render as environment map

z - preview render
F12 - render scene

##### save + load .hdr

- to save the render

  - hover over rendered (RENDERED image)
  - 
  - save as (ALT+S) -> save to static folder -> environmentMaps ->
  - update name (blender-2k)
  - fileformat -> radiance HDR

- load hdr from static folder

### using AI to generate Environment maps
#### NVidia Canvas
- requires NVidia RTX GPU
- create panorama (in beta)
- export (4k) .. saves as .exr (still is HDR with different encoding)
- exr also has layers and alpha channel if needed.

```js
import {EXRLoader}  from "three/examples/jsm/loaders/EXRLoader";

exrLoader.load('/environmentMaps/nvidiaCanvas-4k.exr', (environmentMap)=>{
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environmentMap = environmentMap;  //environmentMap working as lighting too

});

```
#### Skybox Lab by BlockadeLabs 
- https://skybox.blockadelabs.com/
- futuristic -> cyberpunk -> "neon city, orange lights, taxi using digital painting style"
- download jpg Equirectangular (.LDR)
- set the mapping to THREE.EquirectangularReflectionMapping
- fix the colorspace to: environmentMap.colorSpace = THREE.SRGBColorSpace;
- since the environmentmap is LDR, you should increase default envMapIntensity on global.

### Loading these LDR files
```js
const textureLoader = new THREE.TextureLoader();
const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg')
environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  environmentMap.colorSpace = THREE.SRGBColorSpace;
  scene.background = environmentMap;
  scene.environmentMap = environmentMap;  //environmentMap working as lighting too

global.envMapIntensity = 4;

```

### Ground projected Skyboxes
- reuse env map BUT only for scene scene environment
- import GroundProjectedSkybox
- create a new instance of GroundProjectedSkybox passing environmentMap as prop
- set scale
- can control the skybox projection with the radius and height
- its better to add these values to dat.ui
- this wont always work (especially) when there are items at center of environment map

```js
import {GroundProjectedSkybox} from "three/examples/jsm/objects/GroundProjectedSkybox";

//GROUND PROJECTED SKYBOX
rgbeLoader.load("/environmentMaps/2/2k.hdr", (environmentMap) => {
  console.log("environmentMap: ", environmentMap);
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = environmentMap;
  
  //skybox
  const skybox = new GroundProjectedSkybox(environmentMap);
    skybox.radius = 120;
    skybox.height = 11;

  skybox.scale.setScalar(50);

  scene.add(skybox);

  gui.add(skybox, 'radius', 1, 200, 0.1).name('skyboxRadius');
  gui.add(skybox, 'height', 1, 100, 0.1).name('skyboxHeight');

});
```

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

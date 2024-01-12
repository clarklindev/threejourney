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

# importing and optimizing the scene
### setup
- orbit controls
- cube
- dat.gui
- loaders with Draco
- .blend file in the /resources/ folder
- exports in the /static/ folder

### load the model (1min 46sec)
- GLTF exports PBR material, that results in MeshStandardMaterial, we dont want that.
- create a MeshBasicMaterial


```js
//baked material
const bakedMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});

//loader
gltfLoader.load("resources/portal.glb", (gltf) => {
    
  gltf.scene.traverse((child) => {
    child.material = bakedMaterial;
    console.log("loaded");
  })

  scene.add(gltf.scene);

});

```

### Load the texture before the materials (model) (9min 07sec)
- first load the texture
- use it in the material with map
- the texture is inverted on the y coordinates
- set the flipY property of bakedTexture to false

```js
const bakedTexture = textureLoader.load("resources/portal_baked.jpg");
bakedTexture.flipY = false;

const bakedMaterial = new THREE.MeshBasicMaterial(
  {
    // color: 0xFF0000,
    map: bakedTexture,
  // normalMap: normalMap,
  // aoMap: aoMap,
}
);

```

### Fixing the colors (12min 39sec)
- set the encoding of texture to THREE.sRGBEncoding NOTE: this is deprecated... use 
  `bakedTexture.colorSpace = THREE.RGBColorspace`
- AND also need to tell renderer to use renderer.outputEncoding = THREE.sRGBEcoding //DEPRECATED use 
  `renderer.outputColorSpace = THREE.SRGBColorSpace;`

```js
bakedTexture.colorSpace = THREE.SRGBColorSpace; //replaces bakedTexture.encoding = THREE.sRGBEncoding

//...

renderer.outputColorSpace = THREE.SRGBColorSpace; //replaces renderer.outputEncoding = THREE.sRGBEncoding
```

### Fixing the emission objects (16min)
- the lighting - we want to replace lamps and portal with MeshBasicMaterial
- create a MeshBasicMaterial for the pole light
- How do we apply the poleLightMaterial on the correct objects? (17min)
- we rename the objects (in BLENDER) in order to find them in threejs (*and its only necessary to change name for the emmission objects in blender)
- rename each one of the emission objects (19min):
  - poleLightA
  - poleLightB
  - portalLight


#### blender Export
- NB: NOTE: the exported name is the name that will be used in find() in the threejs javascript part
- export again: NB!!!! SELECT ALL OBJECTS TO EXPORT -> FILE -> export -> gltf 2.0

  mesh -> normals -> OFF
  mesh -> vertex colors -> OFF
  mesh -> animation -> OFF

#### threejs (24min 39sec - 28min)  
- use the find() method on gltf.scene.children 
- create a variable for each of the 3 objects 

```js
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });

  const portalLightMesh = gltf.scene.children.find(
    (child) => child.name === "portalLight"
  );
  const poleLightAMesh = gltf.scene.children.find(
    (child) => child.name === "poleLightA"
  );
  const poleLightBMesh = gltf.scene.children.find(
    (child) => child.name === "poleLightB"
  );

```

### Apply materials (28min)
- change the material for the poleLight 

```js
poleLightAMesh.material = poleLightMaterial;
poleLightBMesh.material = poleLightMaterial;
// portalLightMesh.material = portalLightMaterial;
```

### Create a MeshBasicMaterial for the portal and apply it
```js
const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

//...

portalLightMesh.material = portalLightMaterial;

```
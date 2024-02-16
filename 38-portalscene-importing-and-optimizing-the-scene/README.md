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

### Improving performance (31min27sec)
- spectre.js can be used for monitoring - monitor steps to render one frame (what you can see in 1 frame)
- install as chrome extension or npm package
- npm i spectorjs 
- click on red button

```js
const SPECTOR = require('spectorjs');
spector = new SPECTOR.Spector();
spector.displayUI();
```

### Merge the baked objects (BLENDER) (36min50sec)
- we can merge all of the baked objects into one geometry that will be drawn in one call

#### reorganize BLENDER 
- open blender
- TODO: make the emissions collection as unselectable
- TODO: make the "others" collection as unselectable
- create an empty "merged" collection - select everything (whole scene) SHIFT CLICK on any object to ensure something is active element -> 
- duplicate whole scene (SHIFT + D)
- right click to keep position
- press M - move the duplicate into the "merged" collection
- press CTRL + J - this joins everything into one object 
- make one object in selection active (SHIFT + click)
- now you can disable (exclude from selection checkbox) all other scene collections, but keep emissions selected
- when you export a merged object, it exports/orders the texture by the different materials you created and named (eg. wood, metal, rock)
- ensure that when export - dont export the material
- save the glb
- see performance, it reduces the number of renders from 170 something to 4

#### creating a CYCLES look
- you can create the default cycles look but without materials, this give like a white scene but keeps the shading/shadows
- materials panel -> remove the materials
- NOTE: if there is no materials, it gives a default Cycles look (matt white) BUT the floor needs to have a material (even if its the default) 
- in compositor -> mute the created node and filter 
- in compositor -> unmute default (AND link image to image of render)
- ensure emissions is selectable
- ensure others is selectable
- ensure non-merged layers is NOT selectable
- select: merged, emmisions, others
  - File -> export -> glTF 2.0
  - geometry -> ensure material -> no export
  - export public/resources/ as "portal.glb"
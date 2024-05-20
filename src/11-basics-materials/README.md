## Loading Manager / material

- when working with opacity, need to set transparent to true

- gains overall insight of different loaders

## MATERIALS

```js
const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });
material.map = doorColorTexture; //alternative method
material.color.set("purple"); //alternative method
material.color = new THREE.Color("#00FF00"); //alternative method
material.wireframe = true;
material.opacity = 0.3;
material.transparent = true; //when working with opacity, need to set transparent to true
material.alphaMap = doorAlphaTexture;
material.side = THREE.DoubleSide; //THREE.FrontSide, THREE.BackSide, THREE.DoubleSide
```

```js
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("onStart");
};

loadingManager.onLoaded = () => {
  console.log("onLoaded");
};

loadingManager.onProgress = () => {
  console.log("onProgress");
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load("/color.jpg");

const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
  // color: 0xff0000,
  // wireframe: true,
});

/* //alternative method BUT to set color after, can do it directly (use set())
  const material = new THREE.MeshBasicMaterial({ map: doorColorTexture }); 
  material.map = doorColorTexture; //alternative method
*/
material.color.set("#FF00FF");
// material.color.set("purple"); //alternative method
material.color = new THREE.Color("#FF00FF"); //alternative method - provide and instance of Color() class
material.wireframe = true;
material.opacity = 0.3;
material.transparent = true; //when working with opacity, need to set transparent to true
material.alphaMap = doorAlphaTexture;
material.side = THREE.FrontSide; //THREE.FrontSide, THREE.BackSide, THREE.DoubleSide
```

## UV Unwrapping

- BoxBufferGeometry - every vertex also gets a UV coordinate (2d) on a plane.
- geometry .attributes.uv (float32 buffer attribute)

- can wrap with .repeat (vector2) ie x and y
- can offset
- or move the .center point

```js
//REPEAT
colorTexture.repeat.x = 2;
colorTexture.repeat.y = 3;

// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;

colorTexture.wrapS = THREE.MirroredRepeatWrapping;
colorTexture.wrapT = THREE.MirroredRepeatWrapping;

//OFFSET
colorTexture.offset.x = 0.5;
colorTexture.offset.y = 0.5;

colorTexture.rotation = 1; //radians

colorTexture.rotation = Math.PI; //180 = half rotation
colorTexture.rotation = 2 * Math.PI; //360 = full rotation
colorTexture.rotation = Math.PI * 0.25; //1/4 45degree

colorTexture.center.x = 0.5;
colorTexture.center.y = 0.5;
```

#### Filtering / mip mapping

- mip mapping is re-creating texture thats exactly half in size.
- GPU chooses one of the textures (or small versions).
- texture width and height MUST be power of 2. 512 x 512, 1024 x 1024, 512 x 2048
- minification filter occurs when the texture is bigger than the surface it covers.
- minFilter algorithm for minification:
- when using minFilter - NearestFilter you dont need mip mapping.

1. THREE.NearestFilter
2. THREE.LinearFilter
3. THREE.NearestMipmapNearestFilter
4. THREE.NearestMipmapLinearFilter
5. THREE.LinearMipmapNearestFilter
6. THREE.LinearMipmapLinearFilter (default)

```js
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.generateMipmaps = false; //when using minFilter - NearestFilter you can turn off mipmaps
```

- magFilter when texture is too small for area it is covering and pixels are stretched, creates a blurred effect
- when this happens THREE.NearestFilter will sharpen the texture

compress with TinyPNG to compress images

#### texture websites

- poliigon.com
- 3dtextures.me
- arroway-textures.ch

#### MATERIALS - MeshBasicMaterial

```js
const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });
```

#### MATERIALS - MeshNormalMaterial - NORMALS

- MeshNormalMAterial
- normals are information that contains the direction of the outside of the face of geometry.
- normals used for lighting, reflection, refraction
- .flatShading = true (creates rigid shape)

```js
const material = new THREE.MeshNormalMaterial();
material.flatShading = true; //makes things have rigid shape (flat shapes)
```

#### MATERIALS - MeshMatcapMaterial

- MeshMatcapMaterial
- takes colors from texture to put on the shapes by using normals relative to camera
- simulate light without light in scene
- can create fake shadows by applying material to shape
- matcap library: https://github.com/nidorx/matcaps

```js
const material = new THREE.MeshMatcapMaterial();
material.matcap = matcapTexture;
```

#### MATERIALS - MeshDepthMaterial

- zoomed in, objects get lighter, and further it gets darker (think game Limbo)
- NOTE: added lights DO NOT WORK on meshDepthMaterial
- you get meterials that DO get affected by lights..

```js
const material = new THREE.MeshDepthMaterial();
```

#### MATERIALS - THAT REACT TO LIGHT

```js
// add lights to scene

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 0;
pointLight.position.y = 4;
pointLight.position.z = 1;

scene.add(pointLight);
```

##### MESHLAMBERT MATERIAL - MeshLambertMaterial

- reacts to light

```js
const material = new THREE.MeshLambertMaterial();
```

##### MESHPHONG MATERIAL - MeshPhongMaterial

similar to mesh lambert but its cleaner and has shine

```js
const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
material.shininess = 100;
material.specular = new THREE.Color(0x1188ff); //change color of reflection
```

#### MESHTOON MATERIAL - MeshToonMaterial

- cartoonish effect
- can control the difference between change with gradient using a texture
- uses a texture gradient
- because we use NearestFilter, can remove mipmapping

```js
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const material = new THREE.MeshToonMaterial();
```

#### MESHSTANDARD MATERIAL - MeshStandardMaterial

- uses Physically Based Rendering Principals (PBR) - algorithm techniques that mimic real life conditions
- supports lights - similar to MeshLambert and MeshPhong material
- BUT its more realistic with parameters like: roughness , metalness
- also can use aoMap (ambient occlusion map)

```js
material.metalness = 0.45;
material.roughness = 0.65;

//add debug panel props
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
```

##### MESHSTANDARD MATERIAL - ambient occlusion

- aoMap (ambient ocllusion map) will add shadows where the texture is dark/
- we must add a second set of UV coordinates named uv2 with same UV as default.

```js
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
```

##### MESHSTANDARD MATERIAL - displacement map

- displacement is same as texture height
- requires enough vertices
- effect too strong causes disfigure
- remember height map (white = up, black = down, grey = no effect)

```js
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.05;
```

##### MESHSTANDARD MATERIAL - metalness map

note: if you have both metalness and roughness props with metalnessMap and roughnessMap, it combines the values

- can use default values metalness 0, roughness 1

```js
// material.metalness = 0.45; //comment out
// material.roughness = 0.65; //comment out
material.metalness = 0;
material.roughness = 1;
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
```

##### MESHSTANDARD - normal map

- adds details without needing subdivisions

```js
material.normalMap = doorNormalTexture;
```

##### MESHSTANDARD - alpha map

- you have to set transparent to the material

```js
material.transparent = true;
material.alphaMap = doorAlphaTexture;
```

#### MESHPHYSICAL MATERIAL - MeshPhysicalMaterial

same as MeshStandardMaterial but with a clear coat effect on the surface like a tenpin bowling ball.

#### POINTS MATERIAL

- used to create particles

#### SHADERMATERIALS / RAWSHADERMATERIALS

- when you want to create your own materials

---

### Environment Maps

- image that surrounds scene
- used for lighting object, reflection, refraction
- threejs ONLY currently supports cube maps
- use CubeTextureLoader

- p is positive
- n is negative
- resource: HDRIHaven [https://polyhaven.com/](high dynamic range imaging) -downloads .hdr files

```js
//loads front,back,left, right,top,bottom - order important
const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

material.envMap = environmentMapTexture;
```

#### HDRI-to-CubeMap - HDRI texture to cube teture (convert 1 image to 6)

https://matheowis.github.io/HDRI-to-CubeMap

- save as separate file versions
- default format downloaded is png

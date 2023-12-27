# ThreeJS

- starter project (starter.zip)
- https://github.com/rajput-hemant/threejs-journey/tree/master

## Basic scene

```js
import * as THREE from "three";

//canvas
const canvas = document.querySelector("canvas.webgl");

//mesh = geometry + material
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

//camera
//1. field of view (degrees) 35-75
//2. aspect ratio (width / height)
const sizes = {
  width: 800,
  height: 600,
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
//poisition camera
camera.position.z = 3;

//scene
const scene = new THREE.Scene();
scene.add(mesh);
scene.add(camera);

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
```

---

## helper functions

### .length()

- distance between center of scene and object

console.log(mesh.position.length());

### distanceTo()

- distance between camera and mesh

```js
console.log(mesh.position.distanceTo(camera.position));
```

### .normalize()

.normalize() without props takes vector length and reduces its value till its 1.

```js
mesh.position.normalize();
mesh.position.normalize(camera.position);
```

### .set()

// note you can use Vector3 class for this...
mesh.position.x = 0.7;
mesh.position.y = -0.6;
mesh.position.z = 1;

mesh.position.set(0.7, -0.6, 1);

### AxesHelper

visual axis helper

---

## Rotation and quaternion

- Rotation is in Euler.
- Rotation order is important
- reorder rotation:

- quarternion and rotation are tied - update when one/or other updates.

```js
mesh.rotation.reorder("YXZ"); //note axes order
mesh.rotation.y = Math.PI;
```

Math.PI = is half a rotation
2x Math.PI = full rotation is 2x pie

## scale

mesh.scale.set(2, 0.5, 0.5);

## Look at object

```js
camera.lookAt(new THREE.Vector3(3, 0, 0));
camera.lookAt(mesh.position);
```

## create groups

- groups inherit from Object3D

## request animation frame

3 options for render frame

- use Date.now(); - millisecond
- THREE.Clock() - seconds
- GSAP - npm i gsap@3.5.1 - gsap has its own 'tick' but render() and requestAnimationFrame() still neeeded

```js
//use Date.now();
let time = Date.now(); //timestamp from 1 January 1970

const tick = () => {
  console.log("tick");
  const currentTime = Date.now();
  const deltaTime = currentTime - time;

  time = currentTime;
  console.log(deltaTime);

  mesh.rotation.x += 0.001 * deltaTime; //rotate at same speed regardless of framerate

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};
tick();
```

```js
//using THREE.Clock
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  mesh.position.x = Math.cos(elapsedTime);
  mesh.position.y = Math.sin(elapsedTime);

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
```

```js
//gsap
gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });
gsap.to(mesh.position, { x: 0, duration: 1, delay: 2 });

const tick = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
```

---

## Cameras

- Orthographic Camera - render without perspective
- Perspective camera

- Array Camera (split screen)
- stereo Camera (render scene from 2 cameras mimicking eyes)
- Cube Camera (6 cameras - for environment maps)

### Perspective Camera

props:

- 1. field of view (degrees) 35-75 vertical vision
- 2. aspect ratio (width / height)
- 3. near - how close camera can see - objects closer than near will not show - nice value to use: 0.1
- 4. far - how far camera can see - objects further than far will not show - nice value to use: 100

```js
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
```

### Orthographic Camera

- 6 props (left, right, top, bottom, near, far)
- needs aspect ratio (0.1, 100)

```js
const aspectRatio = sizes.width / sizes.height;

const camera = new THREE.OrthographicCamera(
  -1 * aspectRatio,
  1 * aspectRatio,
  1,
  -1,
  0.1,
  100
); //left, right, top, bottom, near, far
```

## Mouse Interaction

- use 0 to 100 instead of screen size (easier to work with)1
- "-0.5" is to get center point of window

```js
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});
```

### Camera Controls

- OrbitalControls (useful) - smooth
- DragControls - moving objects
- TransformControls (XYZ)

- DeviceOrientationControls
- DragControls
- FirstPersonControls
- FlyControls
- PointerLockControls (first-person-shooter - no cursor)
- TrackballControls (unlimited orbitalControl rotation)

#### OrbitalControls - how to use:

- comment out camera positioning and camera.lookAt
- OrbitControl is not part of THREE package import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
- OrbitControls takes the camera and an object to put mouse events on. eg canvas
- controls.enableDamping (acceleration and friction) will smooth out the process.
- damping needs controls.update() call in tick() before .render() - else the animation just stops when mouse up.

```js
const controls = new OrbitControls(camera, canvas);
```

---

## FULLSCREEN / RESIZE

```css
html,
body {
  overflow: hidden;
}
.webgl {
  position: absolute;
  top: 0;
  left: 0;
  outline: none;
}
```

```js
window.addEventListener("resize", () => {
  //update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix(); //need to tell three.js to update projection matrix

  //update renderer
  renderer.setSize(sizes.width, sizes.height);
  // renderer.setPixelRatio(window.devicePixelRatio); //set same pixel ratio as system
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement | document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
```

## Geometry

6 parameters

- width
- height
- depth
- width segments - subdivisions in x axis
- height segments - subdivisions in y axis
- depth segments - subdivisions in z axis

### subdivision

subdivisions correspond to how many triangles should compose a face
1 - 2 triangles per face
2 - 8 triangles per face

### vertices AND faces

- create vertices on geometry's .vertices property
- BufferGeometry is more efficient and optimized but less developer friendly

```js
/**
 * vertices for n random triangles
 *
 * (50 * 3 * 3): 50 triangles, 3 vertices per triangle, 3 components per vertex (x, y, z)
 */

const geometry = new THREE.BufferGeometry();

//float32 typed array - fixed length
const count = 50; //number of triangles

const positionsArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 4;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3); //3 values for each vertex

geometry.setAttribute("position", positionsAttribute);

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
```

---

## DEBUG UI

- add debug ui elements as you go.
- debug elements should be added after the element to tweak.

- range
- color
- text
- checkbox
- select
- button
- folder

- DAT.ui(https://github.com/dataarts/dat.gui#readme not maintained) / https://www.npmjs.com/package/dat.gui

```js
// dat-ui
import * as dat from "dat.gui";
const gui = new dat.GUI();
gui.hide();//hide gui at start, use 'h' to show

gui.add(mesh.position, "y", -3, 3, 0.01); //min , max, precision (step)
gui
  .add(mesh.position, "y")
  .min(-3)
  .max(3)
  .step(0.03) //using function() min , max, precision (step)
  .name("name of prop");
gui.add(mesh, "visible");

gui.add(material, "wireframe");

const parameters = {
  color: 0xff0000,
};

gui.addColor(parameters, "color").onChange(() => {
  //update material
  material.color.set(parameters.color);
});

const material = new THREE.MeshBasicMaterial({
  color: parameters.color
  wireframe: true,
});
```

- lil-gui (https://lil-gui.georgealways.com/) / https://www.npmjs.com/package/lil-gui

```js
// lil-gui
import GUI from "lil-gui";
const gui = new GUI();
```

## Textures

- Textures based on images, covering surface of geometries

1. Color texture (Albedo) - color applied to geometry
2. Alpha texture - greyscale image - white visible / black invisible / grey - inbetween alpha
3. height displacement - greyscale image - white, vertices raised / black, vertices sink / perfect grey, still vertex - need subdivision
4. normal - adds details (light) - dont need subdivision
5. ambient occlusion - greyscale - faking shadows
6. metalness - white metalic / black non-metalic - mostly used for reflection
7. roughness - greyscale - white is rough , black is smooth - mostly for light dissipation

- textures are based on PBR (physically based rendering)

### loading textures

#### image path: getting url of the image

- adding assets to static/ folder, direct access to image as if it is in root directory localhost:3000/

#### loading textures with texture loader (easier):

- single texture loader can load multiple textures

```js
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/door/color.jpg");
```

#### loading textures image (harder method):

```js
const image = new Image();
const texture = new THREE.Texture(image); //provide image to texture
image.onload = () => {
  texture.needsUpdate = true;
};

image.src = "/textures/door/color.jpg";

const material = new THREE.MeshBasicMaterial({ map: texture });
```

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

### 3D Text

- NB: TextGeometry and FontLoader have been moved out of the core some time ago so you have to import them
- TextGeometry
- need a font called typeface
- convert webfont to typeface - gero3.github.io/facetype.js
- also: node_modules/three/examples/fonts/[typefacefont] : DONT DO THIS!  
   import typefacefont from 'three/examples/fonts/helvetiker_regular.typeface.json'
- drop the font and license into assets folder: static/fonts etc (see what this is for vite)
- use FontLoader to handle loading: https://threejs.org/docs/#examples/en/loaders/FontLoader
- FontLoader uses a callback - loaded font received as prop in callback
- Bounding is the space taken up by the geometry
- Bounding can be box or sphere (default)
- bounding is for frustum culling - to render or not to render - eg. if geometry is within scene

```js
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  console.log("font loaded");
  const textGeometry = new TextGeometry("helloworld", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.computeBoundingBox();
  console.log(textGeometry.boundingBox);

  const textMaterial = new THREE.MeshBasicMaterial();
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});
```

---

### LIGHTS

- lights cost a lot in terms of performance - use lights that cost less for hardware

  - minimal cost lights are AmbientLight and HemisphereLight
  - moderate cost lights: DirectionalLight, PointLight
  - high cost: SpotLight, RectAreaLight

- only 3 types of lights support shadows
  1. PointLight
  2. DirectionalLight
  3. SpotLight

#### ambient light

- ambient light is uniform lighting that bounces off object - every part of object gets same light
- universal light that lights up scene from everywhere

```js
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 0.5;
scene.add(ambientLight);
```

#### directional light

- parallel light from same direction - light travelling in parallel to each other
- you can change light orientation by changing light position
- light rays point to center of scene

#### hemisphere light

- light source comes from hemispheres (top / bottom)

#### point light

- light from specific point shines in all directions
- you can control parameters (distance and decay) ie. where light has no more effect

#### rect area light

- react area light is as if there is a rectangle shape light projecting light out (has diffusion) like a photoshoot lighting board
- only works with MeshStandardMaterial and MeshPhysicalMaterial
- can use .lookAt() to orientate light at a direction

```js
//color, intensity, width, height
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);
```

#### spot light

- similar to a flash light
- color : Integer, intensity : Float, distance : Float, angle : Radians, penumbra : Float, decay : Float
- penumbra is edge fade - ie. blurred edges
- spotlight doesnt work with quarternion or lookat()
- spotlight target is an Object3D - it is theorethical SO IT NEEDS TO BE ADDED TO SCENE

```js
const spotLight = new THREE.SpotLight(
  0x78ff00,
  0.05,
  10,
  Math.PI * 0.1,
  0.25,
  1
);

spotLight.position.set(0, 2, 3);
scene.add(spotLight);

spotLight.target.position.x = -0.75;
scene.add(spotLight.target);
```

### Light Baking

- baking light/shadows into texture
- downside is cannot move the light

### Light Helpers

- provide light helpers to the scene
- light helper (requires: light instance)

  - HemisphereLightHelper
  - DirectionalLightHelper
  - PointLightHelper
  - RectAreaLightHelper
  - SpotLightHelper (no size)

- the second parameter is the size of the helper
- SpotLightHelper - used to need updating to show correctly - seems fixed - no need to add window.requestAnimationFrame to update the helper
- RectAreaLightHelper - import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js"; because its not part of THREE package

```js
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

//HemisphereLightHelper
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

//DirectionalLightHelper
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

//PointLightHelper
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

//SpotLightHelper
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
// window.requestAnimationFrame(() => {
//   spotLightHelper.update();
// });

//RectAreaLightHelper
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);
```

---

### SHADOWS

1. - Enable shadows on renderer

```js
renderer.shadowMap.enabled = true;
```

2. - then for each object on the scene, can it cast a shadow with "castShadow", and can it receive a shadow "receiveShadow"

```js
sphere.castShadow = true;
plane.receiveShadow = true;
```

3. activate shadow on the lights

- only 3 types of lights support shadows
  1. PointLight
  2. DirectionalLight
  3. SpotLight

```js
directionalLight.castShadow = true;
```

- default shadow (core shadow) on objects
- drop shadows - Silhouette of object on the plane
- shadows have been a challenge for real-time 3d rendering (because they are required at good framerate)
- there is something called Raytracing - realistic shadows (but it takes a long time to render)

- threejs shadows:

- when doing ONE render:
- threejs will do a render for each light supporting shadows - these renders simulate what light sees if it was a camera
- during lights renders - MeshDepthMaterial replaces all MeshMaterials
- light renders are stored as textures called "shadow maps" (ie. shadow maps are textures of what the light can see)
- takes snapshot of scene, and notes where objects are on scene and using this as reference in the renders, it is able to create shadows.

#### shadow map quality

- if the quality of the shadow map is too low, you can increase shadow map dimensions (width and height)
- you can do this on the light itself
- RADIUS doesnt work with PCFSoftShadowMap

```js
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
```

### Light near/far

- can specify the camera light near/far so render is efficiently optimized.
- use a light helper
- add to scene
- reduce render area - set shadow render area with .shadow.camera.near and .shadow.camera.far

### amplitude
- render area - size is adjustable by controlling left, right, top, bottom distance of the camera
- hide camera helper by directionalLightCameraHelper.visible = false;

### blur
- blur shadow
```js
directionalLight.shadow.radius = 10;
```

```js
directionalLight.shadow.camera.bottom = 2;
directionalLight.shadow.camera.left = 2;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);
```

### shadowmap algorithms:

  - THREE.BasicShadowMap - very performant - lousy quality
  - THREE.PCFShadowMap - less performant - smooth edges
  - THREE.PCFSoftShadowMap - less performant - even softer edges (brunos pick) //RADIUS doesnt work with this
  - THREE.VSMShadowMap - less performant - more constraints - unexpected results

```js
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

```

#### spot light shadows

- too bright? reduce ambient light and directionalLight intensity
- improve quality by changing shadow.mapSize
- spotLight uses PerspectiveCamera - and we change fov to change amplitude (render size ie clse/far from objects in scene)


```js
const spotLight = new THREE.SpotLight(0xFFFFFF, 0.4, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

spotLight.position.set(0,2,2);
scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);

```

### pointlight
- reduce brightness in scene by changing ambient, directional and spotlight intensity.
- Threejs - point light uses perspective camera helper and it takes 6 images (top, right, bottom, left, back, and front) from the point light position (ie. 6x renders for each light)
- the pointLight Helper in scene is looking down because down is probably the last render that threeJS does

```js
const pointLight = new THREE.PointLight(0xFFFFFF, 0.3);
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0);
scene.add(pointLight);
```

### Baking shadows
- bake shadows into the texture floor
- first disable all shadows by changing 
- Instead of MeshStandardMaterial, use a MeshBasicMaterial on the plane material with the bakedShadow
- moving objects causes a problem because shadow is baked on the plane.

```js
renderer.shadowMap.enabled = false;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5,5);
  new THREE.MeshBasicMaterial({
    map: bakedShadow
  })  
)
```

### Alternative to baking shadows
- using an image (diffused circle gradient), simpleShadow.jpg and we move this image when the object moves, and if the object gets further from plane, we make the shadow have more alpha (transparent).
- simulate a ball bouce by using Math.abs(sin(x))

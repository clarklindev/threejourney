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

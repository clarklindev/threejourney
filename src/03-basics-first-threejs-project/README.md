## Basic scene
theres transform, position, rotation

### Object
- MeshBasicMaterial - just has a color
  - can set `wireframe: true`
- a threejs object is made of a mesh
- a mesh needs a material and a geometry
- need to add mesh to scene

### Camera
- Camera takes 2 props:
  1. field of view (degrees) 35-75
  2. aspect-ratio (width / height)
- you can position a camera with .position then .x, .y or .z
- camera needs to be added to the scene
- z- moves camera forward or backward


### Scene
- objects and camera should be added to the scene
- the default is to add items at (0,0,0)

### Renderer
- Threejs way to render the scene throught the camera

### static asset folder
- the asset folder in vite is `public/`.
- if you put assets in this directory, vite will act as if its are the root of the url


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


# ThreeJS

- starter project (starter.zip)

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

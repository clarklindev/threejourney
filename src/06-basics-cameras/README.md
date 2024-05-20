
# Cameras

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
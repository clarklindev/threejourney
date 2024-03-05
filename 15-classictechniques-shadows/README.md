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
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

spotLight.position.set(0, 2, 2);
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
const pointLight = new THREE.PointLight(0xffffff, 0.3);
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

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





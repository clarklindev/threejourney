### Realistic renders

- MeshBasicMaterial requires lighting on scene.. so chnage material of testSphere to MeshStandardMaterial
- we use an environment map to illuminate the model but we also need a DirectionalLight to have more control and create shadows.
- add tweaks to Dat.GUI
- default THREE.js light intensities are based on arbitrary scale unit and dont reflect real-world values
- but its better to base our scene on REALISTIC and standard values - renderer.physicallyCorrectLights = true; (but its now dimmer) 
- increase the light intensity to 3

#### Model
- import and instantiate GLTFLoader
- we dont need DRAcoloader unless the blender model we use is compressed.
- load the flighthelmet
- add it to the scene
- increase its scale, move it down a little and rotate it so it fits our camera view
- add a tweak to rotate the whole model in Dat.GUI

#### env map
- the lighting will be taken care of by the environment map
- an environment map is like a photo of the surrounding and it can be a 360 photo or 6 photos that compose a cube.
- we will use the environment map both for the background and to illuminate our model

```js
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';


//loaders / models
const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf)=>{
  
  gltf.scene.scale.set(10, 10, 10); //increase scale
  gltf.scene.position.set(0, -4, 0);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

});

//test sphere
const testSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1,32,32),
  new THREE.MeshStandardMaterial()
)

//light
const directionalLight = new THREE.DirectionalLight('#FFFFFF', 3);
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);


//add tweaks to Dat.GUI
gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("lightIntensity");

gui
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightX");
gui
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightY");
gui
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightZ");

//use physically correct values
renderer.physicallyCorrectLights = true;



```
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from 'dat.gui';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

// const rgbeLoader = new RGBELoader();
// const textureLoader = new THREE.TextureLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const global = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");


// Scene
const scene = new THREE.Scene();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {

      // child.material.envMap = environmentMap; //change envMap property   //NOTE: handled by scene.environment, same as scene.environment = environmentMap;
      child.material.envMapIntensity = global.envMapIntensity;
      child.material.needsUpdate = true; //tone mapping 

      child.castShadow = true;  //enable shadow for all children
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  '/environmentMaps/0/px.png',
  '/environmentMaps/0/nx.png',
  '/environmentMaps/0/py.png',
  '/environmentMaps/0/ny.png',
  '/environmentMaps/0/pz.png',
  '/environmentMaps/0/nz.png',
]);


// environmentMap.encoding = THREE.sRGBEncoding; //DEPRECATED THREE.sRGBEncoding
//environmentMap.encoding = THREE.SRGBColorSpace; //DEPRECATED .encoding (but works if not using .toneMappingExposure multiplier) 
environmentMap.colorSpace = THREE.LinearSRGBColorSpace; 

scene.background = environmentMap;
scene.environment = environmentMap;

// Global intensity - update after tweaks
global.envMapIntensity = 5;
gui.add(global, "envMapIntensity").min(0).max(10).step(0.001).onChange(updateAllMaterials);

// // HDR (RGBE) equirectangular
// rgbeLoader.load("/environmentMaps/0/2k.hdr", (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;

//   scene.background = environmentMap;
//   scene.environment = environmentMap;
// });



/**
 * Models
 */
// Helmet
// gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
//   gltf.scene.scale.set(10, 10, 10); //increase scale
//   gltf.scene.position.set(0, -4, 0);
//   gltf.scene.rotation.y = Math.PI * 0.5;
  
//   scene.add(gltf.scene);  //add to scene

//   //-Math.PI - half circle to Math.PI half circle in positive direction
//   gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation');

//   updateAllMaterials(); //update materials of whole scene
// });

// Hamburger
gltfLoader.load("/models/hamburger.glb", (gltf) => {
  gltf.scene.scale.set(0.4, 0.4, 0.4);
  gltf.scene.position.set(0, 2.5, 0);
  scene.add(gltf.scene);

  updateAllMaterials();
});

/**
 * Directional light - environment map doesn't have light. So we need it.
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);

// Shadows
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.027;
directionalLight.shadow.bias = -0.004;
directionalLight.shadow.mapSize.set(1024, 1024);

directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

gui.add(directionalLight, "intensity").min(0).max(10).step(0.001).name("lightIntensity");
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001).name("lightX");
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001).name("lightY");
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001).name("lightZ");

gui.add(directionalLight, "castShadow");

// Artifacts on the surface of hamburger are called “shadow acne”.
// Shadow acne can occur on both smooth and flat surfaces for precision reasons when calculating if the surface is in the shadow or not.
// What's happening here is that the hamburger is casting a shadow on its own surface.
// We have to tweak the light shadow's bias and normalBias properties to fix this shadow acne.
// gui.add(directionalLight.shadow, "normalBias").min(-0.05).max(0.05).step(0.001);
// gui.add(directionalLight.shadow, "bias").min(-0.05).max(0.05).step(0.001);

// Helper
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalLightCameraHelper); //see camera being used to create shadow map

// Target - change the position of directional light a bit higher.
// Three.js is using matrices to define object transforms. When we change properties like position, rotation and scale,
// those will be compiled into a matrix, but this process will be done right before the object is being rendered and
// only if it’s in the scene. Even though the directionalLight is in the scene, its target is not.
directionalLight.target.position.set(0, 4, 0);
directionalLight.target.updateWorldMatrix(); // update target!

/**
 * Floor
 */
// const floorColorTexture = textureLoader.load(
//   "/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg"
// );
// const floorNormalTexture = textureLoader.load(
//   "/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png"
// );
// const floorAORoughnessMetalnessTexture = textureLoader.load(
//   "/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg"
// );

// the textures look oddly white
// The color space is a way to optimise how colors are being stored according to the human eye sensitivity.
// This mostly concerns textures that are supposed to be seen (in our case, bricksColorTexture).
// By default, Three.js sets the color space to linear(okay for textures used as information),
// Meaning need to change the floorColorTexture and wallColorTexture.
// We need to set their colorSpace to THREE.SRGBColorSpace

// floorColorTexture.colorSpace = THREE.SRGBColorSpace;

// const floor = new THREE.Mesh(
//   new THREE.PlaneGeometry(8, 8),
//   new THREE.MeshStandardMaterial({
//     map: floorColorTexture,
//     normalMap: floorNormalTexture,
//     aoMap: floorAORoughnessMetalnessTexture,
//     roughnessMap: floorAORoughnessMetalnessTexture,
//     metalnessMap: floorAORoughnessMetalnessTexture,
//   })
// );

// floor.rotation.x = -Math.PI * 0.5;
// scene.add(floor);

/**
 * Wall
 */
// const wallColorTexture = textureLoader.load(
//   "/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg"
// );
// const wallNormalTexture = textureLoader.load(
//   "/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png"
// );
// const wallAORoughnessMetalnessTexture = textureLoader.load(
//   "/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg"
// );

// wallColorTexture.colorSpace = THREE.SRGBColorSpace;

// const wall = new THREE.Mesh(
//   new THREE.PlaneGeometry(8, 8),
//   new THREE.MeshStandardMaterial({
//     map: wallColorTexture,
//     normalMap: wallNormalTexture,
//     aoMap: wallAORoughnessMetalnessTexture,
//     roughnessMap: wallAORoughnessMetalnessTexture,
//     metalnessMap: wallAORoughnessMetalnessTexture,
//   })
// );

// wall.position.y = 4;
// wall.position.z = -4;
// scene.add(wall);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // renderer.physicallyCorrectLights = true; //DEPRECATED: physicallyCorrectLights
  renderer.useLegacyLights = false;


});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true, // get rid of stair-like effect MSAA (mutlisampling activate)
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//renderer.outputEncoding = THREE.sRGBEncoding;  //deprecated use .outputColorSpace 
//outputColorSpace - Defines the output color space of the renderer. Default is THREE.SRGBColorSpace.
renderer.outputColorSpace = THREE.SRGBColorSpace;   //this is default

// Physically accurate lighting
// Default Three.js light intensity values aren't realistic.
// They are based on an arbitrary scale unit and don't reflect real-world values.
// It might be more comfortable to reproduce real-life conditions with useLegacyLights false.
// 👆 Always start the project with useLegacyLights to false.
// renderer.physicallyCorrectLights = true;  //deprecated
// renderer.useLegacyLights = true;  //DEPRECATED https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733
// renderer.useLegacyLights = false; //default
gui.add(renderer, "useLegacyLights");

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Tone mapping
// The tone mapping intends to convert High Dynamic Range (HDR) values to Low Dynamic Range (LDR) values.
// tone mapping in Three.js will actually fake the process of converting LDR to HDR
// even if the colors aren’t HDR resulting in a very realistic render.

renderer.toneMapping = Number(THREE.ReinhardToneMapping);
// renderer.toneMappingExposure = 3; //this should be removed

gui.add(renderer, "toneMapping", {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
})
.onFinishChange(()=>{
  renderer.toneMapping = Number(renderer.toneMapping);
  updateAllMaterials();
});

gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);


 // Animate
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

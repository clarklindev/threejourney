import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import {EXRLoader}  from "three/examples/jsm/loaders/EXRLoader";
import {GroundProjectedSkybox} from "three/examples/jsm/objects/GroundProjectedSkybox";

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

//loader
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const exrLoader = new EXRLoader();
const textureLoader = new THREE.TextureLoader();

const cubeTextureLoader = new THREE.CubeTextureLoader();

//update all materials
const updateAllMaterials = () => {
  console.log("traverse the scene and update all materials here");
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = global.envMapIntensity;
    }
  });
};

scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 1;

gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001);
gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.001);

//global intensity
global.envMapIntensity = 1;


gui
  .add(global, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials);

//environment map
// const environmentMap = cubeTextureLoader.load([
//   "environmentMaps/0/px.png",
//   "environmentMaps/0/nx.png",
//   "environmentMaps/0/py.png",
//   "environmentMaps/0/ny.png",
//   "environmentMaps/0/pz.png",
//   "environmentMaps/0/nz.png",
// ]);
// scene.environment = environmentMap; //apply env map as lighting to whole scene
// scene.background = environmentMap;

// ### HDR (RGBE) equirectangular
// rgbeLoader.load("/environmentMaps/blender-2k-1.hdr", (environmentMap) => {
//   console.log("environmentMap: ", environmentMap);
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = environmentMap;
//   scene.environment = environmentMap;
// });

// ### HDR (EXR) equirectangular

// exrLoader.load('/environmentMaps/nvidiaCanvas-4k.exr', (environmentMap)=>{
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = environmentMap;
//   scene.environment = environmentMap;  //environmentMap working as lighting too
// });

//LDR equirectangular - https://skybox.blockadelabs.com
  // const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg')
  // environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  // environmentMap.colorSpace = THREE.SRGBColorSpace;

  // scene.background = environmentMap;
  // scene.environment = environmentMap;

//GROUND PROJECTED SKYBOX
// rgbeLoader.load("/environmentMaps/2/2k.hdr", (environmentMap) => {
//   console.log("environmentMap: ", environmentMap);
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.environment = environmentMap;
//     //skybox
//     const skybox = new GroundProjectedSkybox(environmentMap);

//     skybox.radius = 120;
//     skybox.height = 11;
//     skybox.scale.setScalar(50);
    
//     scene.add(skybox);

//     gui.add(skybox, 'radius', 1, 200, 0.1).name('skyboxRadius');
//     gui.add(skybox, 'height', 1, 100, 0.1).name('skyboxHeight');
// });

//REALTIME ENVIRONMENT MAP
const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg')
  environmentMap.mapping = THREE.EquirectangularReflectionMappin;
  environmentMap.colorSpace = THREE.SRGBColorSpace;
  scene.background = environmentMap;  //only use as background

// HOLY DONUT
const holyDonut = new THREE.Mesh(
  new THREE.TorusGeometry(8, 0.5),
  new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) })
);
holyDonut.layers.enable(1);
holyDonut.position.y = 3.5;
scene.add(holyDonut);

//CUBE RENDER TARGET
//cube render target - texture where we put renders
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
  256, 
  {
    type: THREE.HalfFloatType   //makes the shine else without it its dull
  }
);

scene.environment = cubeRenderTarget.texture;

//CUBE CAMERA
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
cubeCamera.layers.set(1);

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0,
    metalness: 1,
    color: 0xaaaaaa,
  })
);

torusKnot.position.x = -4;
torusKnot.position.y = 4;
scene.add(torusKnot);

//models
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  console.log("successs");
  gltf.scene.scale.set(10, 10, 10); //scale

  scene.add(gltf.scene);

  //update all materials
  updateAllMaterials();
});

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
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();

  //real time environment map
  if(holyDonut){
    // holyDonut.rotation.x = elapsedTime;
    holyDonut.rotation.x = Math.sin(elapsedTime) * 2;

    cubeCamera.update(renderer, scene);

  }
 
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//CANVAS
const canvas = document.querySelector("canvas.webgl");

//cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

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

//------------------------------------------------------

//CAMERA
//1. field of view (degrees) 35-75 vertical vision
//2. aspect ratio (width / height)
//3. near - how close camera can see - objects closer than near will not show - nice value to use: 0.1
//4. far - how far camera can see - objects further than far will not show - nice value to use: 100

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

//SCENE
const scene = new THREE.Scene();
scene.add(camera);

//AXES HELPER
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

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

//-----------------------------------------------------------

//MESH = GEOMETRY + MATERIAL (TEXTURE or color)

//TEXTURE
const textureLoader = new THREE.TextureLoader(loadingManager);

const colorTexture = textureLoader.load("/textures/door/color.jpg");
// const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
// const heightTexture = textureLoader.load("/textures/door/height.jpg");
// const normalTexture = textureLoader.load("/textures/door/normal.jpg");
// const ambientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg");
// const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
// const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

//MATERIAL
const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
  // color: 0xff0000,
  // wireframe: true,
});

//GEOMETRY
const geometry = new THREE.BoxGeometry(1, 1, 1);

//MESH
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

//position camera
camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 2;
camera.lookAt(mesh.position);

//---------------------------------------------------------
//using THREE.Clock
// const clock = new THREE.Clock();

const tick = () => {
  camera.lookAt(mesh.position);

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
